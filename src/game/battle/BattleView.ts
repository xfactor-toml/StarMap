import * as THREE from 'three';
import gsap, { Linear, Sine } from 'gsap';
import { GUI } from 'dat.gui';
import { MyEventDispatcher } from "../basics/MyEventDispatcher";
import { BattleAction } from "./BattleSocket";
import { IUpdatable } from "../interfaces/IUpdatable";
import { BattleObject } from '../objects/battle/BattleObject';
import { BattleStar } from '../objects/battle/BattleStar';
import { BattlePlanet } from '../objects/battle/BattlePlanet';
import { BattleShip1 } from '../objects/battle/BattleShip1';
import { LaserLine } from '../objects/battle/LaserLine';
import { MyMath } from '../utils/MyMath';
import { BattleCameraMng } from './BattleCameraMng';
import { BattlePosition } from '../objects/battle/BattlePosition';
import { ShipEnergyViewer } from './ShipEnergyViewer';

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
    class: 'star' | 'planet' | 'ship',
    position: {
        x: number,
        y: number
    },
    radius?: number, // object radius
    energy?: number,
    hp?: number,
    orbitRadius?: number, // planet orbit radius
    rotationSpeed?: number, // planet rad/sec
    year?: number, // planet period in sec
    orbitCenter?: { x: number, y: number }, // planet orbit center
    orbitSpeed?: number, // planet orbit speed in rad/sec
    startAngle?: number

}

export class BattleView extends MyEventDispatcher implements IUpdatable {
    private _scene: THREE.Scene;
    private _camera: THREE.PerspectiveCamera;
    private _cameraTarget: THREE.Vector3;
    private _cameraMng: BattleCameraMng;

    private _dummyMain: THREE.Group;
    private _gridTop: THREE.GridHelper;
    private _gridBot: THREE.GridHelper;

    private _objects: Map<string, BattleObject>;
    private _shipEnergyViewer: ShipEnergyViewer;

    private _isTopPosition = false;
    
    constructor(aParams: {
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera,
    }) {
        super('BattleScene');

        this._scene = aParams.scene;
        this._camera = aParams.camera;

        this._cameraTarget = new THREE.Vector3();
        this._cameraMng = new BattleCameraMng({
            camera: this._camera,
            cameraTarget: this._cameraTarget
        });

        this._dummyMain = new THREE.Group();
        // this._dummyMain.visible = !aIsHided;
        this._scene.add(this._dummyMain);

        this._objects = new Map<string, BattleObject>;
        this._shipEnergyViewer = new ShipEnergyViewer(this._dummyMain);

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

        this._gridBot = new THREE.GridHelper(fw, fw / 10, 0x999999, 0x333333);
        this._gridBot.position.y = -1;
        this._gridBot.position.z = 0;
        this._dummyMain.add(this._gridBot);

    }

    private initCameraPosition(aIsTop: boolean) {
        let zFactor = aIsTop ? -1 : 1;
        this._cameraMng.moveTo({
            aCamPos: { x: 0, y: 120, z: 5 * zFactor },
            aTargetPos: { x: 0, y: 0, z: 1 * zFactor },
            duration: 2,
        });
    }

    private serverValueToClient(aServerValue: number): number {
        const factor = SETTINGS.client.field.size.w / SETTINGS.server.field.size.w;
        return aServerValue * factor;
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

    private getPositionByServer(aServerPos: {x: number, y: number}): THREE.Vector3 {
        return new THREE.Vector3(
            this.serverToClientX(aServerPos.x),
            0,
            this.serverToClientY(aServerPos.y),
        );
    }

    private onGameStartPacket(aData: {
        playerPosition?: 'top' | 'bottom'
    }) {
        this.initField();
        this._isTopPosition = aData.playerPosition == 'top';
        this._shipEnergyViewer.isTopViewPosition = this._isTopPosition;
        this.initCameraPosition(this._isTopPosition);
    }

    private createObject(aData: ServerObjectData) {
        let obj: BattleObject;

        switch (aData.class) {

            case 'star':
                obj = new BattleStar({
                    id: aData.id,
                    radius: this.serverValueToClient(aData.radius),
                    maxHp: aData.energy,
                    camera: this._camera,
                });
                obj.position.copy(this.getPositionByServer({ x: aData.position.x, y: aData.position.y }));
                // add hp bar
                this._shipEnergyViewer.addBar(obj);
                break;
            
            case 'planet':
                let oCenter = this.getPositionByServer(aData.orbitCenter);
                obj = new BattlePlanet(aData.id, {
                    orbitCenter: {
                        x: oCenter.x,
                        y: oCenter.z
                    },
                    orbitRadius: this.serverValueToClient(aData.orbitRadius),
                    orbitSpeed: aData.orbitSpeed,
                    radius: this.serverValueToClient(aData.radius),
                    rotationSpeed: aData.rotationSpeed,
                    year: aData.year,
                    startAngle: aData.startAngle
                });
                // obj.position.copy(this.getPositionByServer(aData));
                break;
            
            case 'ship':
                let r = this.serverValueToClient(aData.radius);
                obj = new BattleShip1({
                    id: aData.id,
                    radius: r,
                    maxHp: aData.hp
                });
                obj.createDebugSphere(r);
                obj.position.copy(this.getPositionByServer({ x: aData.position.x, y: aData.position.y }));
                if (aData.position.y > 500) {
                    obj.rotation.y = Math.PI;
                }
                // add hp bar
                this._shipEnergyViewer.addBar(obj);
                break;
            
            default:
                this.logWarn(`createObject(): unknown class:`, aData);
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

    private updateObject(aParams: {
        id: string,
        data: {
            event?: 'startmoving' | 'starAttackPositions' | 'stopmoving',
            target?: { x: number, y: number },
            position?: { x: number, y: number },
            energy?: number,
            hp?: number,
            timeTo?: number,
            list?: any[]
        }
    }) {
        const data = aParams.data;

        let obj = this.getObjectById(aParams.id);
        if (!obj) {
            this.logError(`updateObject: !obj`, aParams);
            return;
        }

        let eventName = data?.event;
        switch (eventName) {

            case 'starAttackPositions':
                let posList: {
                    center: { x, y },
                    hold: boolean
                }[] = data.list;
                
                for (let i = 0; i < posList.length; i++) {
                    const pos = posList[i];
                    // let p = new BattlePosition();
                }

                break;
            
            default:
                
                // universal update

                if (data?.position) {
                    // update position
                    obj.targetPosition = {
                        x: this.serverToClientX(data.position.x),
                        z: this.serverToClientY(data.position.y)
                    }
                }

                if (data?.energy) {
                    // update hp
                    obj.hp = data.energy;
                }

                if (data?.hp) {
                    // update hp
                    obj.hp = data.hp;
                }

                break;
            
        }

    }

    private attack(aData: {
        from: string,
        to: string,
        wasHP: number,
        damage: number,
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
                // this._dummyMain.remove(laser);
                laser.free();
            },
            ctx: this
        });

        if (aData.hit) {
            toObj.hp -= aData.damage;
        }

    }

    private destroyObject(aId: string) {

        this._shipEnergyViewer.removeBar(aId);

        let obj = this.getObjectById(aId);
        if (!obj) {
            this.logError(`updateObject(): !obj`, aId);
            return;
        }
        obj.free();
        // this._dummyMain.remove(obj);
        this._objects.delete(aId);
    }

    initDebugGui(aFolder: GUI) {
        const DATA = {
            randomLaserRed: () => {
                let ship1 = this.getRandomShip();
                let ship2 = this.getRandomShip();
                if (!ship1 || !ship2 || ship1.objId == ship2.objId) return;
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
                if (!ship1 || !ship2 || ship1.objId == ship2.objId) return;
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
        // f.add(DATA, 'randomLaserRed');
        // f.add(DATA, 'randomLaserBlue');
    }

    destroyAllObjects() {
        this._objects.forEach(obj => {
            obj.free();
        });
        this._objects.clear();
    }

    onSocketMessage(aData: {
        action: string,
        // opponent?: string,
        // list?: ServerObjectData[],
        data?: any,
        class?: 'ship',
        list?: any[]
    } & any) {
        switch (aData.action) {

            case BattleAction.log: break;
                
            /**
             * action: gamestart,
             * data: {
             *      playerPosition: 'top' | 'bottom',
             * }
             */
            case BattleAction.gamestart:
                this.onGameStartPacket(aData || {});
                break;

            /**
             * action: objectcreate,
             * data: {
             *      objects: {...fields}[]
             * }
             */
            case BattleAction.objectcreate: {
                let objList = aData.list;
                if (objList)
                for (let i = 0; i < objList.length; i++) {
                    const objData = objList[i];
                    this.createObject(objData);
                }
            } break;
            
            /**
             * action: objectupdate,
             * data: {
             *      objects: {...fields}[]
             * }
             */
            case BattleAction.objectupdate:
                
                switch (aData.class) {

                    case 'ship':
                        let list = aData.data.list || [];
                        for (let i = 0; i < list.length; i++) {
                            const e = list[i];
                            this.updateObject({
                                id: e.id,
                                data: e
                            });
                        }
                        break;
                    
                    default:

                        if (aData.data?.from != undefined && aData.data?.to != undefined) {
                            this.attack(aData.data);
                        }
                        else {
                            this.updateObject({
                                id: aData.id,
                                data: aData.data
                            });
                        }
                        break;
                    
                }
                
                break;
                
            // case BattleAction.event:
            //     switch (aData.type) {
            //         case 'attack':
            //             // this.attack(aData);
            //             break;
            //         default:
            //             break;
            //     }
            //     break;
            
            case BattleAction.objectdestroy:
                this.destroyObject(aData.id);
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
        //
        this._shipEnergyViewer.clear();
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

        this._objects.forEach((obj) => {
            obj.update(dt);
        });

        this._shipEnergyViewer.update(dt);

    }

}
