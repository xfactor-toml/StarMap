import * as THREE from 'three';
import gsap from 'gsap';
import { GUI } from 'dat.gui';
import { MyEventDispatcher } from "../basics/MyEventDispatcher";
import { IUpdatable } from "../core/interfaces/IUpdatable";
import { BattleObject } from '../objects/battle/BattleObject';
import { BattleStar } from '../objects/battle/BattleStar';
import { BattlePlanet } from '../objects/battle/BattlePlanet';
import { Fighter } from '../objects/battle/Fighter';
import { LaserLine } from '../objects/battle/LaserLine';
import { MyMath } from '../utils/MyMath';
import { BattleCameraMng } from './BattleCameraMng';
import { ObjectHpViewer } from './ObjectHpViewer';
import { Linkor } from '../objects/battle/Linkor';
import { FieldInitData, PlanetLaserData, ObjectCreateData, ObjectType, ObjectUpdateData, PackTitle, AttackData, DamageData, PlanetLaserSkin, ExplosionData, SniperData, ObjectRace } from './Types';
import { BattleConnection } from './BattleConnection';
import { FieldCell } from '../objects/battle/FieldCell';
import { LogMng } from '../utils/LogMng';
import { ThreeUtils } from '../utils/threejs/ThreejsUtils';
import { DamageViewer } from './DamageViewer';
import { Tower } from '../objects/battle/Tower';
import { HomingMissile } from '../objects/battle/HomingMissile';
import { Explosion } from '../objects/Explosion';
import { InputMng } from '../utils/inputs/InputMng';
import { ClickableMesh } from '../objects/basic/ClickableMesh';
import { GameEventDispatcher } from '../events/GameEvents';
import { DeviceInfo } from '../utils/DeviceInfo';
import { Renderer } from '../core/renderers/Renderer';
import { AudioMng } from '../audio/AudioMng';
import { AudioAlias } from '../audio/AudioData';

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
    },

    // stars params
    stars: {
        light: {
            height: 6,
            intens: 1,
            dist: 50,
            decay: .2
        }
    },

    // tower params
    towers: {
        light: {
            height: 0,
            intens: 1,
            dist: 22,
            decay: .2,
            ownerColor: 0x0000ff,
            enemyColor: 0xff0000,
        }
    }

}

const DEBUG_GUI = {
    showAxies: false,
    showObjectRadius: false,
    showObjectAttackRadius: false,
    lightHelpers: false,
    showMyDamage: false
}

export class BattleView extends MyEventDispatcher implements IUpdatable {
    private _walletAddr: string;
    private _render: Renderer;
    private _scene: THREE.Scene;
    private _camera: THREE.Camera;
    private _raycaster: THREE.Raycaster;
    private _connection: BattleConnection;
    private _cameraTarget: THREE.Vector3;
    private _cameraMng: BattleCameraMng;

    private _playerRace: ObjectRace;
    private _enemyRace: ObjectRace;

    private _dummyMain: THREE.Group;
    private _objects: Map<number, BattleObject>;

    private _objectHpViewer: ObjectHpViewer;
    private _damageViewer: DamageViewer;
    private _attackRays: { [index: string]: LaserLine } = {};
    private _explosionSystem: Explosion;

    private _isTopPosition = false;
    private _axiesHelper: THREE.AxesHelper;

    constructor(aParams: {
        render: Renderer,
        scene: THREE.Scene,
        camera: THREE.Camera,
        connection: BattleConnection
    }) {
        super('BattleView');

        this._render = aParams.render;
        this._scene = aParams.scene;
        this._camera = aParams.camera;
        this._connection = aParams.connection;

        this._cameraTarget = new THREE.Vector3();
        this._cameraMng = new BattleCameraMng({
            camera: this._camera,
            cameraTarget: this._cameraTarget
        });

        this._dummyMain = new THREE.Group();
        this._scene.add(this._dummyMain);

        this._objects = new Map();
        this._objectHpViewer = new ObjectHpViewer(this._dummyMain);
        this._damageViewer = new DamageViewer(this._dummyMain, this._camera);

        this._explosionSystem = new Explosion({
            parent: this._dummyMain,
            camera: this._camera
        });

        this.initConnectionListeners();
        this.initRaycaster();
        this.initInput();
        
    }

    private initRaycaster() {
        this._raycaster = new THREE.Raycaster();
    }

    private initConnectionListeners() {
        this._connection.socket.on(PackTitle.fieldInit, (aData: FieldInitData) => {
            this.logDebug(`PackTitle.fieldInit recv...`);
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
        this._connection.socket.on(PackTitle.rotate, (aData) => {
            this.onRotateObject(aData);
        });
        this._connection.socket.on(PackTitle.jump, (aData) => {
            this.onJumpObject(aData);
        });
        this._connection.socket.on(PackTitle.attack, (aData: AttackData) => {
            this.attack(aData);
        });
        this._connection.socket.on(PackTitle.rayStart, (aData) => {
            this.rayStart(aData);
        });
        this._connection.socket.on(PackTitle.rayStop, (aData) => {
            this.rayStop(aData);
        });
        this._connection.socket.on(PackTitle.damage, (aData: DamageData) => {
            this.onDamage(aData);
        });
        // skills
        this._connection.socket.on(PackTitle.planetLaser, (aData: PlanetLaserData) => {
            this.planetLaser(aData);
        });

        this._connection.socket.on(PackTitle.explosion, (aData: ExplosionData) => {
            this.onExplosionPack(aData);
        });
        this._connection.socket.on(PackTitle.sniper, (aData: SniperData) => {
            this.onSniperPack(aData);
        });
    }

    private initInput() {
        let inputMng = InputMng.getInstance();
        inputMng.onClickSignal.add(this.onClick, this);
    }

    private onClick(aClientX: number, aClientY: number) {

        let inMng = InputMng.getInstance();
        let pos = {
            x: aClientX,
            y: aClientY
        }

        let star = this.getStarUnderPoint(inMng.normalDown);
        if (star) {

        }

    }

    private getStarUnderPoint(normalCoords: any): BattleStar {

        let res: BattleStar;

        // get all stars
        let stars = this.getObjectsByType('Star');

        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            // star.mesh
        }

        this._raycaster.setFromCamera(normalCoords, this._camera);
        const intersects = this._raycaster.intersectObjects(this._scene.children, true);

        for (let i = 0; i < intersects.length; i++) {
            const obj = intersects[i].object;
            if (obj instanceof ClickableMesh) {
                obj.generateClickEvent();
            }
        }

        return res;

    }

    private initField() {
        const fSize = SETTINGS.server.field.size;

        for (let cy = 0; cy < fSize.rows; cy++) {
            for (let cx = 0; cx < fSize.cols; cx++) {
                let fieldCell = new FieldCell(4);
                fieldCell.position.copy(this.getPosByCellPos({ x: cx, y: cy }));
                this._dummyMain.add(fieldCell);
            }
        }

    }

    private initCameraPosition(aIsTop: boolean) {
        const H = 180;
        let zFactor = aIsTop ? -1 : 1;
        this._cameraMng.moveTo({
            aCamPos: { x: 0, y: H, z: 25 * zFactor },
            aTargetPos: { x: 0, y: 0, z: 20 * zFactor },
            duration: .5
        });
        // this._camera.position.set(0, H, 25 * zFactor);
        // this._camera.lookAt(0, 0, 20 * zFactor);
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

    private getPositionByServerV3(aV3: { x: number, y: number, z: number }): THREE.Vector3 {
        return new THREE.Vector3(
            this.serverToClientX(aV3.x),
            0,
            this.serverToClientY(aV3.z)
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

    private getObjectsByType(aType: ObjectType): BattleObject[] {
        let res: BattleObject[] = [];
        this._objects.forEach(obj => {
            if (obj.objType == aType) {
                res.push(obj);
            }
        });
        return res;
    }

    private isCurrentOwner(aWalletAddr: string): boolean {
        return this._walletAddr == aWalletAddr;
    }

    private getRaceForWalletAddr(aWalletAddr: string): ObjectRace {
        return this.isCurrentOwner(aWalletAddr) ? this._playerRace : this._enemyRace;
    }

    private getPlanetLaserColor(aSkin: PlanetLaserSkin): string {
        let color = '#0072ff';
        switch (aSkin) {
            case 'blue':
                color = '#0072ff';
                break;
            case 'red':
                color = '#ff0000';
                break;
            case 'white':
                color = '#ffffff';
                break; 
            case 'violet':
                color = '#ba00ff';
                break;
        }
        return color;
    }

    private getShipLaserColor(aOwner: string): string {
        return this.isCurrentOwner(aOwner) ? '#0072ff' : '#ff0000';
    }

    private getRandomShip(exclude?: BattleObject[]): BattleObject {
        let ships: BattleObject[] = [];
        this._objects.forEach((aObj) => {
            if (aObj instanceof Fighter) ships.push(aObj);
        })
        if (ships.length <= 0) return null;
        let id = MyMath.randomIntInRange(0, ships.length - 1);
        return ships[id];
    }
    
    private onFieldInitPack(aData: FieldInitData) {

        // update wallet number
        // this._walletAddr = BlockchainConnectService.getInstance().getWalletAddress();
        this._walletAddr = aData.playerWalletAddr;
        this.logDebug(`onFieldInitPack: _walletAddr = ${this._walletAddr}`);

        SETTINGS.server.field = aData.fieldParams;
        let fieldSize = SETTINGS.server.field.size;
        fieldSize.w = fieldSize.cols * fieldSize.sectorWidth;
        fieldSize.h = fieldSize.rows * fieldSize.sectorHeight;
        this.initField();

        this._playerRace = aData.playerRace;
        this._enemyRace = aData.enemyRace;

        // setTimeout(() => {
            this._isTopPosition = aData.playerPosition == 'top';
            this._objectHpViewer.isTopViewPosition = this._isTopPosition;
            this.initCameraPosition(this._isTopPosition);
        // }, 1000);

    }

    private onObjectCreatePack(aData: ObjectCreateData) {
        let obj: BattleObject;

        // this.logDebug(`onObjectCreatePack(): ${aData.type}:`, aData);

        switch (aData.type) {

            case 'Star':
                obj = new BattleStar({
                    ...aData,
                    ...{
                        camera: this._camera,
                        planetOrbitRadius: 15,
                        light: {
                            parent: this._dummyMain,
                            ...SETTINGS.stars.light
                        }
                    }
                });
                if (aData.pos) obj.position.copy(this.getPositionByServer({ x: aData.pos.x, y: aData.pos.z }));
                this._objects.set(aData.id, obj);
                (obj as BattleStar).onClick.add(this.onStarClick, this);
                break;

            case 'Planet':
                obj = new BattlePlanet(aData);
                if (aData.pos) obj.position.copy(this.getPositionByServer({ x: aData.pos.x, y: aData.pos.z }));
                if (aData.q) {
                    obj.setQuaternion(aData.q);
                    obj.setTargetQuaternion(aData.q);
                }
                this._objects.set(aData.id, obj);
                break;
            
            case 'Tower':
                obj = new Tower({
                    ...aData,
                    ...{
                        race: this.getRaceForWalletAddr(aData.owner),
                        light: {
                            parent: this._dummyMain,
                            ...SETTINGS.towers.light,
                            color: this.isCurrentOwner(aData.owner) ? SETTINGS.towers.light.ownerColor : SETTINGS.towers.light.enemyColor
                        },
                        showRadius: DEBUG_GUI.showObjectRadius,
                        showAttackRadius: DEBUG_GUI.showObjectAttackRadius
                    }
                });

                if (aData.pos) {
                    const clientPos = this.getPositionByServer({ x: aData.pos.x, y: aData.pos.z });
                    obj.position.copy(clientPos);
                }

                if (aData.q) {
                    obj.setQuaternion(aData.q);
                    obj.setTargetQuaternion(aData.q);
                }

                // add hp bar
                this._objectHpViewer.addBar(obj);
                break;

            case 'FighterShip': {
                obj = new Fighter({
                    ...aData,
                    ...{
                        highlighting: {
                            active: true,
                            isEnemy: !this.isCurrentOwner(aData.owner),
                        },
                        race: this.getRaceForWalletAddr(aData.owner),
                        showRadius: DEBUG_GUI.showObjectRadius,
                        showAttackRadius: DEBUG_GUI.showObjectAttackRadius
                    }
                });

                if (aData.pos) {
                    const clientPos = this.getPositionByServer({ x: aData.pos.x, y: aData.pos.z });
                    obj.position.copy(clientPos);
                }

                if (aData.q) {
                    obj.setQuaternion(aData.q);
                    obj.setTargetQuaternion(aData.q);
                }

                if (aData.lookDir) obj.lookByDir(aData.lookDir);

                // add hp bar
                this._objectHpViewer.addBar(obj);

                AudioMng.getInstance().playSfx({ alias: AudioAlias.battleCreepSpawn, volume: .15 });

            } break;

            case 'BattleShip': {
                obj = new Linkor({
                    ...aData,
                    ...{
                        highlighting: {
                            active: true,
                            isEnemy: !this.isCurrentOwner(aData.owner),
                        },
                        race: this.getRaceForWalletAddr(aData.owner),
                        showRadius: DEBUG_GUI.showObjectRadius,
                        showAttackRadius: DEBUG_GUI.showObjectAttackRadius
                    }
                });

                if (aData.pos) {
                    const clientPos = this.getPositionByServer({ x: aData.pos.x, y: aData.pos.z });
                    obj.position.copy(clientPos);
                }

                if (aData.q) {
                    obj.setQuaternion(aData.q);
                    obj.setTargetQuaternion(aData.q);
                }

                if (aData.lookDir) obj.lookByDir(aData.lookDir);

                // add hp bar
                this._objectHpViewer.addBar(obj);

                AudioMng.getInstance().playSfx({ alias: AudioAlias.battleCreepSpawn, volume: .3 });

            } break;

            case 'HomingMissile': {
                obj = new HomingMissile({
                    ...aData,
                    ...{
                        camera: this._camera,
                        effectsParent: this._dummyMain,
                        race: this.getRaceForWalletAddr(aData.owner),
                        light: {
                            parent: this._dummyMain,
                            ...SETTINGS.towers.light,
                            color: this.isCurrentOwner(aData.owner) ? SETTINGS.towers.light.ownerColor : SETTINGS.towers.light.enemyColor
                        },
                        showRadius: DEBUG_GUI.showObjectRadius,
                        showAttackRadius: DEBUG_GUI.showObjectAttackRadius
                    }
                });

                if (aData.pos) {
                    const clientPos = this.getPositionByServer({ x: aData.pos.x, y: aData.pos.z });
                    obj.position.copy(clientPos);
                }

                if (aData.q) {
                    obj.setQuaternion(aData.q);
                    obj.setTargetQuaternion(aData.q);
                }

                if (aData.lookDir) obj.lookByDir(aData.lookDir);

                // add hp bar
                // this._objectHpViewer.addBar(obj);

                // let snd = AudioMng.getInstance().getSound(AudioAlias.battleRocketFly);
                // if (!snd.isPlaying) {
                //     snd.loop = true;
                //     snd.volume = AudioMng.getInstance().sfxVolume;
                //     snd.play();
                // }
                AudioMng.getInstance().playSfx(AudioAlias.battleRocketFly);

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

    private onStarClick(aStar: BattleStar) {
        if (this.isCurrentOwner(aStar.owner)) {
            let pos2d = ThreeUtils.toScreenPosition(this._render.renderer, aStar, this._camera,
                Math.min(2, DeviceInfo.getInstance().devicePixelRatio));
            GameEventDispatcher.showEmotionSelection(pos2d);
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

            // if (obj instanceof BattlePlanet) {
                // this.logDebug(`planet update:`, data);
            // }

            // if (obj instanceof Linkor) {
                // this.logDebug(`BattleShip update:`, data);
            // }

            // if (obj instanceof HomingMissile) {
                // this.logDebug(`HomingMissile update:`, data);
            // }

            if (data.pos) {
                obj.targetPosition = {
                    x: this.serverToClientX(data.pos.x),
                    z: this.serverToClientY(data.pos.z)
                }
            }

            if (data.q) {
                obj.setTargetQuaternion(data.q);
            }

            if (data.hp != undefined) {
                // let prevHp = obj.hp;
                // let dtHp = prevHp - data.hp;
                obj.hp = data.hp;
                // if (dtHp > 2) {
                //     this._damageViewer.showDamage(obj, -dtHp);
                // }
            }

            if (data.shield != undefined) {
                // let prevShield = obj.shield;
                // let dt = prevShield - data.shield;
                obj.shield = data.shield;
                // if (dt > 1) {
                    // this._damageViewer.showShieldDamage(obj, -dt);
                // }
            }

        }

    }

    private onObjectDestroyPack(aIds: number[]) {
        for (let i = 0; i < aIds.length; i++) {
            this.destroyObject(aIds[i]);
        }
    }

    private onRotateObject(aData: {
        id: number,
        type: 'toPoint' | 'toDir',
        target: { x, y, z },
        duration: number
    }) {
        let obj = this.getObjectById(aData.id);
        if (!obj) {
            this.logWarn(`rotate: !obj`, aData);
            return;
        }
        switch (aData.type) {
            case 'toPoint':
                obj.rotateToPoint(this.getPositionByServerV3(aData.target), aData.duration);
                break;
        }
    }

    private onJumpObject(aData: {
        id: number,
        pos: { x, y, z },
        duration: number
    }) {
        let obj = this.getObjectById(aData.id);
        if (!obj) {
            this.logWarn(`jump: !obj`, aData);
            return;
        }
        // obj.rotateToPoint(this.getPositionByServerV3(aData.target), aData.duration);
        // let pos = this.getPositionByServerV3(aData.pos);
        // obj.position.copy(pos);
        obj.jumpToPoint(this.getPositionByServerV3(aData.pos), aData.duration);

    }

    private attack(aData: AttackData) {
        
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

        let laserColor = this.getShipLaserColor(objFrom.owner);

        switch (aData.attackType) {

            case 'laser':
                // create laser
                const laserLen = 2;
                let r = ThreeUtils.randomVector(objTo.radius / 10);
                const targetPoint = objTo.position.clone().add(r);
                const firePoint = objFrom.getGlobalFirePoint();
                const dir = targetPoint.clone().sub(firePoint).normalize();
                if (aData.isMiss) {
                    targetPoint.add(dir.multiplyScalar(objTo.radius * 4));
                }
                let laser = new LaserLine({
                    posStart: new THREE.Vector3(0, 0, 0),
                    posEnd: new THREE.Vector3(0, 0, laserLen),
                    color: laserColor,
                    minRadius: .02,
                    maxRadius: .2
                });
                laser.position.copy(firePoint);
                laser.lookAt(targetPoint);

                // show laser
                const dur = .25;
                gsap.to(laser.position, {
                    x: targetPoint.x,
                    y: targetPoint.y,
                    z: targetPoint.z,
                    duration: dur,
                    ease: 'none',
                    onStart: () => {
                        const sounds = [AudioAlias.battleFireCreep_1, AudioAlias.battleFireCreep_2];
                        let sndAlias = sounds[MyMath.randomIntInRange(0, sounds.length - 1)];
                        AudioMng.getInstance().playSfx(sndAlias);
                    },
                    onComplete: () => {
                        laser.free();
                    }
                });
                this._dummyMain.add(laser);
                break;

            case 'ray': {
                
            } break;

            default:
                this.logWarn(`onAttackPack: unknown attack type:`, aData);
                break;
        }

    }

    private rayStart(aData: {
        idFrom: number,
        idTo: number
    }) {

        let objFrom = this.getObjectById(aData.idFrom);
        if (!objFrom) {
            this.logWarn(`rayStart: !fromObj`, aData);
            return;
        }

        let objTo = this.getObjectById(aData.idTo);
        if (!objTo) {
            this.logWarn(`rayStart: !toObj`, aData);
            return;
        }

        let laserColor = this.getShipLaserColor(objFrom.owner);

        // create ray

        const startPoint = objFrom.position.clone();
        startPoint.y -= objFrom.radius / 6;
        let laser = new LaserLine({
            posStart: startPoint,
            posEnd: objTo.position.clone(),
            color: laserColor,
            minRadius: 0.1,
            maxRadius: 0.3
        });
        this._dummyMain.add(laser);

        this._attackRays[aData.idFrom] = laser;

    }

    private rayStop(aData: {
        idFrom: number
    }) {
        // create ray
        let laser = this._attackRays[aData.idFrom];
        laser?.hide({
            dur: 1,
            cb: () => {
                this._dummyMain.add(laser);
            },
            ctx: this
        });
    }

    private onDamage(aData: DamageData) {
        let obj = this.getObjectById(aData.id);
        if (this.isCurrentOwner(obj?.owner) && !DEBUG_GUI.showMyDamage) {
            return;
        }
        let pos = this.getPositionByServerV3(aData.pos);
        this._damageViewer.showDamage(pos, aData.info);
    }

    private planetLaser(aData: PlanetLaserData) {
        let planet = this.getObjectById(aData.planetId);
        if (!planet) {
            LogMng.warn(`planetLaser: !planet for...`, aData);
            return;
        }

        let laserColor = this.getPlanetLaserColor(aData.skin);
        let originPos = this.getPositionByServerV3(aData.pos);
        let dir = new THREE.Vector3(aData.dir.x, aData.dir.y, aData.dir.z);
        dir.multiplyScalar(aData.length);
        let targetPos = originPos.clone().add(dir);
        // create laser
        let laser = new LaserLine({
            posStart: originPos,
            posEnd: targetPos,
            color: laserColor,
            minRadius: .02,
            maxRadius: .5
        });
        this._dummyMain.add(laser);

        AudioMng.getInstance().playSfx(AudioAlias.battlePlanetLaserFire);

        laser.hide({
            dur: 1,
            cb: () => {
                laser.free();
            },
            ctx: this
        });
    }

    private onExplosionPack(aData: ExplosionData) {
        let pos = this.getPositionByServerV3(aData.pos);
        this._explosionSystem.exposion(pos);

        const snd = [AudioAlias.battleExplosionSmall_1, AudioAlias.battleExplosionSmall_2, AudioAlias.battleExplosionBig];
        let sndAlias = snd[MyMath.randomIntInRange(0, snd.length - 1)];
        AudioMng.getInstance().playSfx(sndAlias);

    }

    private onSniperPack(aSniperData: SniperData) {
        let planet = this._objects.get(aSniperData.planetId) as BattlePlanet;
        if (!planet) {
            this.logWarn(`onSniperPack: unknown planet id: ${aSniperData.planetId}`, aSniperData);
            return;
        }
        switch (aSniperData.action) {
            case 'start':
                planet.showSniperAim();
                break;
            case 'end':
                planet.hideSniperAim();
                break;
            default:
                this.logWarn(`onSniperPack: unknown aSniperData.action: ${aSniperData.action}`, aSniperData);
                break;
        }
    }

    private destroyObject(aId: number) {

        this._objectHpViewer.removeBar(aId);
        let obj = this.getObjectById(aId);
        if (!obj) {
            this.logError(`updateObject(): !obj`, aId);
            return;
        }

        obj.free();
        this._objects.delete(aId);

        let rayEfect = this._attackRays[aId];
        if (rayEfect) {
            rayEfect.hide({
                dur: .1,
                cb: () => {
                    this._attackRays[aId] = null;
                    rayEfect.free();
                },
                ctx: this
            });
        }

    }

    public get walletNumber(): string {
        return this._walletAddr;
    }

    public set walletNumber(value: string) {
        this._walletAddr = value;
    }

    initDebugGui(aFolder: GUI) {
        
        const f = aFolder;

        f.add(DEBUG_GUI, 'showAxies').onChange((aShow: boolean) => {
            if (aShow) {
                if (this._axiesHelper) return;
                this._axiesHelper = new THREE.AxesHelper(150);
                this._dummyMain.add(this._axiesHelper);
            }
            else {
                if (!this._axiesHelper) return;
                this._dummyMain.remove(this._axiesHelper);
                this._axiesHelper = null;
            }
        }).name(`Axies`);

        f.add(DEBUG_GUI, 'showMyDamage').name(`Damage To Me`);

        f.add(DEBUG_GUI, 'showObjectRadius').onChange((aShow: boolean) => {
            this._objects.forEach(obj => {
                if (aShow) {
                    obj.createDebugRadiusSphere();
                }
                else {
                    obj.destroyDebugRadiusSphere();
                }
            });
        }).name(`Object Radius`);

        f.add(DEBUG_GUI, 'showObjectAttackRadius').onChange((val: boolean) => {
            this._objects.forEach(obj => {
                if (val) {
                    obj.createDebugAttackSphere();
                }
                else {
                    obj.destroyDebugAttackSphere();
                }
            });
        }).name(`Attack Radius`);

        f.add(DEBUG_GUI, 'lightHelpers').name('Light Helpers').onChange((aVal: boolean) => {
            // stars
            let stars: BattleStar[] = this.getObjectsByType('Star') as BattleStar[];
            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                star.lightHelperVisible = DEBUG_GUI.lightHelpers;
            }
            // towers
            let towers: Tower[] = this.getObjectsByType('Tower') as Tower[];
            for (let i = 0; i < towers.length; i++) {
                const tower = towers[i];
                tower.lightHelperVisible = aVal;
            }
        })

        // star lights
        let starsFolder = f.addFolder('Stars');
        starsFolder.add(SETTINGS.stars.light, 'height', 0, 50, .1).name('Height').onChange((aVal: number) => {
            let stars: BattleStar[] = this.getObjectsByType('Star') as BattleStar[];
            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                star.lightHeight = aVal;
            }
        })
        starsFolder.add(SETTINGS.stars.light, 'intens', .1, 5, .1).name('Intensity').onChange((aVal: number) => {
            let stars: BattleStar[] = this.getObjectsByType('Star') as BattleStar[];
            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                star.lightIntens = aVal;
            }
        })
        starsFolder.add(SETTINGS.stars.light, 'dist', 0, 100, .1).name('Distance').onChange((aVal: number) => {
            let stars: BattleStar[] = this.getObjectsByType('Star') as BattleStar[];
            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                star.lightDist = aVal;
            }
        })
        starsFolder.add(SETTINGS.stars.light, 'decay', 0, 3, .01).name('Decay').onChange((aVal: number) => {
            let stars: BattleStar[] = this.getObjectsByType('Star') as BattleStar[];
            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                star.lightDecay = aVal;
            }
        })

        // tower lights
        let towerFolder = f.addFolder('Towers');
        towerFolder.add(SETTINGS.towers.light, 'height', 0, 50, .1).name('Height').onChange((aVal: number) => {
            let towers: Tower[] = this.getObjectsByType('Tower') as Tower[];
            for (let i = 0; i < towers.length; i++) {
                const tower = towers[i];
                tower.lightHeight = aVal;
            }
        })
        towerFolder.add(SETTINGS.towers.light, 'intens', .1, 5, .1).name('Intensity').onChange((aVal: number) => {
            let towers: Tower[] = this.getObjectsByType('Tower') as Tower[];
            for (let i = 0; i < towers.length; i++) {
                const star = towers[i];
                star.lightIntens = aVal;
            }
        })
        towerFolder.add(SETTINGS.towers.light, 'dist', 0, 50, .1).name('Distance').onChange((aVal: number) => {
            let towers: Tower[] = this.getObjectsByType('Tower') as Tower[];
            for (let i = 0; i < towers.length; i++) {
                const star = towers[i];
                star.lightDist = aVal;
            }
        })
        towerFolder.add(SETTINGS.towers.light, 'decay', 0, 3, .01).name('Decay').onChange((aVal: number) => {
            let towers: Tower[] = this.getObjectsByType('Tower') as Tower[];
            for (let i = 0; i < towers.length; i++) {
                const star = towers[i];
                star.lightDecay = aVal;
            }
        })

    }

    getPlayerSun(aOwner: string): BattleStar {
        let sun: BattleStar;
        this._objects.forEach(obj => {
            if (sun) return;
            if (obj instanceof BattleStar) {
                if (obj.owner == aOwner) {
                    sun = obj;
                }
            }
        });
        return sun;
    }

    getCurrentPlayerSun(): BattleStar {
        return this.getPlayerSun(this._walletAddr);
    }

    destroyAllObjects() {
        this._objects.forEach(obj => {
            obj.free();
        });
        this._objects.clear();

        for (const key in this._attackRays) {
            const rayEfect = this._attackRays[key];
            if (rayEfect) rayEfect.free();
        }
        this._attackRays = {};

    }

    show() {
        this._dummyMain.visible = true;
    }

    hide() {
        this._dummyMain.visible = false;
    }

    clear() {
        this._objectHpViewer.clear();
        // clear all objects
        this.destroyAllObjects();
    }

    update(dt: number) {

        this._cameraMng.update(dt);

        this._objects.forEach((obj) => {
            obj.update(dt);
        });

        this._objectHpViewer.update(dt);

        this._explosionSystem?.update(dt);

    }

}
