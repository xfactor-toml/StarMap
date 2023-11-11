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

    private _objects: BattleObject[];
    
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

        this._objects = [];

    }

    private initField() {

        let axiesHelper = new THREE.AxesHelper(150);
        this._dummyMain.add(axiesHelper);

        const fw = SETTINGS.client.field.size.w;

        this._gridTop = new THREE.GridHelper(fw, fw / 10, 0xaa0000);
        this._gridTop.position.z = -SETTINGS.client.field.size.h / 4;
        this._dummyMain.add(this._gridTop);

        this._gridBot = new THREE.GridHelper(fw, fw / 10, 0x00aa00);
        this._gridBot.position.z = SETTINGS.client.field.size.h / 4;
        this._dummyMain.add(this._gridBot);

    }

    private initCameraPosition(aIsTop: boolean) {
        // this._cameraMng.mode = 'orbit';
        this._cameraMng.moveTo({
            aCamPos: { x: 0, y: 120, z: 40 },
            duration: 2
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
                // !
                break;
            
            default:
                this.logWarn(`createObject(): unhandled package:`, aData);
                break;
            
        }

        if (obj) {
            this._dummyMain.add(obj);
            this._objects.push(obj);
        }

    }

    private getObjectById(aId: string): BattleObject {
        for (let i = 0; i < this._objects.length; i++) {
            const obj = this._objects[i];
            if (obj.objId == aId) return obj;
        }
        return null;
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

    onSocketMessage(aData: {
        action: string,
        playerPosition?: 'top' | 'bottom',
        opponent?: string,
        list?: ServerObjectData[]
        
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
                this.updateObject(aData as any);
                break;
        
            default:
                this.logWarn(`onSocketMessage(): unhandled package:`, aData);
                break;
        }
    }

    show() {
        this._dummyMain.visible = true;
    }

    hide() {
        this._dummyMain.visible = false;
    }

    update(dt: number) {
        this._cameraMng.update(dt);
    }

}
