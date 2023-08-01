import * as THREE from 'three';
import { ThreeLoader } from '../loaders/ThreeLoader';
import * as datGui from "dat.gui";
import { MyMath, Vec2 } from '../utils/MyMath';
import gsap from 'gsap';
import { Settings } from '../data/Settings';
import { FarStars } from '../objects/FarStars';
import { DeviceInfo } from '../utils/DeviceInfo';
import { InputMng } from '../utils/inputs/InputMng';
import { FSM } from '../states/FSM';
import { States } from '../states/States';
import { FrontEvents } from '../events/FrontEvents';
import { GameEvents } from '../events/GameEvents';
import { SmallFlySystem } from '../objects/smallFly/SmallFlySystem';
import { MyOrbitControls } from '../mythree/MyOrbitControls';
import { AudioMng } from '../audio/AudioMng';
import { AudioAlias } from '../audio/AudioData';
import { GameUtils } from '../math/GameUtils';
import { QTCircle, QTDebugRender, QTPoint, QTRect, QuadTree } from '../systems/QuadTree';
import { StarPointsMng } from '../mng/StarPointsMng';
import { DB, FAR_STAR_COLORS, RACES } from '../data/DB';
import { LogMng } from '../utils/LogMng';
import { FileMng } from '../mng/FileMng';
import { FarGalaxyParams, GalaxyStarParams, ServerStarData } from '~/game/data/Types';
import { StarGenerator } from '~/game/mng/StarGenerator';
import { StarMath } from '~/game/math/StarMath';
import { ILogger } from '~/game/interfaces/ILogger';
import { Star } from '@/models';
import { GalaxyStars } from '~/game/objects/GalaxyStars';
import { StarPoint, StarPointParams } from '~/game/objects/StarPoint';
import { SolarSystem } from '~/game/objects/SolarSystem';

let debugObjects = {
    farStarsSphereMin: null,
    farStarsSphereMax: null,
}

export class Galaxy implements ILogger {

    private _fsm: FSM;

    private _scene: THREE.Scene;
    private _camera: THREE.PerspectiveCamera;

    private _cameraTarget: THREE.Vector3;
    private _orbitCenter: THREE.Vector3;

    private _dummyGalaxy: THREE.Group;

    private _galaxyPlane: THREE.Mesh;
    private _galaxyCenterSprite: THREE.Sprite;
    private _galaxyCenterSprite2: THREE.Sprite;
    private _galaxyCenterPlane: THREE.Mesh;
    private _gridPlane: THREE.GridHelper;

    private _starIdCounter = 0;
    private _phantomStarsData: GalaxyStarParams[];
    private _phantomStarsParticles: GalaxyStars;
    private _phantomStarPicked: GalaxyStarParams;

    private _realStarsData: GalaxyStarParams[];
    private _realStarsParticles: GalaxyStars;

    private _blinkStarsData: GalaxyStarParams[];
    private _blinkStarsParticles: GalaxyStars;

    private _solarSystemBlinkStarsData: GalaxyStarParams[];
    private _solarSystemBlinkStarsParticles: GalaxyStars;

    private _farStars: FarStars;

    private _farGalaxiesData: FarGalaxyParams[];
    private _smallGalaxies: THREE.Mesh[];

    private _orbitControl: MyOrbitControls;

    private axiesHelper: THREE.AxesHelper;

    private _raycaster: THREE.Raycaster;
    private checkMousePointerTimer = 0;

    private starPointSpriteHovered: THREE.Sprite;
    private starPointHovered: StarPoint;
    private starPointParamsHovered: StarPointParams;
    private currentStarId = -1;
    private starPointsMng: StarPointsMng;

    private isStarPreviewState = false;

    private bigStarSprite: THREE.Sprite;
    private solarSystem: SolarSystem;

    private galaxySaveAnimData: any = {};

    private smallFlySystem: SmallFlySystem;

    // rot sound
    private _rotSndStartTimer = 0;
    private _prevCameraAzimutAngle = 0;
    private _prevCamPolarAngle = 0;

    private _quadTreeReal: QuadTree;
    private _quadTreePhantom: QuadTree;
    private _qtDebugRender: QTDebugRender;

    private _info: {
        cameraDistance: number,
        cameraDistanceStr: string,
        camDistGui?: datGui.GUIController
    } = {
            cameraDistance: 0,
            cameraDistanceStr: '0'
        }


    constructor(aParams: any) {
        this._scene = aParams.scene;
        this._camera = aParams.camera;
        this._cameraTarget = new THREE.Vector3();
        this._orbitCenter = new THREE.Vector3();

        // if (!DeviceInfo.getInstance().iOS) {
        //     Settings.galaxyData.starAlphaFactor = 0.6;
        // }
        Settings.galaxyData.starAlphaFactor = 6;

    }

    logDebug(aMsg: string, aData?: any): void {
        LogMng.debug(`Galaxy: ${aMsg}`, aData);
    }
    logWarn(aMsg: string, aData?: any): void {
        LogMng.warn(`Galaxy: ${aMsg}`, aData);
    }
    logError(aMsg: string, aData?: any): void {
        LogMng.error(`Galaxy: ${aMsg}`, aData);
    }

    public set centerVisible(v: boolean) {
        this._galaxyCenterSprite.visible = v;
        this._galaxyCenterSprite2.visible = v;
    }

    init() {

        AudioMng.getInstance().playSfx(AudioAlias.SFX_INIT_FLY);

        this._dummyGalaxy = new THREE.Group();
        this._scene.add(this._dummyGalaxy);

        this.createSkybox();

        this.createSmallGalaxies(true);

        // main galaxy sprite
        this._galaxyPlane = this.createGalaxyPlane();
        this._dummyGalaxy.add(this._galaxyPlane);

        // galaxy center sprite
        this._galaxyCenterSprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: ThreeLoader.getInstance().getTexture('sun_01'),
                color: Settings.GALAXY_CENTER_COLOR,
                transparent: true,
                alphaTest: 0.01,
                opacity: 0,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            })
        );
        this._galaxyCenterSprite.scale.set(Settings.GALAXY_CENTER_SCALE, Settings.GALAXY_CENTER_SCALE, Settings.GALAXY_CENTER_SCALE);
        // this.galaxyCenterSprite.renderOrder = 999;
        // this._dummyGalaxy.add(this._galaxyCenterSprite);

        this._galaxyCenterSprite2 = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: ThreeLoader.getInstance().getTexture('sun_romb'),
                color: Settings.GALAXY_CENTER_COLOR,
                transparent: true,
                // alphaTest: 0.01,
                opacity: 0,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            })
        );
        this._galaxyCenterSprite2.scale.set(Settings.GALAXY_CENTER_SCALE_2, Settings.GALAXY_CENTER_SCALE_2, Settings.GALAXY_CENTER_SCALE_2);
        // this.galaxyCenterSprite2.renderOrder = 999;
        // this._dummyGalaxy.add(this._galaxyCenterSprite2);

        let planeGeom = new THREE.PlaneGeometry(1, 1);
        let planeMat = new THREE.MeshBasicMaterial({
            map: ThreeLoader.getInstance().getTexture('sun_romb'),
            color: Settings.GALAXY_CENTER_COLOR,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        this._galaxyCenterPlane = new THREE.Mesh(planeGeom, planeMat);
        this._galaxyCenterPlane.visible = false;
        this._dummyGalaxy.add(this._galaxyCenterPlane);

        // GRID
        if (Settings.isGridPlane) {
            this._gridPlane = new THREE.GridHelper(1000, 80, 0xaaaaaa, 0xffffff);
            (this._gridPlane.material as any).transparent = true;
            (this._gridPlane.material as any).opacity = .3;
            this._scene.add(this._gridPlane);
        }

        this.createGalaxyStars(Settings.loadFromFile);
        // this.createGalaxyStars();

        this.initQuadTree();

        // OUT STARS
        this.createFarStars();

        // BIG STARS (SOLAR SYSTEMS)
        this.createStarPoints();

        // fly system
        let starsPos: THREE.Vector3[] = [];
        for (let i = 0; i < DB.realStars.length; i += 2) {
            let pos = DB.realStars[i].params.coords;
            if (pos.X && pos.Y && pos.Z) {
                starsPos.push(new THREE.Vector3(pos.X, pos.Y, pos.Z));
            }
        }
        this.smallFlySystem = new SmallFlySystem(this._dummyGalaxy, starsPos);

        // camera controls
        this.createCameraControls({
            enabled: false,
            minDist: Settings.galaxyData.camDistMin,
            maxDist: 500,
            stopAngleTop: 10,
            stopAngleBot: 170,
            // enablePan: true,
            panRadius: 160
        });

        this._raycaster = new THREE.Raycaster();

        // start music
        AudioMng.getInstance().playMusic(AudioAlias.MUSIC_MAIN);

        // helpers
        if (Settings.isDebugMode) {
            this.axiesHelper = new THREE.AxesHelper(150);
            this._scene.add(this.axiesHelper);
        }

        // inputs
        let inputMng = InputMng.getInstance();
        // inputMng.onInputDownSignal.add(this.onInputDown, this);
        // inputMng.onInputUpSignal.add(this.onInputUp, this);
        inputMng.onClickSignal.add(this.onClick, this);

        this._fsm = new FSM();
        this._fsm.addState(States.init, this, this.onStateInitEnter, this.onStateInitUpdate);
        this._fsm.addState(States.realStars, this, this.onStateRealEnter, this.onStateRealUpdate);
        this._fsm.addState(States.phantomStars, this, this.onStatePhantomEnter, this.onStatePhantomUpdate);
        this._fsm.addState(States.toStar, this, this.onStateToStarEnter, this.onStateToStarUpdate);
        this._fsm.addState(States.star, this, this.onStateStarEnter, this.onStateStarUpdate);
        this._fsm.addState(States.fromStar, this, this.onStateFromStarEnter, this.onStateFromStarUpdate);
        this._fsm.addState(States.createStar, this, this.onStateCreateStarEnter, this.onStateCreateStarUpdate);
        this._fsm.startState(States.init);

        // front events
        this.initFrontEvents();

    }

    private initFrontEvents() {

        FrontEvents.setMusicVolume.add((aData: { v: number }) => {
            let am = AudioMng.getInstance();
            am.musicVolume = aData.v;
            localStorage.setItem(`musicVolume`, String(am.musicVolume));
        }, this);

        FrontEvents.setSFXVolume.add((aData: { v: number }) => {
            let am = AudioMng.getInstance();
            am.sfxVolume = aData.v;
            localStorage.setItem(`sfxVolume`, String(am.sfxVolume));
        }, this);

        FrontEvents.diveIn.add((aData: { starId: number }) => {
            this._fsm.startState(States.toStar, {
                starId: aData.starId,
                starParams: this.starPointParamsHovered.starParams
            });
        }, this);

        FrontEvents.flyFromStar.add(() => {
            this.isStarPreviewState = false;
            if (this._fsm.getCurrentState().name == States.star) {
                this._fsm.startState(States.fromStar);
            }
        }, this);

        FrontEvents.starPreviewClose.add(() => {
            this.isStarPreviewState = false;
            switch (this._fsm.getCurrentState().name) {
                case States.realStars:
                case States.phantomStars:
                    // turn on orbit controller
                    this._orbitControl.autoRotate = true;
                    this._orbitControl.enableZoom = true;
                    if (!this._orbitControl.enabled) this._orbitControl.enabled = true;
                    break;
            }
        }, this);

        FrontEvents.starLevelFilterUpdate.add(this.onLevelFilterChanged, this);

    }

    initDebugGui() {

        const DEBUG_PARAMS = {
            'testGetRace': () => {
                LogMng.debug(`test getRandomRace(): ${Star.getRandomRace()}`);
            },
            'testCreateStar': () => {
                this.onStarCreated({
                    id: 50000,
                    owner: '0x6296Ae279Bc23867a05AD10fa974E1C66B88460F',
                    params: {
                        "name": "Test Debug Star",
                        "isLive": true,
                        "creation": 1686761342,
                        "updated": 1686761342,
                        "level": 1,
                        "fuel": 200000000000000000,
                        "levelUpFuel": 0,
                        "fuelSpendings": 45662100456621,
                        "habitableZoneMin": 3,
                        "habitableZoneMax": 5,
                        "planetSlots": 5,
                        "mass": 10000,
                        "race": "Waters",
                        "coords": {
                            "X": 20,
                            "Y": 0,
                            "Z": 20
                        }
                    }
                });
            },
            'testUpStar': () => {
                this.onStarUpdated({
                    id: 50000,
                    owner: '0x6296Ae279Bc23867a05AD10fa974E1C66B88460F',
                    params: {
                        "name": "Test Debug Star",
                        "isLive": true,
                        "creation": 1686761342,
                        "updated": 1686761342,
                        "level": 3,
                        "fuel": 200000000000000000,
                        "levelUpFuel": 0,
                        "fuelSpendings": 45662100456621,
                        "habitableZoneMin": 3,
                        "habitableZoneMax": 5,
                        "planetSlots": 20,
                        "mass": 25000,
                        "race": "Waters",
                        "coords": {
                            "X": 20,
                            "Y": 0,
                            "Z": 20
                        }
                    }
                });
            },
            'center visible': true,
            'recreate': () => {
                this.createGalaxyStars();
            },
            'recreateSmallGalaxies': () => {
                this.createSmallGalaxies();
            },
            'saveGalaxy': () => {
                FileMng.saveGalaxy(Settings.galaxyData, this._phantomStarsData, this._blinkStarsData, this._farGalaxiesData);
            },
            'flyFromStar': () => {
                if (this._fsm.getCurrentState().name == States.star) {
                    this._fsm.startState(States.fromStar);
                }
            },
            showSpheres: false,
            gridVisible: true,
            axiesHelper: false
        };

        const gui = Settings.datGui;

        // gui.add(DEBUG_PARAMS, 'testGetRace');
        gui.add(DEBUG_PARAMS, 'testCreateStar');
        gui.add(DEBUG_PARAMS, 'testUpStar');

        let galaxyFolder = gui.addFolder('Galaxy');

        galaxyFolder.add(Settings.galaxyData, 'starsCount', 0, 50000, 100).name('Stars').onFinishChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'blinkStarsCount', 0, 50000, 100).name('Blink Stars').onFinishChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'blinkDurMin', 0.1, 10, 0.1).name('Blink Dur Min').onFinishChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'blinkDurMax', 1, 20, 0.1).name('Blink Dur Max').onFinishChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'startAngle', 0.1, 2, 0.1).name('Angle Start').onFinishChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'endAngle', 0.2, Math.PI * 2, 0.1).name('Angle End').onFinishChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'scaleMin', 0.5, 4, 0.1).onFinishChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'scaleMax', 0.5, 4, 0.1).onFinishChange(() => { this.createGalaxyStars(); });

        let offsFolder = galaxyFolder.addFolder('Offsets');
        offsFolder.add(Settings.galaxyData, 'startOffsetXY', 0, 12, 0.1).name('XY Start').onFinishChange(() => { this.createGalaxyStars(); });
        offsFolder.add(Settings.galaxyData, 'endOffsetXY', 0, 6, 0.1).name('XY End').onFinishChange(() => { this.createGalaxyStars(); });
        offsFolder.add(Settings.galaxyData, 'startOffsetH', 0, 50, 0.1).name('H Start').onFinishChange(() => { this.createGalaxyStars(); });
        offsFolder.add(Settings.galaxyData, 'endOffsetH', 0, 20, 0.1).name('H End').onFinishChange(() => { this.createGalaxyStars(); });
        let alphaFolder = galaxyFolder.addFolder('Alpha');
        // alphaFolder.add(Settings.galaxyData, 'alphaMin', 0, 1, 0.02).name('Stars Alpha Min').onFinishChange(() => { this.createGalaxyStars(); });
        // alphaFolder.add(Settings.galaxyData, 'alphaMax', 0, 1, 0.02).name('Stars Alpha Max').onFinishChange(() => { this.createGalaxyStars(); });
        // alphaFolder.add(Settings.galaxyData, 'starAlphaFactor', 0.1, 1, 0.01).name('Main Factor').onChange(() => {  });
        alphaFolder.add(Settings.galaxyData.cameraDistAlpha, 'min', 0, 300, 10).name('Cam Dist Min').onChange(() => { });
        alphaFolder.add(Settings.galaxyData.cameraDistAlpha, 'max', 0, 600, 10).name('Cam Dist Max').onChange(() => { });
        alphaFolder.add(Settings.galaxyData.cameraDistAlpha, 'factor', 0, 1, .01).name('CamDist Factor').onChange(() => { });

        // galaxyFolder.add(Settings.galaxyData, 'k', 0, 1, 0.02).onChange(() => { this.createGalaxyStars(); });
        // galaxyFolder.add(Params.galaxyData, 'isNewMethod').onChange(() => { this.createGalaxyStars(); });
        // this._starAlphaFactor = 0.5;

        galaxyFolder.add(Settings.galaxyData, 'camDistMin', 0, 100, 1).name('CamDist Min').onChange((v: number) => {
            this._orbitControl.minDistance = v;
        });
        galaxyFolder.add(Settings.galaxyData, 'camDistMax', 50, 500, 1).name('CamDist Max').onChange((v: number) => {
            this._orbitControl.maxDistance = v;
        });

        galaxyFolder.add(DEBUG_PARAMS, 'center visible', true).onChange((value) => {
            this.centerVisible = value;
        });

        this._info.camDistGui = galaxyFolder.add(this._info, 'cameraDistanceStr');
        galaxyFolder.add(DEBUG_PARAMS, 'recreate');

        let skyFolder = gui.addFolder('Sky');

        skyFolder.add(Settings.skyData, 'starsCount', 0, 2000, 10).onChange(() => { this.createFarStars(); });
        skyFolder.add(Settings.skyData, 'radiusMin', 0, 500, 5).onChange(() => {
            this.createFarStars();
            if (DEBUG_PARAMS.showSpheres === true) this.createDebugFarStarsMinSphere();
        });
        skyFolder.add(Settings.skyData, 'radiusMax', 10, 2000, 10).onChange(() => {
            this.createFarStars();
            if (DEBUG_PARAMS.showSpheres === true) this.createDebugFarStarsMaxSphere();
        });
        skyFolder.add(DEBUG_PARAMS, 'showSpheres').onChange((v: boolean) => {
            if (v) {
                this.createDebugFarStarsMinSphere();
                this.createDebugFarStarsMaxSphere();
            }
            else {
                if (debugObjects.farStarsSphereMin) debugObjects.farStarsSphereMin.visible = false;
                if (debugObjects.farStarsSphereMax) debugObjects.farStarsSphereMax.visible = false;
            }
        });
        skyFolder.add(Settings.skyData, 'scaleMin', 0.1, 10, 0.1).onChange(() => { if (this._farStars) this._farStars.updateUniformValues(); });
        skyFolder.add(Settings.skyData, 'scaleMax', 1, 50, 1).onChange(() => { if (this._farStars) this._farStars.updateUniformValues(); });
        skyFolder.add(Settings.skyData, 'starSize', 0.1, 10, 0.1).onChange(() => { if (this._farStars) this._farStars.updateUniformValues(); });
        skyFolder.add(Settings.skyData, 'starAlpha', 0, 1, 0.1).onChange(() => { if (this._farStars) this._farStars.updateUniformValues(); });
        skyFolder.add(Settings.skyData, 'galaxiesCount', 0, 100, 1).onChange(() => { this.createSmallGalaxies(); });
        skyFolder.add(Settings.skyData, 'galaxiesSizeMin', 100, 5000, 10).onChange(() => { this.createSmallGalaxies(); });
        skyFolder.add(Settings.skyData, 'galaxiesSizeMax', 100, 8000, 10).onChange(() => { this.createSmallGalaxies(); });
        skyFolder.add(DEBUG_PARAMS, 'recreateSmallGalaxies');

        gui.add(DEBUG_PARAMS, 'saveGalaxy').name('Save Galaxy');

        this.axiesHelper.visible = DEBUG_PARAMS.axiesHelper;
        gui.add(DEBUG_PARAMS, 'axiesHelper').onChange((v: boolean) => {
            this.axiesHelper.visible = v;
        });

        gui.add(DEBUG_PARAMS, 'gridVisible').onChange((v: boolean) => {
            if (this._gridPlane) this._gridPlane.visible = v;
        });

    }

    private onLevelFilterChanged(aLevels: number[]) {
        this._realStarsParticles.setLevelFilter(aLevels);
    }

    gotoGalaxy() {
        switch (this._fsm.getCurrentState().name) {
            case States.star:
                this._fsm.startState(States.fromStar);
                break;
        }
    }

    openPhantomMode() {
        switch (this._fsm.getCurrentState().name) {
            case States.realStars:
                this._fsm.startState(States.phantomStars);
                break;
        }
    }

    openRealMode() {
        switch (this._fsm.getCurrentState().name) {
            case States.phantomStars:
                this._fsm.startState(States.realStars);
                break;
        }
    }

    onStarCreated(aStarData: ServerStarData) {
        this._fsm.startState(States.createStar, aStarData);
    }

    onStarUpdated(aServerStarData: ServerStarData) {
        
        // update star data
        let updRealStars = StarGenerator.getInstance().getRealStarDataByServer({
            alphaMin: Settings.galaxyData.alphaMin,
            alphaMax: Settings.galaxyData.alphaMax,
            scaleMin: Settings.galaxyData.scaleMin,
            scaleMax: Settings.galaxyData.scaleMax
        }, [aServerStarData]);

        if (updRealStars.length <= 0) {
            LogMng.warn('onStarUpdated(): updRealStars.length <= 0');
            return;
        }

        const star = updRealStars[0];

        for (let i = 0; i < this._realStarsData.length; i++) {
            const rsd = this._realStarsData[i];
            if (rsd.id == star.id) {
                this._realStarsData[i] = star;
            }
        }

        this.recreateRealStars();

        switch (this._fsm.getCurrentState().name) {
            case States.star:
                // update the star render
                this.solarSystem?.onStarUpdated(star);
                break;
        }

    }

    private createGalaxyPlane(): THREE.Mesh {
        let t = ThreeLoader.getInstance().getTexture('galaxySprite');
        let galaxy = new THREE.Mesh(
            new THREE.PlaneGeometry(350, 350),
            new THREE.MeshBasicMaterial({
                map: t,
                side: THREE.DoubleSide,
                transparent: true,
                depthWrite: false,
                opacity: 1.0,
                blending: THREE.AdditiveBlending
            })
        );
        galaxy.rotation.x = -Math.PI / 2;
        galaxy.rotation.z = -1.2;
        // galaxyPlane.position.y = -1;
        // galaxyPlane.position.z = 9;
        return galaxy;
    }

    private createGalaxyStars(aLoadFromFile = false) {

        this.destroyGalaxyStars();
        StarGenerator.getInstance().resetStarId();

        let loadedStarsData: GalaxyStarParams[];
        let loadedBlinkStarsData: GalaxyStarParams[];

        if (aLoadFromFile) {
            let loader = ThreeLoader.getInstance();
            let loadData = loader.getJSON('galaxyState');
            if (loadData) {
                if (loadData.galaxyData) {
                    for (const key in loadData.galaxyData) {
                        const element = loadData.galaxyData[key];
                        // skip some fields
                        if (key == 'starAlphaFactor') continue;
                        Settings.galaxyData[key] = element;
                    }
                }
                loadedStarsData = loadData.galaxyStarsData;
                loadedBlinkStarsData = loadData.galaxyBlinkStarsData_FAIL;
            }
        }

        // real star particles

        if (DB.realStars[0].id == 0) {
            DB.realStars.splice(0, 1);
        }
        else {
            for (let i = DB.realStars.length - 1; i >= 0; i--) {
                const element = DB.realStars[i];
                if (element.id == 0) DB.realStars.splice(i, 1);
            }
        }

        // get real stars data
        this._realStarsData = StarGenerator.getInstance().getRealStarDataByServer({
            alphaMin: Settings.galaxyData.alphaMin,
            alphaMax: Settings.galaxyData.alphaMax,
            scaleMin: Settings.galaxyData.scaleMin,
            scaleMax: Settings.galaxyData.scaleMax
        }, DB.realStars);

        // real stars particles
        this._realStarsParticles = new GalaxyStars({
            camera: this._camera,
            starsData: this._realStarsData,
            camDistLogic: true,
            onWindowResizeSignal: FrontEvents.onWindowResizeSignal,
            alpha: {
                camDist: {
                    min: 50,
                    max: 400
                },
                value: {
                    min: .2,
                    max: 1
                }
            }
        });

        this._dummyGalaxy.add(this._realStarsParticles);

        
        // phantom stars data

        if (loadedStarsData) {
            this._phantomStarsData = loadedStarsData;
        }
        else {
            this._phantomStarsData = StarGenerator.getInstance().generateGalaxyStarsData({
                starsCount: Settings.galaxyData.starsCount,
                startAngle: Settings.galaxyData.startAngle,
                endAngle: Settings.galaxyData.endAngle,
                startOffsetXY: Settings.galaxyData.startOffsetXY,
                endOffsetXY: Settings.galaxyData.endOffsetXY,
                startOffsetH: Settings.galaxyData.startOffsetH,
                endOffsetH: Settings.galaxyData.endOffsetH,
                k: Settings.galaxyData.k,
                alphaMin: Settings.galaxyData.alphaMin,
                alphaMax: Settings.galaxyData.alphaMax,
                scaleMin: Settings.galaxyData.scaleMin,
                scaleMax: Settings.galaxyData.scaleMax
            }, 145, 145, true);
        }

        // make it phantom and remove real stars
        for (let i = this._phantomStarsData.length - 1; i >= 0; i--) {
            const sd = this._phantomStarsData[i];

            let isDeleted = false;
            for (let j = 0; j < this._realStarsData.length; j++) {
                const rsd = this._realStarsData[j];
                let dist = MyMath.getVec3Length(rsd.pos.x, rsd.pos.y, rsd.pos.z, sd.pos.x, sd.pos.y, sd.pos.z);
                if (dist <= 0.01) {
                    // remove
                    this.logDebug(`remove star for dist: ${dist}`);
                    this._phantomStarsData.splice(i, 1);
                    isDeleted = true;
                    break;
                }
            }
            if (isDeleted) continue;

            StarGenerator.getInstance().starToPhantom(sd);
        }

        // particle stars particles

        this._phantomStarsParticles = new GalaxyStars({
            camera: this._camera,
            starsData: this._phantomStarsData,
            // texture: t,
            camDistLogic: true,
            onWindowResizeSignal: FrontEvents.onWindowResizeSignal,
            alpha: {
                camDist: {
                    min: 50,
                    max: 400
                },
                value: {
                    min: .2,
                    max: 1
                }
            }
        });
        // this.starsParticles.alphaFactor = 0.5;
        this._phantomStarsParticles.visible = false;
        this._dummyGalaxy.add(this._phantomStarsParticles);

        Settings.galaxyData.starsCount = this._phantomStarsData.length;
        
        // blink stars data generate
        if (loadedBlinkStarsData) {
            if (Settings.USE_BLINK_STARS) {
                this._blinkStarsData = loadedBlinkStarsData;
            }
        }
        else {
            if (Settings.USE_BLINK_STARS) {
                this._blinkStarsData = StarGenerator.getInstance().generateGalaxyStarsData({
                    starsCount: Settings.galaxyData.blinkStarsCount,
                    startAngle: Settings.galaxyData.startAngle,
                    endAngle: Settings.galaxyData.endAngle,
                    startOffsetXY: Settings.galaxyData.startOffsetXY,
                    endOffsetXY: Settings.galaxyData.endOffsetXY,
                    startOffsetH: Settings.galaxyData.startOffsetH,
                    endOffsetH: Settings.galaxyData.endOffsetH,
                    k: Settings.galaxyData.k,
                    alphaMin: Settings.galaxyData.alphaMin,
                    alphaMax: Settings.galaxyData.alphaMax,
                    scaleMin: Settings.galaxyData.scaleMin,
                    scaleMax: Settings.galaxyData.scaleMax,
                },
                    145, 145, false,
                    FAR_STAR_COLORS,
                    {
                        durationMin: Settings.galaxyData.blinkDurMin,
                        durationMax: Settings.galaxyData.blinkDurMax
                    }
                );
            }
        }

        if (!Settings.USE_BLINK_STARS) this._blinkStarsData = [];

        Settings.galaxyData.blinkStarsCount = this._blinkStarsData.length;

        // blink particle stars
        this._blinkStarsParticles = new GalaxyStars({
            camera: this._camera,
            starsData: this._blinkStarsData,
            // texture: t,
            camDistLogic: true,
            onWindowResizeSignal: FrontEvents.onWindowResizeSignal
        });
        this._dummyGalaxy.add(this._blinkStarsParticles);

        // create a solar system blink stars data
        this._solarSystemBlinkStarsData = StarGenerator.getInstance().generateSolarSystemStarsData({
            starsCount: 400,
            minRadius: 180,
            maxRadius: 200,
            alphaMin: Settings.galaxyData.alphaMin,
            alphaMax: Settings.galaxyData.alphaMax,
            scaleMin: Settings.galaxyData.scaleMin,
            scaleMax: Settings.galaxyData.scaleMax,
        },
            FAR_STAR_COLORS,
            {
                durationMin: Settings.galaxyData.blinkDurMin,
                durationMax: Settings.galaxyData.blinkDurMax
            }
        );

        // solar system blink particle stars
        this._solarSystemBlinkStarsParticles = new GalaxyStars({
            camera: this._camera,
            starsData: this._solarSystemBlinkStarsData,
            // texture: t,
            camDistLogic: false,
            onWindowResizeSignal: FrontEvents.onWindowResizeSignal
        });
        this._solarSystemBlinkStarsParticles.visible = false;

    }

    private recreateRealStars() {
        this.destroyRealStarParticles();
        // real stars particles
        this._realStarsParticles = new GalaxyStars({
            camera: this._camera,
            starsData: this._realStarsData,
            camDistLogic: true,
            onWindowResizeSignal: FrontEvents.onWindowResizeSignal,
            alpha: {
                camDist: {
                    min: 50,
                    max: 400
                },
                value: {
                    min: .2,
                    max: 1
                }
            }
        });
        this._realStarsParticles.visible = false;
        this._dummyGalaxy.add(this._realStarsParticles);

        this.initQuadTree();
    }

    private recreateGalaxyStars(aLoadFromFile = false) {

        this.recreateRealStars();
        this.destroyPhantomStarParticles();

        Settings.galaxyData.starsCount = this._phantomStarsData.length;

        // phantom particle stars
        this._phantomStarsParticles = new GalaxyStars({
            camera: this._camera,
            starsData: this._phantomStarsData,
            camDistLogic: true,
            onWindowResizeSignal: FrontEvents.onWindowResizeSignal,
            alpha: {
                camDist: {
                    min: 50,
                    max: 400
                },
                value: {
                    min: .2,
                    max: 1
                }
            }
        });
        this._phantomStarsParticles.visible = false;
        this._dummyGalaxy.add(this._phantomStarsParticles);
        
    }

    private initQuadTree() {

        // REAL STARS
        if (this._quadTreeReal) {
            this._quadTreeReal.destroy();
            this._quadTreeReal = null;
        }

        this._quadTreeReal = new QuadTree(new QTRect(0, 0, 400, 400), 30);

        // add stars to quadtree
        for (let i = 0; i < this._realStarsData.length; i++) {
            const sd = this._realStarsData[i];
            if (sd.id == null) sd.id = StarGenerator.getInstance().getStarId();
            this._quadTreeReal.addPoint(new QTPoint(sd.pos.x, sd.pos.z, { starData: sd }));
        }

        // PHANTOM STARS
        if (this._quadTreePhantom) {
            this._quadTreePhantom.destroy();
            this._quadTreePhantom = null;
        }

        this._quadTreePhantom = new QuadTree(new QTRect(0, 0, 400, 400), 30);

        // add stars to quadtree
        for (let i = 0; i < this._phantomStarsData.length; i++) {
            const sd = this._phantomStarsData[i];
            if (sd.id == null) sd.id = StarGenerator.getInstance().getStarId();
            this._quadTreePhantom.addPoint(new QTPoint(sd.pos.x, sd.pos.z, { starData: sd }));
        }
        // LogMng.debug(`qt:`, this.quadTree);

        // if (!this.qtDebugRender) {
        //     this.qtDebugRender = new QTDebugRender();
        //     this.qtDebugRender.position.y = -20;
        //     this.dummyGalaxy.add(this.qtDebugRender);
        // }
        // this.qtDebugRender.quadtree = this.quadTree;
        // this.qtDebugRender.render();
    }

    private destroyPhantomStarParticles() {
        if (this._phantomStarsParticles) {
            try {
                this._dummyGalaxy.remove(this._phantomStarsParticles);
            } catch (error) {
                // TODO
            }
            this._phantomStarsParticles.free();
            this._phantomStarsParticles = null;
        }
    }

    private destroyRealStarParticles() {
        if (this._realStarsParticles) {
            try {
                this._dummyGalaxy.remove(this._realStarsParticles);
            } catch (error) {
                // TODO
            }
            this._realStarsParticles.free();
                this._realStarsParticles = null;
        }
    }

    private destroyGalaxyStars() {

        this.destroyPhantomStarParticles();
        this.destroyRealStarParticles();

        if (this._blinkStarsParticles) {
            this._blinkStarsParticles.free();
            this._blinkStarsParticles = null;
        }

    }

    private createFarStars() {

        if (this._farStars) {
            this._scene.remove(this._farStars);
            this._farStars.free();
            this._farStars = null;
        }

        this._farStars = new FarStars({
            starsCount: Settings.skyData.starsCount,
            // radiusMin: Params.skyData.radiusMin,
            // radiusMax: Params.skyData.radiusMax
        });

        // this.scene.add(this.farStars);
        this._dummyGalaxy.add(this._farStars);

    }

    private createDebugFarStarsMinSphere() {
        if (debugObjects.farStarsSphereMin) {
            this._scene.remove(debugObjects.farStarsSphereMin);
        }
        let geom = new THREE.SphereGeometry(Settings.skyData.radiusMin, 10, 10);
        let mat = new THREE.MeshNormalMaterial({
            wireframe: true
        });
        debugObjects.farStarsSphereMin = new THREE.Mesh(geom, mat);
        this._scene.add(debugObjects.farStarsSphereMin);
    }

    private createDebugFarStarsMaxSphere() {
        if (debugObjects.farStarsSphereMax) {
            this._scene.remove(debugObjects.farStarsSphereMax);
        }
        let geom = new THREE.SphereGeometry(Settings.skyData.radiusMax, 20, 20);
        let mat = new THREE.MeshNormalMaterial({
            wireframe: true
        });
        debugObjects.farStarsSphereMax = new THREE.Mesh(geom, mat);
        this._scene.add(debugObjects.farStarsSphereMax);
    }

    private createStarPoints() {

        this.starPointsMng = new StarPointsMng({
            parent: this._dummyGalaxy,
            camera: this._camera,
            cameraTarget: this._cameraTarget,
            poolSize: 400,
            dist: 20
        });
    }

    private createSkybox() {
        let loader = ThreeLoader.getInstance();
        this._scene.background = loader.getCubeTexture('skybox');
    }

    // BG GALAXIES

    private createSmallGalaxies(aLoadFromFile = false) {

        this.destroySmallGalaxies();

        let loadData: FarGalaxyParams[];
        if (aLoadFromFile) {
            let loader = ThreeLoader.getInstance();
            let fileData = loader.getJSON('galaxyState');
            if (fileData && fileData.farGalaxiesData) {
                loadData = fileData.farGalaxiesData;
            }
        }

        if (loadData) {
            this._farGalaxiesData = loadData;
        }
        else {
            this._farGalaxiesData = this.generateFarGalaxiesData();
        }

        this._smallGalaxies = [];
        for (let i = 0; i < this._farGalaxiesData.length; i++) {
            const galaxy = this.createSmallGalaxy(this._farGalaxiesData[i]);
            this._smallGalaxies.push(galaxy);
            this._scene.add(galaxy);
            // this.dummyGalaxy.add(galaxy);
        }

    }

    private destroySmallGalaxies() {
        if (this._smallGalaxies)
            for (let i = this._smallGalaxies.length - 1; i >= 0; i--) {
                this._scene.remove(this._smallGalaxies[i]);
            }
        this._smallGalaxies = [];
        this._farGalaxiesData = [];
    }

    private generateFarGalaxiesData(): FarGalaxyParams[] {

        const radius = MyMath.randomInRange(Settings.FAR_GALAXIES_RADIUS_MIN, Settings.FAR_GALAXIES_RADIUS_MAX);

        let res = [];
        let positions: THREE.Vector3[] = [];

        let ids = Array.from(Array(Settings.SMALL_GALAXIES_SPRITE_COUNT - 1).keys());
        MyMath.shuffleArray(ids, 4);

        let galaxyCnt = Settings.skyData.galaxiesCount;
        let k = 0;

        for (let i = 0; i < galaxyCnt; i++) {

            if (k >= ids.length) k = 0;
            let tNum = ids[k] + 1;
            k++;
            let tName = `galaxy_${tNum.toString().padStart(2, '0')}`;
            let size = MyMath.randomInRange(Settings.skyData.galaxiesSizeMin, Settings.skyData.galaxiesSizeMax);
            let alpha = MyMath.randomInRange(0.5, 0.6);

            let pos = new THREE.Vector3();
            let posDone = false;
            let limitTries = 1000;

            while (!posDone) {
                posDone = true;
                pos.set(
                    MyMath.randomInRange(-10, 10),
                    MyMath.randomInRange(-10, 10),
                    MyMath.randomInRange(-10, 10)).
                    normalize().
                    multiplyScalar(radius);
                for (let i = 0; i < positions.length; i++) {
                    const g = positions[i];
                    if (g.distanceTo(pos) <= radius) {
                        posDone = false;
                    }
                }
                limitTries--;
                if (limitTries <= 0) posDone = true;
            }

            positions.push(pos);

            let dir = new THREE.Vector3(
                MyMath.randomInRange(-10, 10),
                MyMath.randomInRange(-10, 10),
                MyMath.randomInRange(-10, 10)).
                normalize().
                multiplyScalar(radius / 2);

            let rotationSpeed = MyMath.randomInRange(0.01, 0.03);


            const galaxyData = {
                textureName: tName,
                pos: {
                    x: pos.x,
                    y: pos.y,
                    z: pos.z
                },
                size: size,
                alpha: alpha,
                dir: {
                    x: dir.x,
                    y: dir.y,
                    z: dir.z
                },
                rotationSpeed: rotationSpeed
            };

            res.push(galaxyData);

        }

        return res;
    }

    private createSmallGalaxy(aGalaxyParams: FarGalaxyParams): THREE.Mesh {

        let tName = aGalaxyParams.textureName;
        // let size = MyMath.randomInRange(Params.skyData.galaxiesSizeMin, Params.skyData.galaxiesSizeMax);
        let size = aGalaxyParams.size;

        let loader = ThreeLoader.getInstance();
        let t = loader.getTexture(tName);
        let mat = new THREE.MeshBasicMaterial({
            map: t,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: aGalaxyParams.alpha,
            // depthTest: false,
            depthWrite: false,
            // blending: THREE.AdditiveBlending
        });

        let geom = new THREE.PlaneGeometry(size, size, 1, 1);

        let galaxy = new THREE.Mesh(geom, mat);
        galaxy.renderOrder = -90;

        galaxy.position.set(
            aGalaxyParams.pos.x,
            aGalaxyParams.pos.y,
            aGalaxyParams.pos.z
        );

        let dir = new THREE.Vector3(
            aGalaxyParams.dir.x,
            aGalaxyParams.dir.y,
            aGalaxyParams.dir.z
        );
        galaxy.lookAt(dir);
        galaxy['rotSpeed'] = aGalaxyParams.rotationSpeed;
        return galaxy;
    }

    private createCameraControls(aParams?: {
        enabled?: boolean,
        zoomSpeed?: number,
        enablePan?: boolean,
        panRadius?: number,
        minDist?: number,
        maxDist?: number,
        stopAngleTop?: number,
        stopAngleBot?: number
    }) {

        if (this._orbitControl) return;
        if (!aParams) aParams = {};
        let domElement = Settings.domRenderer;
        this._orbitControl = new MyOrbitControls(this._camera, domElement);
        this._orbitControl.enabled = aParams.enabled;
        this._orbitControl.rotateSpeed = .5;
        this._orbitControl.enableDamping = true;
        this._orbitControl.dampingFactor = Settings.CAM_DAMPING_FACTOR;
        this._orbitControl.zoomSpeed = aParams.zoomSpeed || 1;
        this._orbitControl.enablePan = aParams.enablePan == true;
        this._orbitControl.minDistance = aParams.minDist || 1;
        this._orbitControl.maxDistance = aParams.maxDist || 100;
        this._orbitControl.minPolarAngle = MyMath.toRadian(aParams.stopAngleTop || 0);
        this._orbitControl.maxPolarAngle = MyMath.toRadian(aParams.stopAngleBot || 0);
        // if (aParams.pos) {
        //     this.orbitControl.target.x = aParams.pos.x || 0;
        //     this.orbitControl.target.y = aParams.pos.y || 0;
        //     this.orbitControl.target.z = aParams.pos.z || 0;
        // }
        this._orbitControl.autoRotateSpeed = 0.05;
        this._orbitControl.autoRotate = true;

        this._orbitControl.target = this._orbitCenter;
        this._orbitControl.update();

        this._orbitControl.addEventListener('change', (e: THREE.Event) => {
            const Y_FRAMES = 15;
            if (aParams.enablePan) {
                let moveRadius = aParams.panRadius || 100;
                let tp = this._orbitControl.target.clone();
                tp.y = 0;
                if (tp.length() > moveRadius) {
                    tp.normalize().multiplyScalar(moveRadius);
                }
                this._orbitControl.target.x = tp.x;
                this._orbitControl.target.z = tp.z;
                if (this._orbitControl.target.y < -Y_FRAMES) this._orbitControl.target.y = -Y_FRAMES;
                if (this._orbitControl.target.y > Y_FRAMES) this._orbitControl.target.y = Y_FRAMES;
                this._cameraTarget.copy(this._orbitControl.target);
            }
        });

    }

    private checkStarUnderPoint(normalCoords: any) {

        this._raycaster.setFromCamera(normalCoords, this._camera);
        const intersects = this._raycaster.intersectObjects(this._dummyGalaxy.children, true);
        let isHover = false;

        for (let i = 0; i < intersects.length; i++) {
            const obj = intersects[i].object;
            if (obj[`name`] == 'starPoint') {
                let newSpritePoint = obj as THREE.Sprite;
                if (newSpritePoint != this.starPointSpriteHovered) {
                    this.starPointSpriteHovered = newSpritePoint;
                    this.starPointHovered = newSpritePoint.parent as StarPoint;
                    if (!this.isStarPreviewState) {
                        AudioMng.getInstance().playSfx(AudioAlias.SFX_HOVER);
                    }
                }
                isHover = true;
                break;
            }
        }

        if (!isHover) this.starPointSpriteHovered = null;

    }

    private getNearestStarPosition(aPoint: THREE.Vector3): THREE.Vector3 {
        let res: THREE.Vector3;
        let minDist = Number.MAX_SAFE_INTEGER;
        let quadTree = this._fsm.getCurrentState().name == States.realStars
            ? this._quadTreeReal
            : this._quadTreePhantom;
        let stars = quadTree.getPointsInCircle(new QTCircle(aPoint.x, aPoint.z, 200));
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            let dist = MyMath.getVec2Length(aPoint.x, aPoint.z, star.x, star.y);
            if (minDist > dist) {
                minDist = dist;
                res = new THREE.Vector3(star.x, aPoint.y, star.y);
            }
        }
        return res;
    }

    private getPlanePoint(normalCoords: any): THREE.Vector3 {
        this._raycaster.setFromCamera(normalCoords, this._camera);
        const intersects = this._raycaster.intersectObjects([this._galaxyPlane], true);
        const intersect = intersects[0];
        if (!intersect) return null;
        return intersect.point;
    }

    private updateInputMove() {
        let inMng = InputMng.getInstance();
        this.checkStarUnderPoint(inMng.normalPos);
        document.body.style.cursor = this.starPointSpriteHovered ? 'pointer' : 'default';
    }

    private onClick(aClientX: number, aClientY: number) {
        let inMng = InputMng.getInstance();
        let pos = {
            x: aClientX,
            y: aClientY
        }

        this.checkStarUnderPoint(inMng.normalDown);

        switch (this._fsm.getCurrentState().name) {

            case States.realStars:

                if (this.isStarPreviewState) {
                    GameEvents.dispatchEvent(GameEvents.EVENT_HIDE_STAR_PREVIEW);
                    if (!this._orbitControl.autoRotate) this._orbitControl.autoRotate = true;
                    this._orbitControl.enableZoom = true;
                    if (!this._orbitControl.enabled) this._orbitControl.enabled = true;
                }
                else {

                    if (this.starPointSpriteHovered) {
                        // star point clicked
                        AudioMng.getInstance().playSfx(AudioAlias.SFX_CLICK);

                        this.isStarPreviewState = true;
                        this._orbitControl.autoRotate = false;
                        this._orbitControl.setSphericalDelta(0, 0);
                        if (this._orbitControl.enabled) this._orbitControl.enabled = false;

                        this.starPointParamsHovered = this.starPointHovered.params;
                        let starParams = this.starPointHovered.params.starParams;
                        if (!starParams.starInfo?.serverData) {
                            this.logWarn(`onClick: UNKNOWN starParams.starInfo.serverData!`, starParams);
                            return;
                        }

                        LogMng.debug('onClick(): realStars: starParams:', starParams);
                        // LogMng.debug('onClick(): realStars: GUI params:', StarMath.getEnergyPerHourValues(starParams.starInfo.serverData.params));
                        // LogMng.debug('onClick(): realStars: GUI params:', StarMath.getLifeValues(starParams.starInfo.serverData.params));

                        GameEvents.dispatchEvent(GameEvents.EVENT_SHOW_STAR_PREVIEW, {
                            starData: starParams.starInfo.serverData,
                            pos2d: {
                                x: pos.x,
                                y: pos.y
                            }
                        });

                    }
                    else {
                        // galaxy plane click
                        this.onGalaxyPlaneClick();
                    }

                }
                break;

            case States.phantomStars:
                if (this.isStarPreviewState) {
                    GameEvents.dispatchEvent(GameEvents.EVENT_HIDE_STAR_PREVIEW);
                    if (!this._orbitControl.autoRotate) this._orbitControl.autoRotate = true;
                    this._orbitControl.enableZoom = true;
                    if (!this._orbitControl.enabled) this._orbitControl.enabled = true;
                }
                else {

                    if (this.starPointSpriteHovered) {
                        // star point clicked
                        AudioMng.getInstance().playSfx(AudioAlias.SFX_CLICK);

                        this.isStarPreviewState = true;
                        this._orbitControl.autoRotate = false;
                        this._orbitControl.setSphericalDelta(0, 0);
                        if (this._orbitControl.enabled) this._orbitControl.enabled = false;

                        this.starPointParamsHovered = this.starPointHovered.params;
                        this._phantomStarPicked = this.starPointHovered.params.starParams;

                        LogMng.debug('onClick(): phantomStar params:', this._phantomStarPicked);

                        GameEvents.dispatchEvent(GameEvents.EVENT_PHANTOM_STAR_PREVIEW, {
                            pos3d: this._phantomStarPicked.pos,
                            pos2d: {
                                x: pos.x,
                                y: pos.y
                            }
                        });

                    }
                    else {
                        // galaxy plane click
                        this.onGalaxyPlaneClick();
                    }

                }
                break;

        }

    }

    private onGalaxyPlaneClick() {
        const MOVE_DUR = 2;
        let inMng = InputMng.getInstance();

        if ([States.realStars, States.phantomStars].indexOf(this._fsm.getCurrentState().name as States) < 0) return;

        let plainPoint = this.getPlanePoint(inMng.normalUp);
        let starPos = this.getNearestStarPosition(plainPoint);
        if (starPos) plainPoint.copy(starPos);

        if (plainPoint) {
            let currNewDist = this._camera.position.distanceTo(plainPoint);
            let resultDist = Math.min(Settings.POINTS_CAMERA_MAX_DIST / 2, currNewDist);
            let newCamPos = this._camera.position.clone().sub(plainPoint).normalize().multiplyScalar(resultDist).add(plainPoint);

            // move camera to point
            this._orbitControl.enabled = false;
            gsap.to(this._camera.position, {
                x: newCamPos.x,
                y: newCamPos.y,
                z: newCamPos.z,
                duration: MOVE_DUR,
                ease: 'sine.inOut',
                onComplete: () => {
                    this._orbitControl.enabled = true;
                }
            });

            // move camera target to center of Click Point
            gsap.to(this._cameraTarget, {
                x: plainPoint.x,
                y: plainPoint.y,
                z: plainPoint.z,
                duration: MOVE_DUR,
                ease: 'sine.inOut',
                onUpdate: () => {
                    this._orbitCenter.copy(this._cameraTarget);
                }
            });

        }

    }

    private updateGalaxyCenterSprite() {
        let cameraPolarAngle = this._orbitControl.getPolarAngle();

        if (this._galaxyCenterSprite) {
            // debugger;
            // console.log(`polarAngle: ${polarAngle}`);
            const scMin = 0.1;
            let anFactor = scMin + (1 - scMin) * (1 - (cameraPolarAngle / (Math.PI / 2)));
            if (cameraPolarAngle > Math.PI / 2) {
                anFactor = scMin + (1 - scMin) * (1 - (Math.abs(cameraPolarAngle - Math.PI) / (Math.PI / 2)));
            }
            this._galaxyCenterSprite.scale.y = Settings.GALAXY_CENTER_SCALE * anFactor;

            // LogMng.debug(`galaxyCenterSprite.scale.y: ${this.galaxyCenterSprite.scale.y}`);
        }

        if (this._galaxyCenterSprite2) {
            // debugger;
            // console.log(`polarAngle: ${polarAngle}`);
            const scMin = 0.3;
            let anFactor = scMin + (1 - scMin) * (1 - (cameraPolarAngle / (Math.PI / 2)));
            if (cameraPolarAngle > Math.PI / 2) {
                anFactor = scMin + (1 - scMin) * (1 - (Math.abs(cameraPolarAngle - Math.PI) / (Math.PI / 2)));
            }
            this._galaxyCenterSprite2.scale.y = Settings.GALAXY_CENTER_SCALE_2 * anFactor;

            // LogMng.debug(`galaxyCenterSprite2.scale.y: ${this.galaxyCenterSprite2.scale.y}`);
        }
    }

    private guiGetScaleBigStarTooltipByWidth(): number {
        return GameUtils.getClientWidth() / 800;
    }

    private guiGetScaleBigStarTooltipByHeight(): number {
        return GameUtils.getClientHeight() / 800;
    }

    private guiGetScaleBigStarTooltip(): number {
        return Math.min(this.guiGetScaleBigStarTooltipByWidth(), this.guiGetScaleBigStarTooltipByHeight());
    }

    private getXFOV(aCamera: THREE.PerspectiveCamera) {
        // Convert angle to radiant
        const FOV = aCamera.fov;
        let yFovRadiant = FOV * Math.PI / 180;
        // Calculate X-FOV Radiant
        let xFovRadiant = 2 * Math.atan(Math.tan(yFovRadiant / 2) * (GameUtils.getClientWidth() / GameUtils.getClientHeight()));
        // Convert back to angle
        let xFovAngle = xFovRadiant * 180 / Math.PI;
        return xFovAngle;
    }

    private getYFOV(aCamera: THREE.PerspectiveCamera) {
        return aCamera.fov;
    }
    
    /**
     * Absolute polar angle relative to the main galaxy plain
     * @returns 
     */
    private getAbsPolarAngle(): number {
        const cameraPolarAngle = this._orbitControl.getPolarAngle();
        // angle from main plane
        const an = cameraPolarAngle < Math.PI / 2 ?
            cameraPolarAngle :
            Math.abs(cameraPolarAngle - Math.PI);
        return an;
    }

    // UPDATES

    private updateGalaxyPlane(dt: number) {
        const MIN_ALPHA = 0.0;
        const an = this.getAbsPolarAngle();
        const camDist = this._camera.position.distanceTo(this._cameraTarget);
        const CAM_ANGLE_ALPHA = (1 - (an / (Math.PI / 2))) * (1 - MIN_ALPHA);

        const CAM_D_P = {
            min: 50,
            max: 150
        }
        const cddt = CAM_D_P.max - CAM_D_P.min;
        const CAM_DIST_ALPHA = MyMath.clamp(camDist - CAM_D_P.min, 0, cddt) / cddt;

        let galaxyOpacity = MIN_ALPHA + Math.min(CAM_DIST_ALPHA, CAM_ANGLE_ALPHA);
        this._galaxyPlane.material['opacity'] = galaxyOpacity;
    }

    private updateRealStars(dt: number) {
        const an = this.getAbsPolarAngle();
        const MIN_ALPHA = 0.5;
        let starsOpacity = MIN_ALPHA + (1 - (an / (Math.PI / 2))) * (1 - MIN_ALPHA);

        let camDist = this._camera.position.length();
        this._info.cameraDistance = camDist;
        this._info.cameraDistanceStr = String(camDist.toFixed(0));
        this._info.camDistGui?.updateDisplay();

        this._realStarsParticles.alphaFactor = starsOpacity * Settings.galaxyData.starAlphaFactor;
        this._realStarsParticles.update(dt);
    }

    private updatePhantomStars(dt: number) {
        const an = this.getAbsPolarAngle();
        const MIN_ALPHA = 0.5;
        let starsOpacity = MIN_ALPHA + (1 - (an / (Math.PI / 2))) * (1 - MIN_ALPHA);

        let camDist = this._camera.position.length()
        this._info.cameraDistance = camDist;
        this._info.cameraDistanceStr = String(camDist.toFixed(0));
        this._info.camDistGui?.updateDisplay();

        this._phantomStarsParticles.alphaFactor = starsOpacity * 1.5; // Settings.galaxyData.starAlphaFactor;
        this._phantomStarsParticles.update(dt);
    }

    private updateBlinkStars(dt: number) {
        this._blinkStarsParticles.update(dt);
    }

    private updateFarStars(dt: number) {
        let cameraAzimutAngle = this._orbitControl.getAzimuthalAngle();
        let cameraPolarAngle = this._orbitControl.getPolarAngle();
        this._farStars.azimutAngle = cameraAzimutAngle;
        this._farStars.polarAngle = cameraPolarAngle;
        this._farStars.update(dt);
    }

    private updateSmallGalaxies(dt: number) {
        for (let i = 0; i < this._smallGalaxies.length; i++) {
            const g = this._smallGalaxies[i];
            if (g) g.rotateZ(g['rotSpeed'] * dt);
        }
    }

    private updateRotationSound(dt: number) {
        const minDelta = 0.001;
        let cameraAzimutAngle = this._orbitControl.getAzimuthalAngle();
        let cameraPolarAngle = this._orbitControl.getPolarAngle();
        let azDelta = Math.abs(this._orbitControl.getAzimuthalAngle() - this._prevCameraAzimutAngle);
        let polDelta = Math.abs(this._orbitControl.getPolarAngle() - this._prevCamPolarAngle);

        let isRotate = this._orbitControl.isRotate() && (azDelta > minDelta || polDelta > minDelta);

        if (isRotate) {

            // this.rotSndStartTimer -= dt;
            if (this._rotSndStartTimer < 0) {
                let snd = AudioMng.getInstance().getSound(AudioAlias.SFX_CAM_ROTATE);
                if (!snd.isPlaying) {
                    snd.loop = true;
                    snd.volume = AudioMng.getInstance().sfxVolume;
                    try {
                        snd.play();
                    } catch (error) {
                    }
                }
            }

        }
        else {
            this._rotSndStartTimer = 0.02;
            let snd = AudioMng.getInstance().getSound(AudioAlias.SFX_CAM_ROTATE);
            if (snd.isPlaying) snd.stop();
        }

        this._rotSndStartTimer -= dt;
        this._prevCameraAzimutAngle = cameraAzimutAngle;
        this._prevCamPolarAngle = cameraPolarAngle;
    }

    private updateStarPoints() {

        if (!Settings.STAR_CLICK_POINTS) return;
        const isPhantomMode = this._fsm.getCurrentState().name == States.phantomStars;

        // new dynamic points
        const MaxCheckRadius = Settings.POINTS_CAMERA_MAX_DIST;
        let targetPos = this._cameraTarget.clone();
        let camPos = this._camera.position.clone();
        let dist = camPos.distanceTo(targetPos);
        let checkRadius = (1 - Math.min(1, dist / MaxCheckRadius)) * Settings.POINTS_MAX_CHECK_RADIUS;
        // let checkRadius = 10;
        let points: QTPoint[] = [];
        switch (this._fsm.getCurrentState().name) {
            case States.realStars:
                points = this._quadTreeReal.getPointsInCircle(new QTCircle(targetPos.x, targetPos.z, checkRadius));
                break;
            case States.phantomStars:
                points = this._quadTreePhantom.getPointsInCircle(new QTCircle(targetPos.x, targetPos.z, checkRadius));
                break;
        }

        this.starPointsMng.updatePoints(points, checkRadius, isPhantomMode);

    }

    // STATES
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    private onStateInitEnter() {

        this.isStarPreviewState = false;

        this._orbitControl.enabled = false;
        this._camera.position.set(-90 * 4, 0, 180 * 4);
        this._camera.lookAt(this._cameraTarget);
        gsap.to(this._camera.position, {
            x: -90,
            y: 60,
            z: 180,
            duration: 3,
            // delay: 0.1,
            ease: 'sine.inOut',
            onComplete: () => {
                this._fsm.startState(States.realStars);
                this._orbitControl.maxDistance = Settings.galaxyData.camDistMax;
            }
        });

    }

    private onStateInitUpdate(dt: number) {

        this._orbitControl.update();

        if (this._cameraTarget && this._camera) {
            this._camera.lookAt(this._cameraTarget);
        }

        this.updateGalaxyPlane(dt);
        this.updateGalaxyCenterSprite();
        // this.updateGalaxyStars(dt);
        this.updateRealStars(dt);
        this.updateBlinkStars(dt);
        this.updateFarStars(dt);
        this.updateSmallGalaxies(dt);
        this.updateStarPoints();

    }

    private onStateRealEnter() {
        this._prevCameraAzimutAngle = this._orbitControl.getAzimuthalAngle();
        this._prevCamPolarAngle = this._orbitControl.getPolarAngle();
        this._orbitControl.update();
        this._orbitControl.autoRotate = true;
        this._orbitControl.enableZoom = true;
        this._orbitControl.enabled = true;

        this._phantomStarsParticles.visible = false;
        this._realStarsParticles.visible = true;

        this.smallFlySystem.activeSpawn = true;
    }

    private onStateRealUpdate(dt: number) {

        this._orbitControl.update();

        if (this._cameraTarget && this._camera) {
            this._camera.lookAt(this._cameraTarget);
        }

        this.updateGalaxyPlane(dt);
        this.updateGalaxyCenterSprite();
        // this.updateGalaxyStars(dt);
        this.updateRealStars(dt);
        this.updateBlinkStars(dt);
        this.updateFarStars(dt);
        this.updateSmallGalaxies(dt);
        this.updateRotationSound(dt);
        this.updateStarPoints();

        this.smallFlySystem.update(dt);

        if (DeviceInfo.getInstance().desktop) {
            this.checkMousePointerTimer -= dt;
            if (this.checkMousePointerTimer <= 0) {
                this.checkMousePointerTimer = 0.1;
                this.updateInputMove();
            }
        }

    }

    private onStatePhantomEnter(aParams: any) {
        this._prevCameraAzimutAngle = this._orbitControl.getAzimuthalAngle();
        this._prevCamPolarAngle = this._orbitControl.getPolarAngle();
        this._orbitControl.update();
        this._orbitControl.autoRotate = true;
        this._orbitControl.enableZoom = true;
        this._orbitControl.enabled = true;

        this._realStarsParticles.visible = false;
        this._phantomStarsParticles.visible = true;

        this.smallFlySystem.activeSpawn = false;
    }

    private onStatePhantomUpdate(dt: number) {
        this._orbitControl.update();

        if (this._cameraTarget && this._camera) {
            this._camera.lookAt(this._cameraTarget);
        }

        this.updateGalaxyPlane(dt);
        this.updateGalaxyCenterSprite();
        // this.updateGalaxyStars(dt);
        this.updatePhantomStars(dt);
        this.updateBlinkStars(dt);
        this.updateFarStars(dt);
        this.updateSmallGalaxies(dt);
        this.updateRotationSound(dt);
        this.updateStarPoints();

        this.smallFlySystem.update(dt);

        if (DeviceInfo.getInstance().desktop) {
            this.checkMousePointerTimer -= dt;
            if (this.checkMousePointerTimer <= 0) {
                this.checkMousePointerTimer = 0.1;
                this.updateInputMove();
            }
        }
    }

    private onStateToStarEnter(aParams: {
        starId: number,
        starParams: GalaxyStarParams
    }) {

        const GALAXY_BIG_SCALE = 100;
        const LOOK_DUR = 2;
        const DUR = 3;

        this.logDebug('onStateToStarEnter...');

        this.currentStarId = aParams.starId;

        // get star params by id
        // let gsId = -1;
        // let starParams: GalaxyStarParams;
        // for (let i = 0; i < this.galaxyStarsData.length; i++) {
        //     const gsp = this.galaxyStarsData[i];
        //     if (gsp.id = this.currentStarId) {
        //         gsId = i;
        //         starParams = gsp;
        //         break;
        //     }
        // }

        // let starParams = this.starPointParamsHovered.starParams;
        let starParams = aParams.starParams;

        // disable orbit controller
        LogMng.debug('onStateToStarEnter(): starParams:', starParams);
        this._orbitControl.enabled = false;
        document.body.style.cursor = 'default';

        // let systemData = TEST_STARS_DATA[aParams.starId];

        let starPos = new THREE.Vector3(
            starParams.pos.x,
            starParams.pos.y,
            starParams.pos.z
        );

        // create Solar System

        let starScale = 1;

        this.solarSystem = new SolarSystem(
            this._camera,
            starScale,
            {
                starParams: {
                    galaxyColor: starParams.color,
                    starSize: starParams.starInfo.bigStar.starSize,
                    mainColor: starParams.starInfo.bigStar.color.main,
                    coronaColor: starParams.starInfo.bigStar.color.corona
                }
            }
        );

        this.solarSystem.position.copy(starPos);
        this.solarSystem.scale.set(0, 0, 0);
        this.solarSystem.visible = false;
        this._scene.add(this.solarSystem);

        // this.solarSystemBlinkStarsParticles.position.set(0, 0, 0);
        this._solarSystemBlinkStarsParticles.position.copy(starPos);
        this._solarSystemBlinkStarsParticles.scale.set(0.1, 0.1, 0.1);
        // this.solarSystem.add(this.solarSystemBlinkStarsParticles);
        this._scene.add(this._solarSystemBlinkStarsParticles);
        this._solarSystemBlinkStarsParticles.visible = false;
        this._solarSystemBlinkStarsParticles.alphaFactor = 0;

        gsap.to(this._solarSystemBlinkStarsParticles.scale, {
            x: 1,
            y: 1,
            z: 1,
            delay: DUR * 2 / 10,
            duration: DUR,
            ease: 'sine.inOut',
            onStart: () => {
                this._solarSystemBlinkStarsParticles.visible = true;
            }
        });
        gsap.to(this._solarSystemBlinkStarsParticles, {
            alphaFactor: 1,
            delay: DUR * 6 / 10,
            duration: DUR * .8,
            ease: 'sine.inOut'
        });

        // crete a small sprite of star in the galaxy
        let sunClr = starParams.color;
        this.bigStarSprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: ThreeLoader.getInstance().getTexture('star4_512'),
            color: new THREE.Color(sunClr.r, sunClr.g, sunClr.b),
            transparent: true,
            alphaTest: 0.01,
            opacity: 1,
            depthWrite: false,
            depthTest: true,
            blending: THREE.AdditiveBlending
        }));
        let sc = 5;
        this.bigStarSprite.scale.set(sc, sc, sc);
        this.bigStarSprite.position.copy(starPos);
        this._scene.add(this.bigStarSprite);

        gsap.to(this.bigStarSprite.scale, {
            x: 50,
            y: 50,
            duration: DUR,
            ease: 'sine.inOut'
        });
        gsap.to([this.bigStarSprite.material], {
            opacity: 0,
            delay: 3 * DUR / 5,
            duration: 2 * DUR / 5,
            ease: 'sine.inOut'
        });


        // hide point sprites
        // for (let i = 0; i < this.starPointSprites.length; i++) {
        //     this.starPointSprites[i].hide(DUR / 10);
        // }
        this.starPointsMng.hidePoints(DUR / 10);
        // hide galaxy plane
        this.galaxySaveAnimData.galaxyPlaneOpacity = this._galaxyPlane.material['opacity'];
        gsap.to(this._galaxyPlane.material, {
            opacity: 0,
            duration: DUR / 1.5,
            ease: 'sine.in',
            onComplete: () => {
                this._galaxyPlane.visible = false;
            }
        });

        // change galo
        this.galaxySaveAnimData.galaxyCenter1Opacity = this._galaxyCenterSprite.material['opacity'];
        this.galaxySaveAnimData.galaxyCenter2Opacity = this._galaxyCenterSprite2.material['opacity'];
        gsap.to([this._galaxyCenterSprite.material, this._galaxyCenterSprite2.material], {
            opacity: 0.2,
            duration: DUR,
            ease: 'sine.in'
        });
        this.galaxySaveAnimData.galaxyCenter1Scale = this._galaxyCenterSprite.scale.clone();
        this.galaxySaveAnimData.galaxyCenter2Scale = this._galaxyCenterSprite2.scale.clone();
        gsap.to([this._galaxyCenterSprite.scale, this._galaxyCenterSprite2.scale], {
            x: Settings.GALAXY_CENTER_SCALE * 0.5,
            y: Settings.GALAXY_CENTER_SCALE * 0.1,
            duration: DUR,
            ease: 'sine.in'
        });

        // pos galaxyCenterPlane
        let starPosVec3 = new THREE.Vector3(starParams.pos.x, starParams.pos.y, starParams.pos.z);
        let galaxyCenterPlanePos = new THREE.Vector3();
        if (starPosVec3.length() < 50) {
            galaxyCenterPlanePos = starPosVec3.clone().normalize().multiplyScalar(-50).add(starPosVec3);
        }
        gsap.killTweensOf(this._galaxyCenterPlane.position);
        gsap.to(this._galaxyCenterPlane.position, {
            x: galaxyCenterPlanePos.x,
            y: 0,
            z: galaxyCenterPlanePos.z,
            duration: DUR * 2,
            ease: 'sine.inOut',
            onStart: () => {
                this._galaxyCenterPlane.visible = true;
            }
        });

        // show galaxyCenterPlane
        this._galaxyCenterPlane.lookAt(starPos);
        gsap.killTweensOf(this._galaxyCenterPlane.material);
        gsap.to(this._galaxyCenterPlane.material, {
            opacity: 1,
            duration: DUR,
            ease: 'sine.in',
            onStart: () => {
                this._galaxyCenterPlane.visible = true;
            }
        });
        gsap.killTweensOf(this._galaxyCenterPlane.scale);
        gsap.to([this._galaxyCenterPlane.scale], {
            x: Settings.GALAXY_CENTER_SCALE * 1.5,
            y: Settings.GALAXY_CENTER_SCALE * 0.1,
            duration: DUR,
            ease: 'sine.in',
            onStart: () => {
                this._galaxyCenterPlane.visible = true;
            }
        });

        // move camera target to center of Star
        gsap.to(this._cameraTarget, {
            x: starParams.pos.x,
            y: starParams.pos.y,
            z: starParams.pos.z,
            duration: DUR / 1.5,
            ease: 'sine.out',
            onUpdate: () => {
                this._orbitCenter.copy(this._cameraTarget);
            }
        });

        this.galaxySaveAnimData.cameraPosition = this._camera.position.clone();

        // move camera

        let h = GameUtils.getClientHeight();
        if (!DeviceInfo.getInstance().desktop) {
            if (!document.fullscreenElement) {
                h = window.innerHeight + 104;
            }
        }

        let aspect = GameUtils.getClientWidth() / h;
        // let guiScaleByW = this.guiGetScaleBigStarTooltipByWidth();
        // let d = innerHeight / (20 * aspect);
        // let starDist = MyMath.clamp(d * (0.6 / guiScaleByW), 40, 50);
        let starDist = MyMath.clamp(35 / aspect, 40, 90);

        // LogMng.debug(`guiScaleByWidth: ${guiScaleByW}`);
        // LogMng.debug(`asRat: ${aspect}`);
        // LogMng.debug(`d: ${d}`);
        LogMng.debug(`-----> starDist: ${starDist}`);

        let newCameraPos = this._camera.position.clone().sub(starPos).normalize().
            multiplyScalar(starDist).add(starPos);
        gsap.to(this._camera.position, {
            x: newCameraPos.x,
            y: newCameraPos.y,
            z: newCameraPos.z,
            duration: DUR,
            ease: 'sine.inOut'
        });

        // scale galaxy
        let tObj = { s: 1 };
        let gVec = starPos.clone().negate();
        gsap.to(tObj, {
            s: GALAXY_BIG_SCALE,
            duration: DUR,
            ease: 'sine.in',
            onUpdate: () => {
                // LogMng.debug(`dummyGalaxy.scale:`, tObj.s);
                this._dummyGalaxy['currScale'] = tObj.s;
                this._dummyGalaxy.scale.set(tObj.s, tObj.s, tObj.s);
                this._dummyGalaxy.position.copy(starPos.clone().add(gVec.clone().multiplyScalar(tObj.s)));
            }
        });

        // scale down small galaxies
        for (let i = 0; i < this._smallGalaxies.length; i++) {
            const galaxy = this._smallGalaxies[i];
            gsap.to(galaxy.scale, {
                x: 1 / GALAXY_BIG_SCALE,
                y: 1 / GALAXY_BIG_SCALE,
                z: 1 / GALAXY_BIG_SCALE,
                duration: DUR * 1 / 3,
                ease: 'sine.Out',
                onComplete: () => {
                    galaxy.visible = false;
                }
            });
        }

        // expand solar system
        gsap.to(this.solarSystem.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: DUR,
            delay: DUR * 2 / 3,
            ease: 'sine.Out',
            onStart: () => {
                this.solarSystem.visible = true;
            },
            onComplete: () => {
                this._fsm.startState(States.star, aParams);
            }
        });

        this.smallFlySystem.activeSpawn = false;

        AudioMng.getInstance().playSfx(AudioAlias.SFX_DIVE_IN);

        setTimeout(() => {
            let starSnd = AudioMng.getInstance().getSound(AudioAlias.SFX_STAR_FIRE);
            starSnd.loop = true;
            starSnd.volume = AudioMng.getInstance().sfxVolume;
            starSnd.play();
        }, 1000 * DUR / 2);

    }

    private onStateToStarUpdate(dt: number) {
        // this._orbitControl.update();

        if (this._cameraTarget && this._camera) {
            this._camera.lookAt(this._cameraTarget);
        }

        this.updateFarStars(dt);
        this.updateSmallGalaxies(dt);

        this.solarSystem?.update(dt);

        if (this._solarSystemBlinkStarsParticles?.visible) this._solarSystemBlinkStarsParticles.update(dt);

        this.smallFlySystem.update(dt);

    }

    private onStateStarEnter(aParams: {
        starId: number,
        starParams: GalaxyStarParams
    }) {

        this.logDebug('onStateStarEnter...');

        this._orbitControl.autoRotate = false;
        this._orbitControl.enableZoom = false;
        this._orbitControl.enabled = true;

        // let starData = TEST_STARS_DATA[this.currentStarId];
        // get star params by id
        // let starParams: GalaxyStarParams;
        // for (let i = 0; i < this.galaxyStarsData.length; i++) {
        //     const gsp = this.galaxyStarsData[i];
        //     if (gsp.id = this.currentStarId) {
        //         starParams = gsp;
        //         break;
        //     }
        // }

        // let starParams: GalaxyStarParams = this.starPointParamsHovered.starParams;
        let starParams: GalaxyStarParams = aParams.starParams;

        let guiScale = this.guiGetScaleBigStarTooltip();

        GameEvents.dispatchEvent(GameEvents.EVENT_SHOW_STAR_GUI, {
            starData: starParams.starInfo.serverData,
            scale: guiScale
        });

    }

    private onStateStarUpdate(dt: number) {

        this._orbitControl.update();

        if (this._cameraTarget && this._camera) {
            this._camera.lookAt(this._cameraTarget);
        }

        this.updateSmallGalaxies(dt);
        this.updateRotationSound(dt);

        if (this.solarSystem) this.solarSystem.update(dt);

        if (this._solarSystemBlinkStarsParticles?.visible) this._solarSystemBlinkStarsParticles.update(dt);

        this.smallFlySystem.update(dt);
    }

    private onStateFromStarEnter() {

        const DUR = 3;

        this._orbitControl.enabled = false;

        let starPos = this.solarSystem.position.clone();

        // show galaxy main sprite
        gsap.to(this._galaxyPlane.material, {
            opacity: this.galaxySaveAnimData.galaxyPlaneOpacity,
            duration: DUR * 2 / 3,
            delay: DUR * 1 / 3,
            ease: 'sine.Out',
            onStart: () => {
                this._galaxyPlane.visible = true;
            }
        });

        // show star point sprite
        // for (let i = 0; i < this.starPointSprites.length; i++) {
        //     this.starPointSprites[i].show(DUR * 0.1, DUR * 0.9);
        // }
        this.starPointsMng.showPoints(DUR * 0.1, DUR * 0.9);


        // change galo
        gsap.to([this._galaxyCenterSprite.material], {
            opacity: this.galaxySaveAnimData.galaxyCenter1Opacity,
            duration: DUR,
            ease: 'sine.Out'
        });
        gsap.to([this._galaxyCenterSprite2.material], {
            opacity: this.galaxySaveAnimData.galaxyCenter2Opacity,
            duration: DUR,
            ease: 'sine.Out'
        });
        // galaxyCenter1Scale
        gsap.to([this._galaxyCenterSprite.scale], {
            x: this.galaxySaveAnimData.galaxyCenter1Scale.x,
            y: this.galaxySaveAnimData.galaxyCenter1Scale.y,
            duration: DUR,
            ease: 'sine.in'
        });
        gsap.to([this._galaxyCenterSprite2.scale], {
            x: this.galaxySaveAnimData.galaxyCenter2Scale.x,
            y: this.galaxySaveAnimData.galaxyCenter2Scale.y,
            duration: DUR,
            ease: 'sine.in'
        });
        // hide galaxyCenterPlane
        gsap.killTweensOf(this._galaxyCenterPlane.material);
        gsap.to(this._galaxyCenterPlane.material, {
            opacity: 0,
            duration: DUR,
            ease: 'sine.Out',
            onComplete: () => {
                this._galaxyCenterPlane.visible = false;
            }
        });
        gsap.killTweensOf(this._galaxyCenterPlane.position);
        gsap.to(this._galaxyCenterPlane.position, {
            x: 0,
            y: 0,
            z: 0,
            duration: DUR,
            ease: 'sine.in',
            onStart: () => {
                this._galaxyCenterPlane.visible = true;
            }
        });

        // move camera target to center of Galaxy
        gsap.to(this._cameraTarget, {
            x: 0,
            y: 0,
            z: 0,
            duration: DUR,
            ease: 'sine.inOut',
            onUpdate: () => {
                this._orbitCenter.copy(this._cameraTarget);
            }
        });

        // scale galaxy
        let tObj = { s: 100 };
        let gVec = starPos.clone().negate();
        gsap.to(tObj, {
            s: 1,
            duration: DUR,
            ease: 'sine.inOut',
            onUpdate: () => {
                this._dummyGalaxy.scale.set(tObj.s, tObj.s, tObj.s);
                this._dummyGalaxy['currScale'] = tObj.s;
                this._dummyGalaxy.position.copy(starPos.clone().add(gVec.clone().multiplyScalar(tObj.s)));
            }
        });

        // scale small star sprite
        gsap.to([this.bigStarSprite.material], {
            opacity: 1,
            delay: 2 / 5 * DUR,
            duration: 3 / 5 * DUR,
            ease: 'sine.inOut'
        });
        gsap.to([this.bigStarSprite.scale], {
            x: 2,
            y: 2,
            duration: DUR * 1.5,
            ease: 'sine.inOut',
            onComplete: () => {
                this._scene.remove(this.bigStarSprite);
                this.bigStarSprite = null;
            }
        });

        // scale down small galaxies
        for (let i = 0; i < this._smallGalaxies.length; i++) {
            const galaxy = this._smallGalaxies[i];
            galaxy.visible = true;
            gsap.to(galaxy.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: DUR * 1 / 3,
                delay: DUR * 2 / 3,
                ease: 'sine.inOut'
            });
        }

        // hide solar system
        gsap.to(this.solarSystem.scale, {
            x: 0.001,
            y: 0.001,
            z: 0.001,
            duration: DUR * 2 / 3,
            ease: 'sine.in',
            onComplete: () => {
                this.solarSystem.visible = false;
                this.solarSystem.free();
                this._scene.remove(this.solarSystem);
                this.solarSystem = null;
            }
        });

        // hide star blink stars
        gsap.to(this._solarSystemBlinkStarsParticles, {
            alphaFactor: 0,
            duration: DUR * 4 / 10,
            ease: 'sine.in'
        });

        // move camera
        gsap.to(this._camera.position, {
            x: this.galaxySaveAnimData.cameraPosition.x,
            y: this.galaxySaveAnimData.cameraPosition.y,
            z: this.galaxySaveAnimData.cameraPosition.z,
            duration: DUR,
            ease: 'sine.inOut',
            onComplete: () => {
                this._fsm.startState(States.realStars);
            }
        });

        GameEvents.dispatchEvent(GameEvents.EVENT_HIDE_STAR_PREVIEW);

        this.smallFlySystem.activeSpawn = true;

        AudioMng.getInstance().playSfx(AudioAlias.SFX_DIVE_OUT);
        setTimeout(() => {
            AudioMng.getInstance().getSound(AudioAlias.SFX_STAR_FIRE).stop();
        }, 1000 * DUR / 3);

        // GameEvents.dispatchEvent(GameEvents.EVENT_STAR_MODE);

    }
    private onStateFromStarUpdate(dt: number) {
        this._orbitControl.update();

        if (this._cameraTarget && this._camera) {
            this._camera.lookAt(this._cameraTarget);
        }

        this.updateFarStars(dt);
        this.updateSmallGalaxies(dt);
        this.updateStarPoints();

        if (this.solarSystem) this.solarSystem.update(dt);

        if (this._solarSystemBlinkStarsParticles?.visible) this._solarSystemBlinkStarsParticles.update(dt);

        this.smallFlySystem.update(dt);


    }

    // private _novaSprite: NovaSprite;
    private _novaSprite: THREE.Sprite;
    private onStateCreateStarEnter(aServerStarData: ServerStarData) {

        // find star in phantom mode and remove it
        for (let i = 0; i < this._phantomStarsData.length; i++) {
            const psd = this._phantomStarsData[i];
            if (psd.id == this._phantomStarPicked?.id) {
                this._phantomStarsData.splice(i, 1);
                break;
            }
        }
        this.recreateGalaxyStars(false);

        // add new star to real mode
        let newRealStars = StarGenerator.getInstance().getRealStarDataByServer({
            alphaMin: Settings.galaxyData.alphaMin,
            alphaMax: Settings.galaxyData.alphaMax,
            scaleMin: Settings.galaxyData.scaleMin,
            scaleMax: Settings.galaxyData.scaleMax
        }, [aServerStarData]);

        if (newRealStars.length <= 0) {
            LogMng.warn('onStateCreateStarEnter(): newRealStars.length <= 0');
            return;
        }

        const star = newRealStars[0];
        this._realStarsData.push(star);

        // recreate star particles
        // this.destroyRealStarParticles();
        this.recreateGalaxyStars();
        this.initQuadTree();

        // switch to real mode
        this._phantomStarsParticles.visible = false;
        this._realStarsParticles.visible = true;
        GameEvents.dispatchEvent(GameEvents.EVENT_SHOW_REAL_MODE);

        GameEvents.dispatchEvent(GameEvents.EVENT_STAR_MODE);

        // debugger;

        // animation star appear
        // this._novaSprite = new NovaSprite({ camera: this._camera });
        let clr = new THREE.Color();
        clr.setRGB(star.color.r, star.color.g, star.color.b);
        let sMat = new THREE.SpriteMaterial({
            map: ThreeLoader.getInstance().getTexture(`star_03`),
            color: clr,
            transparent: true,
            alphaTest: 0.01,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        this._novaSprite = new THREE.Sprite(sMat);
        this._novaSprite.scale.set(0, 0, 0);
        this._novaSprite.position.set(aServerStarData.params.coords.X, aServerStarData.params.coords.Y, aServerStarData.params.coords.Z);
        this._dummyGalaxy.add(this._novaSprite);

        const DUR = 1;

        gsap.to(this._cameraTarget, {
            x: this._novaSprite.position.x,
            y: this._novaSprite.position.y,
            z: this._novaSprite.position.z,
            duration: DUR,
            delay: .1,
            ease: 'sine.inOut',
            onUpdate: () => {
                this._orbitCenter.copy(this._cameraTarget);
            }
        });
        let tl = gsap.timeline({delay: DUR});
        tl.to(this._novaSprite.scale, {
            x: 4,
            y: 4,
            z: 4,
            duration: .5,
            ease: 'sine.out',
            onComplete: () => {
                // this._fsm.startState(States.realStars);
            }
        });
        tl.to(this._novaSprite.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1,
            ease: 'sine.in',
            onComplete: () => {
                // goto this star
                this._fsm.startState(States.toStar, {
                    starId: aServerStarData.id,
                    starParams: star
                });
            }
        });

        

    }

    private onStateCreateStarUpdate(dt: number) {
        this.updateRealStars(dt);
        this.updateBlinkStars(dt);
        // this._novaSprite.update(dt);
        this.updateStarPoints();

        this._orbitControl.update();
        if (this._cameraTarget && this._camera) {
            this._camera.lookAt(this._cameraTarget);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////


    /**
     * 
     * @param dt in sec
     */
    update(dt: number) {

        this._fsm.update(dt);


    }

}
