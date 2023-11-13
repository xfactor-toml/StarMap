import * as THREE from 'three';
import { MyEventDispatcher } from "../basics/MyEventDispatcher";
import { BattleAction } from "../battle/BattleSocket";
import { IUpdatable } from "../interfaces/IUpdatable";
import { BattleObject } from '../objects/battle/BattleObject';
import { BattleStar } from '../objects/battle/BattleStar';
import { Settings } from '../data/Settings';
import { BattlePlanet } from '../objects/battle/BattlePlanet';
import { MyOrbitControls } from '../mythree/MyOrbitControls';
import { BattleCameraMng } from './BattleCameraMng';
import { BattleShip1 } from '../objects/battle/BattleShip1';
import { LaserLine } from '../objects/battle/LaserLine';
import { GUI } from 'dat.gui';
import { MyMath } from '../utils/MyMath';

const SETTINGS = {

    server: {
        field: {
            size: {
                w: 800,
                h: 1000
            }
        }
    },

    client: {
        field: {
            size: {
                w: 80,
                h: 100
            }
        }
    }

}

type ServerObjectData = {
    id: string,
    owner: string,
    class: string,
    mirror: boolean,
    center: {
        x: number,
        y: number
    }
}

export class BattleScene extends MyEventDispatcher implements IUpdatable {
    private _scene: THREE.Scene;
    private _camera: THREE.PerspectiveCamera;
    private _cameraTarget: THREE.Vector3;
    private _cameraMng: BattleCameraMng;

    private _dummyMain: THREE.Group;
    private _gridTop: THREE.GridHelper;
    private _gridBot: THREE.GridHelper;

    private _objects: Map<string, BattleObject>;
    
    constructor(aParams: {
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera,
    }, aIsHided = false) {
        super('BattleScene');

        this._scene = aParams.scene;
        this._camera = aParams.camera;

        this._cameraTarget = new THREE.Vector3();
        this._cameraMng = new BattleCameraMng({
            camera: this._camera,
            cameraTarget: this._cameraTarget
        });

        this._dummyMain = new THREE.Group();
        this._dummyMain.visible = !aIsHided;
        this._scene.add(this._dummyMain);

        this._objects = new Map<string, BattleObject>;

    }

    private initField() {

        // _axiesHelper = new THREE.AxesHelper(150);
        // this._dummyMain.add(axiesHelper);

        const fw = SETTINGS.client.field.size.w;

        // this._gridTop = new THREE.GridHelper(fw, fw / 10, 0xaa0000);
        // this._gridTop.position.z = -SETTINGS.client.field.size.h / 4;
        // this._dummyMain.add(this._gridTop);

        // this._gridBot = new THREE.GridHelper(fw, fw / 10, 0x00aa00);
        // this._gridBot.position.z = SETTINGS.client.field.size.h / 4;
        // this._dummyMain.add(this._gridBot);

    }

    private initCameraPosition(aIsTop: boolean) {
        // this._cameraMng.mode = 'orbit';
        this._cameraMng.moveTo({
            aCamPos: { x: 0, y: 120, z: 50 },
            duration: 2,
            aTargetPos: { x: 0, y: 0, z: 10 },
        });
    }

    private serverToClientX(aServerX: number): number {
        const factor = SETTINGS.client.field.size.w / SETTINGS.server.field.size.w;
        const h = SETTINGS.client.field.size.w / 2;
        return aServerX * factor - h;
    }

    private serverToClientY(aServerY: number): number {
        const factor = SETTINGS.client.field.size.h / SETTINGS.server.field.size.h;
        const h = SETTINGS.client.field.size.h / 2;
        return aServerY * factor - h;
    }

    private getPositionByServer(aData: ServerObjectData): THREE.Vector3 {
        return new THREE.Vector3(
            this.serverToClientX(aData.center.x),
            0,
            this.serverToClientY(aData.center.y),
        );
    }

    private createObject(aData: ServerObjectData) {
        let obj: BattleObject;

        switch (aData.class) {

            case 'star':
                obj = new BattleStar(aData.id);
                obj.position.copy(this.getPositionByServer(aData));
                break;
            
            case 'planet':
                obj = new BattlePlanet(aData.id);
                obj.position.copy(this.getPositionByServer(aData));
                break;
            
            case 'ship':
                obj = new BattleShip1(aData.id);
                obj.position.copy(this.getPositionByServer(aData));
                break;
            
            default:
                this.logWarn(`createObject(): unhandled package:`, aData);
                break;
            
        }

        if (obj) {
            this._dummyMain.add(obj);
            this._objects.set(aData.id, obj);
        }

    }

    private getObjectById(aId: string): BattleObject {
        return this._objects.get(aId);
    }

    private getRandomShip(exclude?: BattleObject[]): BattleObject {
        let ships: BattleObject[] = [];
        this._objects.forEach((aObj) => {
            if (aObj instanceof BattleShip1) ships.push(aObj);
        })
        if (ships.length <= 0) return null;
        let id = MyMath.randomIntInRange(0, ships.length - 1);
        return ships[id];
    }

    private updateObject(aData: {
        id: string,
        coords: number[], // Серверные** координаты объекта
        data: any // Новые параметры
    }) {

        let obj = this.getObjectById(aData.id);
        if (!obj) {
            this.logError(`updateObject: !obj`, aData);
            return;
        }

        obj.position.x = this.serverToClientX(aData.coords[0]);
        obj.position.z = this.serverToClientY(aData.coords[1]);

    }

    private attack(aData: {
        from: string,
        to: string,
        wasHP: number,
        damage,
        hit: boolean,
        isRed?: boolean
    }) {

        let fromObj = this.getObjectById(aData.from);
        if (!fromObj) {
            this.logWarn(`attack: !fromObj`, aData);
            return;
        }

        let toObj = this.getObjectById(aData.to);
        if (!toObj) {
            this.logWarn(`attack: !toObj`, aData);
            return;
        }
        
        // create laser
        const redLaserColor = '#ff0000';
        const blueLaserColor = '#0072ff';
        const purpleLaserColor = '#5e48ff';
        let laser = new LaserLine(fromObj.position.clone(), toObj.position.clone(), aData.isRed ? redLaserColor : blueLaserColor);
        this._dummyMain.add(laser);
        laser.hide({
            dur: 1,
            cb: () => {
                this._dummyMain.remove(laser);
            },
            ctx: this
        });

    }

    private destroyObject(aId: string) {
        if (!this._objects.delete(aId)) {
            this.logError(`destroyObject: !obj`, aId);
        }
    }

    initDebugGui(aFolder: GUI) {
        const DATA = {
            randomLaserRed: () => {
                let ship1 = this.getRandomShip();
                let ship2 = this.getRandomShip();
                if (ship1.objId == ship2.objId) return;
                this.attack({
                    from: ship1.objId,
                    to: ship2.objId,
                    damage: 10,
                    wasHP: 100,
                    hit: true,
                    isRed: true
                });
            },
            randomLaserBlue: () => {
                let ship1 = this.getRandomShip();
                let ship2 = this.getRandomShip();
                if (ship1.objId == ship2.objId) return;
                this.attack({
                    from: ship1.objId,
                    to: ship2.objId,
                    damage: 10,
                    wasHP: 100,
                    hit: true
                });
            }
        }
        const f = aFolder;
        f.add(DATA, 'randomLaserRed');
        f.add(DATA, 'randomLaserBlue');
    }

    destroyAllObjects() {
        this._objects.clear();
    }

    onSocketMessage(aData: {
        action: string,
        playerPosition?: 'top' | 'bottom',
        opponent?: string,
        list?: ServerObjectData[],
        data?
        
    }) {
        switch (aData.action) {
            case BattleAction.gamestart:
                this.initField();
                this.initCameraPosition(aData.playerPosition == 'top');
                this.show();
                break;
            
            case BattleAction.objectlist: {
                let objList = aData.list;
                for (let i = 0; i < objList.length; i++) {
                    const objData = objList[i];
                    this.createObject(objData);
                }
            } break;
            
            case BattleAction.objectcreate: {
                let objList = aData.list;
                for (let i = 0; i < objList.length; i++) {
                    const objData = objList[i];
                    this.createObject(objData);
                }
            } break;
            
            case BattleAction.objectupdate:
                if (aData.data?.from != undefined && aData.data?.to != undefined) {
                    this.attack(aData.data);
                }
                else {
                    this.updateObject(aData.data);
                }
                break;
            
            case BattleAction.attack:
                this.attack(aData.data);
                break;
            
            case BattleAction.objectdestroy:
                this.destroyObject(aData.data.id);
                break;
            
            default:
                this.logWarn(`onSocketMessage(): unhandled package (${aData.action}):`, aData);
                break;
        }
    }

    show() {
        this._dummyMain.visible = true;
    }

    hide() {
        this._dummyMain.visible = false;
    }

    clear() {
        // clear all objects
        this.destroyAllObjects();
        // destroy grids
        if (this._gridTop) {
            this._dummyMain.remove(this._gridTop);
            this._gridTop = null;
        }
        if (this._gridBot) {
            this._dummyMain.remove(this._gridBot);
            this._gridBot = null;
        }
    }

    update(dt: number) {
        this._cameraMng.update(dt);
    }

}
