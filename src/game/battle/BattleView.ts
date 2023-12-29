import * as THREE from 'three';
import gsap, { Linear, Sine } from 'gsap';
import { GUI } from 'dat.gui';
import { MyEventDispatcher } from "../basics/MyEventDispatcher";
import { IUpdatable } from "../interfaces/IUpdatable";
import { BattleObject } from '../objects/battle/BattleObject';
import { BattleStar } from '../objects/battle/BattleStar';
import { BattlePlanet } from '../objects/battle/BattlePlanet';
import { BattleFighter } from '../objects/battle/BattleFighter';
import { LaserLine } from '../objects/battle/LaserLine';
import { MyMath } from '../utils/MyMath';
import { BattleCameraMng } from './BattleCameraMng';
import { BattlePosition } from '../objects/battle/BattlePosition';
import { ObjectEnergyViewer } from './ObjectEnergyViewer';
import { BattleShip } from '../objects/battle/BattleShip';
import { Settings } from '../data/Settings';
import { FieldInitData, ObjectType, ObjectUpdateData, PackTitle } from './Types';
import { BattleConnection } from './BattleConnection';
import { FieldCell } from '../objects/battle/FieldCell';

const SETTINGS = {

    server: {
        field: {
            size: {
                cols: 8,
                rows: 10,
                sectorWidth: 10,
                sectorHeight: 3 / 4 * 10,
                w: 8 * 10,
                h: 10 * 3 / 4 * 10
            },
        },

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

export class BattleView extends MyEventDispatcher implements IUpdatable {
    private _walletNumber: string;
    private _scene: THREE.Scene;
    private _camera: THREE.PerspectiveCamera;
    private _connection: BattleConnection;
    private _cameraTarget: THREE.Vector3;
    private _cameraMng: BattleCameraMng;

    private _dummyMain: THREE.Group;
    private _gridTop: THREE.GridHelper;
    private _gridBot: THREE.GridHelper;

    private _objects: Map<number, BattleObject>;
    private _shipEnergyViewer: ObjectEnergyViewer;

    private _isTopPosition = false;

    constructor(aParams: {
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera,
        connection: BattleConnection
    }) {
        super('BattleScene');

        this._scene = aParams.scene;
        this._camera = aParams.camera;
        this._connection = aParams.connection;

        this._cameraTarget = new THREE.Vector3();
        this._cameraMng = new BattleCameraMng({
            camera: this._camera,
            cameraTarget: this._cameraTarget
        });

        this._dummyMain = new THREE.Group();
        // this._dummyMain.visible = !aIsHided;
        if (Settings.isDebugMode) {
            let axiesHelper = new THREE.AxesHelper(150);
            this._dummyMain.add(axiesHelper);
        }
        this._scene.add(this._dummyMain);

        this._objects = new Map();
        this._shipEnergyViewer = new ObjectEnergyViewer(this._dummyMain);

        this.initConnectionListeners();

    }

    private initConnectionListeners() {
        this._connection.socket.on(PackTitle.fieldInit, (aData: FieldInitData) => {
            this.onFieldInitPack(aData);
        });
        this._connection.socket.on(PackTitle.objectCreate, (aData) => {
            this.onObjectCreatePack(aData);
        });
        this._connection.socket.on(PackTitle.objectUpdate, (aData) => {
            this.onObjectUpdatePack(aData);
        });
    }

    private onFieldInitPack(aData: FieldInitData) {
        SETTINGS.server.field = aData.fieldParams;
        let fieldSize = SETTINGS.server.field.size;
        fieldSize.w = fieldSize.cols * fieldSize.sectorWidth;
        fieldSize.h = fieldSize.rows * fieldSize.sectorHeight;
        this.initField();
        this._isTopPosition = aData.playerPosition == 'top';
        this._shipEnergyViewer.isTopViewPosition = this._isTopPosition;
        this.initCameraPosition(this._isTopPosition);
    }

    private onObjectCreatePack(aData: {
        type: ObjectType
    }) {
        switch (aData.type) {
            case 'Star':
                this.createObject(aData as any);
                break;
            case 'FighterShip':
                this.createObject(aData as any);
                break;

            default:
                break;
        }
    }

    private onObjectUpdatePack(aData: ObjectUpdateData[]) {
        for (let i = 0; i < aData.length; i++) {
            const data = aData[i];

            let obj = this._objects.get(data.id);
            if (!obj) {
                this.logError(`updateObject: !obj for data:`, data);
                return;
            }

            if (data.pos) {
                obj.targetPosition = {
                    x: this.serverToClientX(data.pos.x),
                    z: this.serverToClientY(data.pos.z)
                }
            }

            if (data.q) {
                obj.setQuaternion(data.q);
            }

        }

    }

    private initField() {

        const fSize = SETTINGS.server.field.size;

        // this._gridTop = new THREE.GridHelper(fw, fw / 10, 0xaa0000);
        // this._gridTop.position.z = -SETTINGS.client.field.size.h / 4;
        // this._dummyMain.add(this._gridTop);

        // this._gridBot = new THREE.GridHelper(fw, fw / 10, 0x00aa00);
        // this._gridBot.position.z = SETTINGS.client.field.size.h / 4;
        // this._dummyMain.add(this._gridBot);

        // this._gridBot = new THREE.GridHelper(fSize.w, fSize.w / 10, 0x999999, 0x333333);
        // this._gridBot.position.y = -1;
        // this._gridBot.position.z = 0;
        // this._dummyMain.add(this._gridBot);

        for (let cy = 0; cy < fSize.rows; cy++) {
            for (let cx = 0; cx < fSize.cols; cx++) {
                let fieldCell = new FieldCell(4);
                fieldCell.position.copy(this.getPosByCellPos({ x: cx, y: cy }));
                this._dummyMain.add(fieldCell);
            }
        }

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
        const wh = SETTINGS.client.field.size.w / 2;
        const dx = SETTINGS.server.field.size.sectorWidth / 2 * factor;
        return aServerX * factor - wh + dx;
    }

    private serverToClientY(aServerY: number): number {
        const factor = SETTINGS.client.field.size.h / SETTINGS.server.field.size.h;
        const h = SETTINGS.client.field.size.h / 2;
        const dy = SETTINGS.server.field.size.sectorHeight / 2 * factor;
        return aServerY * factor - h + dy;
    }

    private getPositionByServer(aServerPos: { x: number, y: number }): THREE.Vector3 {
        return new THREE.Vector3(
            this.serverToClientX(aServerPos.x),
            0,
            this.serverToClientY(aServerPos.y),
        );
    }

    private getPosByCellPos(aCellPos: { x: number, y: number }): THREE.Vector3 {
        const fx = SETTINGS.server.field.size.sectorWidth;
        const fy = SETTINGS.server.field.size.sectorHeight;
        const dx = aCellPos.y % 2 === 0 ? 0 : fx / 2;
        return new THREE.Vector3(
            this.serverToClientX(aCellPos.x * fx + dx),
            0,
            this.serverToClientY(aCellPos.y * fy),
        );
    }

    private createObject(aData: {
        // common params
        type: ObjectType,
        owner?: string, // owner id
        radius?: number,
        hp?: number

        id: number,
        pos: {
            x: number,
            y: number,
            z: number
        },
        q: {
            x: number,
            y: number,
            z: number,
            w: number
        },

        /**
         * special data for planets
         */
        planetData?: {
            orbitRadius?: number,
            orbitCenter?: { x: number, y: number },
            startOrbitAngle?: number,
            year?: number,
            rotationSpeed?: number,
            orbitSpeed?: number,
        }
    }) {
        let obj: BattleObject;

        switch (aData.type) {

            case 'Star':
                obj = new BattleStar({
                    id: aData.id,
                    radius: this.serverValueToClient(aData.radius),
                    maxHp: aData.hp,
                    camera: this._camera,
                });
                if (aData.pos) obj.position.copy(this.getPositionByServer({ x: aData.pos.x, y: aData.pos.z }));
                // add hp bar
                this._shipEnergyViewer.addBar(obj);
                this._objects.set(aData.id, obj);
                break;

            case 'Planet':
                let oCenter = this.getPositionByServer(aData.planetData.orbitCenter);
                obj = new BattlePlanet(aData.id, {
                    orbitCenter: {
                        x: oCenter.x,
                        y: oCenter.z
                    },
                    orbitRadius: this.serverValueToClient(aData.planetData.orbitRadius),
                    orbitSpeed: aData.planetData.orbitSpeed,
                    radius: this.serverValueToClient(aData.radius),
                    rotationSpeed: aData.planetData.rotationSpeed,
                    year: aData.planetData.year,
                    startOrbitAngle: aData.planetData.startOrbitAngle
                });
                break;

            case 'FighterShip': {
                let r = this.serverValueToClient(aData.radius);
                obj = new BattleFighter({
                    id: aData.id,
                    radius: r,
                    maxHp: aData.hp,
                    owner: aData.owner
                });
                obj.createDebugSphere(r);
                if (aData.pos) obj.position.copy(this.getPositionByServer({ x: aData.pos.x, y: aData.pos.z }));
                // if (aData.dirrection) obj.setDirrection(aData.dirrection);
                if (aData.q) obj.setQuaternion(aData.q);
                // add hp bar
                this._shipEnergyViewer.addBar(obj);
            } break;

            case 'BattleShip': {
                let r = this.serverValueToClient(aData.radius);
                obj = new BattleShip({
                    id: aData.id,
                    radius: r,
                    maxHp: aData.hp,
                    owner: aData.owner
                });
                obj.createDebugSphere(r);
                if (aData.pos) obj.position.copy(this.getPositionByServer({ x: aData.pos.x, y: aData.pos.y }));
                // if (aData.rotation) obj.targetRotation = obj.rotation.y = aData.rotation;
                if (aData.q) obj.setQuaternion(aData.q);
                // add hp bar
                this._shipEnergyViewer.addBar(obj);
            } break;

            default:
                this.logWarn(`createObject(): unknown obj type:`, aData);
                break;

        }

        if (obj) {
            this._dummyMain.add(obj);
            this._objects.set(aData.id, obj);
        }

    }

    private getObjectById(aId: number): BattleObject {
        return this._objects.get(aId);
    }

    private getRandomShip(exclude?: BattleObject[]): BattleObject {
        let ships: BattleObject[] = [];
        this._objects.forEach((aObj) => {
            if (aObj instanceof BattleFighter) ships.push(aObj);
        })
        if (ships.length <= 0) return null;
        let id = MyMath.randomIntInRange(0, ships.length - 1);
        return ships[id];
    }

    private updateObject_OLD(aParams: {
        id: number,
        event?: 'starAttackPositions',
        position?: { x: number, y: number },
        rotation?: number,
        hp?: number,
        /**
         * Any other data
         */
        data?: any
    }) {

        let obj = this.getObjectById(aParams.id);
        if (!obj) {
            this.logError(`updateObject: !obj`, aParams);
            return;
        }

        switch (aParams.event) {

            case 'starAttackPositions':
                let posList: {
                    center: { x, y },
                    hold: boolean
                }[] = aParams.data.list;

                for (let i = 0; i < posList.length; i++) {
                    const pos = posList[i];
                    // let p = new BattlePosition();
                }

                break;

            default:

                if (aParams.position) {
                    // update position
                    obj.targetPosition = {
                        x: this.serverToClientX(aParams.position.x),
                        z: this.serverToClientY(aParams.position.y)
                    }
                }

                // if (aParams.rotation != undefined) {
                // update position
                // obj.targetRotation = aParams.rotation;
                // }

                if (aParams.hp != undefined) {
                    // update hp
                    obj.hp = aParams.hp;
                }

                break;

        }

    }

    private attack(aParams: {
        type: 'laser' | 'ray',
        data: {
            idFrom: number,
            idTo: number,
            damage?: number,
            isMiss?: boolean,
            state?: 'start' | 'end'
        }
    }) {

        let objFrom = this.getObjectById(aParams.data.idFrom);
        if (!objFrom) {
            this.logWarn(`attack: !fromObj`, aParams);
            return;
        }

        let objTo = this.getObjectById(aParams.data.idTo);
        if (!objTo) {
            this.logWarn(`attack: !toObj`, aParams);
            return;
        }

        let laserColor = '#0072ff';
        // const purpleLaserColor = '#5e48ff';
        if (objFrom.owner.length > 0 && objFrom.owner != this._walletNumber) {
            laserColor = '#ff0000';
        }

        switch (aParams.type) {
            case 'ray': {
                // create laser
                let laser = new LaserLine(objFrom.position.clone(), objTo.position.clone(), laserColor);
                this._dummyMain.add(laser);
                laser.hide({
                    dur: 1,
                    cb: () => {
                        laser.free();
                    },
                    ctx: this
                });
            } break;

            default:
                // create laser
                let laser = new LaserLine(objFrom.position.clone(), objTo.position.clone(), laserColor);
                this._dummyMain.add(laser);
                laser.hide({
                    dur: 1,
                    cb: () => {
                        laser.free();
                    },
                    ctx: this
                });
                break;
        }

        if (!aParams.data.isMiss) {
            objTo.hp -= aParams.data.damage;
        }

    }

    private destroyObject(aId: number) {
        this._shipEnergyViewer.removeBar(aId);
        let obj = this.getObjectById(aId);
        if (!obj) {
            this.logError(`updateObject(): !obj`, aId);
            return;
        }
        obj.free();
        this._objects.delete(aId);
    }

    public get walletNumber(): string {
        return this._walletNumber;
    }

    public set walletNumber(value: string) {
        this._walletNumber = value;
    }

    initDebugGui(aFolder: GUI) {
        const DATA = {
            randomLaserRed: () => {
                let ship1 = this.getRandomShip();
                let ship2 = this.getRandomShip();
                if (!ship1 || !ship2 || ship1.objId == ship2.objId) return;
                this.attack({
                    type: 'laser',
                    data: {
                        idFrom: ship1.objId,
                        idTo: ship2.objId,
                        damage: 10
                    }
                });
            },
            randomLaserBlue: () => {
                let ship1 = this.getRandomShip();
                let ship2 = this.getRandomShip();
                if (!ship1 || !ship2 || ship1.objId == ship2.objId) return;
                this.attack({
                    type: 'laser',
                    data: {
                        idFrom: ship1.objId,
                        idTo: ship2.objId,
                        damage: 10
                    }
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

    onSocketMessage_OLD(aData: {
        title?: string,
        action?: string,
        // opponent?: string,
        // list?: ServerObjectData[],
        data?: any,
        class?: 'ship',
        list?: any[]
    } & any) {

        const packTitle = aData.title || aData.action;

        switch (packTitle) {

            // case PackTitle.gamestart:
            //     this.onGameStartPacket(aData || {});
            //     break;

            case PackTitle.objectCreate: {
                let list = aData.list;
                for (let i = 0; i < list.length; i++) {
                    const objData = list[i];
                    this.createObject(objData);
                }
            } break;

            case PackTitle.objectUpdate:
                let list: any[] = aData.list;
                for (let i = 0; i < list.length; i++) {
                    const objData = list[i];
                    this.updateObject_OLD(objData);
                }
                break;

            // case PackTitle.objectdestroy:
            //     this.destroyObject(aData.id);
            //     break;

            case PackTitle.attack:
                this.attack(aData);
                break;

            default:
                this.logWarn(`onSocketMessage(): unhandled package (${packTitle}):`, aData);
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
