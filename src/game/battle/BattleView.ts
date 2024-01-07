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
import { ObjectEnergyViewer } from './ObjectEnergyViewer';
import { BattleShip } from '../objects/battle/BattleShip';
import { Settings } from '../data/Settings';
import { FieldInitData, ObjectCreateData, ObjectType, ObjectUpdateData, PackTitle } from './Types';
import { BattleConnection } from './BattleConnection';
import { FieldCell } from '../objects/battle/FieldCell';
import { getWalletAddress } from '~/blockchain/functions/auth';

type ServerFieldParams = {

}

const SETTINGS = {

    server: {
        field: {
            size: {
                cols: 8,
                rows: 10,
                sectorWidth: 10,
                sectorHeight: 9,
                w: 8 * 10,
                h: 10 * 9
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
        super('BattleView');

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
        this._connection.socket.on(PackTitle.objectDestroy, (aIds: number[]) => {
            this.onObjectDestroyPack(aIds);
        });
        this._connection.socket.on(PackTitle.attack, (aData) => {
            this.attack(aData);
        });
    }

    private onFieldInitPack(aData: FieldInitData) {
        // update wallet number
        this._walletNumber = getWalletAddress();

        SETTINGS.server.field = aData.fieldParams;
        let fieldSize = SETTINGS.server.field.size;
        fieldSize.w = fieldSize.cols * fieldSize.sectorWidth;
        fieldSize.h = fieldSize.rows * fieldSize.sectorHeight;
        this.initField();

        this._isTopPosition = aData.playerPosition == 'top';
        this._shipEnergyViewer.isTopViewPosition = this._isTopPosition;
        this.initCameraPosition(this._isTopPosition);
        
    }

    private onObjectCreatePack(aData: ObjectCreateData) {
        let obj: BattleObject;

        switch (aData.type) {

            case 'Star':
                obj = new BattleStar(aData);
                if (aData.pos) obj.position.copy(this.getPositionByServer({ x: aData.pos.x, y: aData.pos.z }));
                // add hp bar
                this._shipEnergyViewer.addBar(obj);
                this._objects.set(aData.id, obj);
                break;

            case 'Planet':
                obj = new BattlePlanet(aData);
                if (aData.pos) obj.position.copy(this.getPositionByServer({ x: aData.pos.x, y: aData.pos.z }));
                if (aData.q) obj.setQuaternion(aData.q);
                this._objects.set(aData.id, obj);
                break;

            case 'FighterShip': {
                let r = this.serverValueToClient(aData.radius);
                obj = new BattleFighter(aData);
                obj.createDebugRadiusSphere();
                obj.createDebugAttackSphere();

                if (aData.pos) {
                    const clientPos = this.getPositionByServer({ x: aData.pos.x, y: aData.pos.z });
                    obj.targetPosition = clientPos;
                    obj.position.copy(clientPos);
                }

                if (aData.q) obj.setQuaternion(aData.q);
                // add hp bar
                this._shipEnergyViewer.addBar(obj);
            } break;

            case 'BattleShip': {
                this.logDebug(`onObjectCreatePack(): BattleShip:`, aData);
                let r = this.serverValueToClient(aData.radius);
                obj = new BattleShip(aData);
                obj.createDebugRadiusSphere();
                obj.createDebugAttackSphere();

                if (aData.pos) {
                    const clientPos = this.getPositionByServer({ x: aData.pos.x, y: aData.pos.z });
                    this.logDebug(`clientPos:`, clientPos);
                    obj.targetPosition = clientPos;
                    obj.position.copy(clientPos);
                }

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

    private onObjectUpdatePack(aData: ObjectUpdateData[]) {
        for (let i = 0; i < aData.length; i++) {
            const data = aData[i];

            let obj = this._objects.get(data.id);
            if (!obj) {
                this.logError(`updateObject: !obj for data:`, data);
                return;
            }

            if (obj instanceof BattlePlanet) {
                // this.logDebug(`planet update:`, data);
            }

            if (obj instanceof BattleShip) {
                // this.logDebug(`BattleShip update:`, data);
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

            if (data.hp != undefined) {
                obj.hp = data.hp;
            }

        }

    }

    private onObjectDestroyPack(aIds: number[]) {
        for (let i = 0; i < aIds.length; i++) {
            this.destroyObject(aIds[i]);
        }
    }

    private attack(aData: {
        attackType: 'laser' | 'ray',
        idFrom: number,
        idTo: number,
        damage?: number,
        isMiss?: boolean
    }) {

        let objFrom = this.getObjectById(aData.idFrom);
        if (!objFrom) {
            this.logWarn(`attack: !fromObj`, aData);
            return;
        }

        let objTo = this.getObjectById(aData.idTo);
        if (!objTo) {
            this.logWarn(`attack: !toObj`, aData);
            return;
        }

        // this.logDebug(`attack(): wallet: ${this._walletNumber}, ship owner: ${objFrom.owner}`);
        let laserColor = '#0072ff';
        // const purpleLaserColor = '#5e48ff';
        if (objFrom.owner != this._walletNumber) {
            // this.logDebug(`laser is red`);
            laserColor = '#ff0000';
        }
        else {
            // this.logDebug(`laser is blue`);
        }

        switch (aData.attackType) {

            case 'laser':
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
                this.logWarn(`onAttackPack: unknown attack type:`, aData);
                break;
        }

        // if (!aData.isMiss) {
        //     objTo.hp -= aData.damage;
        // }
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
            aCamPos: { x: 0, y: 160, z: 25 * zFactor },
            aTargetPos: { x: 0, y: 0, z: 20 * zFactor },
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
                    attackType: 'laser',
                    idFrom: ship1.objId,
                    idTo: ship2.objId,
                    damage: 10
                });
            },
            randomLaserBlue: () => {
                let ship1 = this.getRandomShip();
                let ship2 = this.getRandomShip();
                if (!ship1 || !ship2 || ship1.objId == ship2.objId) return;
                this.attack({
                    attackType: 'laser',
                    idFrom: ship1.objId,
                    idTo: ship2.objId,
                    damage: 10
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
