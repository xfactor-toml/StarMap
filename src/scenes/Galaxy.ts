import * as THREE from 'three';
import { ThreeLoader } from '../loaders/ThreeLoader';
import { MyMath } from '../utils/MyMath';
import gsap from 'gsap';
import { Settings } from '../data/Settings';
import { FarStars } from '../objects/FarStars';
import { GalaxyStars } from '../objects/GalaxyStars';
import { DeviceInfo } from '../utils/DeviceInfo';
import { InputMng } from '../inputs/InputMng';
import { FSM } from '../states/FSM';
import { States } from '../states/States';
import { SolarSystem } from '../objects/SolarSystem';
import { FrontEvents } from '../events/FrontEvents';
import { GameEvents } from '../events/GameEvents';
import { BigStarParams } from '../objects/BigStar';
import { SmallFlySystem } from '../objects/smallFly/SmallFlySystem';
import { MyOrbitControls } from '../mythree/MyOrbitControls';
import { AudioMng } from '../audio/AudioMng';
import { AudioData } from '../audio/AudioData';
import { StarPoint } from '../objects/StarPoint';
import { LogMng } from '../utils/LogMng';
import { GameUtils } from '../math/GameUtils';
import { QTDebugRender, QTPoint, QTRect, QuadTree } from '../math/QuadTree';

const RACES = ['Robots', 'Humans', 'Simbionts', 'Lizards', 'Insects'];

const SOLAR_SYSTEMS_DATA: {
    name: string;
    description: string;
    level: number;
    raceId: number;
    planetsSlots: number;
    energy: number;
    life: number;
    positionInGalaxy: {
        x: number,
        y: number,
        z: number
    },
    starParams: BigStarParams
}[] = [

    // robots
    {
        name: "Star 1",
        description: `This is a star of Robots. This is a test description text.`,
        level: 1,
        raceId: 0,
        planetsSlots: 100,
        energy: 1000,
        life: 300,
        positionInGalaxy: {
            x: 40, y: 0, z: 100
        },
        starParams: {
            starSize: 30,
            sunClr1: { r: 0., g: 0.7, b: 0.96 },
            sunClr2: { r: 0., g: 0., b: 0.8 },
            sunClr3: { r: 0., g: 0., b: 1. },
            sunClr4: { r: 0., g: 0.68, b: 1. },
            sunClr5: { r: 0.68, g: 0.92, b: 1. },
            sunCoronaClr1: { r: 0.1, g: 0.4, b: 1.0 },
            sunCoronaClr2: { r: 0., g: 0., b: .7 },

            sun2Color: { r: 0.61, g: 0.70, b: 1. },
            sun2CoronaColor: { r: 0.12, g: 0.34, b: 1.0 },
        }
    },

    // humans
    {
        name: "Star 2",
        description: `This is a star of Humans. This is a test description text.`,
        level: 2,
        raceId: 1,
        planetsSlots: 100,
        energy: 1000,
        life: 300,
        positionInGalaxy: {
            x: 10, y: 0, z: -100
        },
        starParams: {
            starSize: 34,
            sunClr1: { r: 0.96, g: 0.7, b: 0. },
            sunClr2: { r: 0.8, g: 0., b: 0. },
            sunClr3: { r: 1., g: 0., b: 0. },
            sunClr4: { r: 1., g: 0.68, b: 0. },
            sunClr5: { r: 1., g: 0.92, b: .54 },
            sunCoronaClr1: { r: 1.0, g: 0.4, b: .0 },
            sunCoronaClr2: { r: 1., g: 0., b: .0 },

            sun2Color: { r: 0.96, g: 0.7, b: 0. },
            sun2CoronaColor: { r: 1.0, g: 0.4, b: .0 },
        }
    },

    // simbionts
    {
        name: "Star 3",
        description: `This is a star of Simbionts. This is a test description text.`,
        level: 3,
        raceId: 2,
        planetsSlots: 100,
        energy: 1000,
        life: 300,
        positionInGalaxy: {
            x: 100, y: 0, z: -10
        },
        starParams: {
            starSize: 20,
            sunClr1: { r: 0.17, g: 0.09, b: 0.42 },
            sunClr2: { r: .0, g: .0, b: .06 },
            sunClr3: { r: .0, g: .0, b: .08 },
            sunClr4: { r: 1., g: 1., b: 1. },
            sunClr5: { r: .81, g: 0.67, b: 1. },
            sunCoronaClr1: { r: .58, g: 0.53, b: 1. },
            sunCoronaClr2: { r: .08, g: .04, b: .75 },

            sun2Color: { r: 0.13, g: 0.08, b: 0.38 },
            sun2CoronaColor: { r: .33, g: 0.26, b: .83 },
        }
    },

    // lizards
    {
        name: "Star 4",
        description: `This is a star of Lizards. This is a test description text.`,
        level: 1,
        raceId: 3,
        planetsSlots: 100,
        energy: 1000,
        life: 300,
        positionInGalaxy: {
            x: -80, y: 0, z: -80
        },
        starParams: {
            starSize: 30,
            sunClr1: { r: 1., g: 0.5, b: 0. },
            sunClr2: { r: 1., g: 0.5, b: 0. },
            sunClr3: { r: 1., g: 0.5, b: 0. },
            sunClr4: { r: 1., g: .7, b: 0. },
            sunClr5: { r: 1., g: 0.5, b: .35 },
            sunCoronaClr1: { r: 1., g: 0.9, b: .43 },
            sunCoronaClr2: { r: 1., g: .66, b: .1 },

            sun2Color: { r: 1., g: 0.77, b: 0.47 },
            sun2CoronaColor: { r: .37, g: 0.37, b: .0 },
        }
    },

    // insects
    {
        name: "Star 5",
        description: `This is a star of Insects. This is a test description text.`,
        level: 2,
        raceId: 4,
        planetsSlots: 100,
        energy: 1000,
        life: 300,
        positionInGalaxy: {
            x: -80, y: 0, z: 70
        },
        starParams: {
            starSize: 40,
            sunClr1: { r: 0.35, g: 0.09, b: 0.95 },
            sunClr2: { r: 0.18, g: 0.04, b: 1. },
            sunClr3: { r: .34, g: 0.1, b: 1. },
            sunClr4: { r: 1., g: 1., b: 1. },
            sunClr5: { r: .62, g: 0.5, b: 1. },
            sunCoronaClr1: { r: .6, g: 0.3, b: 1. },
            sunCoronaClr2: { r: .16, g: .04, b: 1.0 },

            sun2Color: { r: 0.65, g: 0.54, b: 1. },
            sun2CoronaColor: { r: .6, g: 0.3, b: 1. },
        }
    }

];

const STARS_COLORS = [
    [0.505, 0.39, 0.3],
    [0.258, 0.282, 0.145],
    [0.694, 0.301, 0.282],
    [0.745, 0.635, 0.360],
    [0.431, 0.831, 0.819],
    [1.0, 0.901, 0.890]
];

type GalaxyParams = {
    starsCount: number;
    startAngle?: number;
    endAngle?: number;
    startOffsetXY?: number;
    endOffsetXY?: number;
    startOffsetH?: number;
    endOffsetH?: number;
    k?: number;
    alphaMin?: number;
    alphaMax?: number;
    scaleMin?: number;
    scaleMax?: number;
};

type GalaxyCircleParams = {
    starsCount: number;
    minRadius?: number;
    maxRadius: number;
    alphaMin?: number;
    alphaMax?: number;
    scaleMin?: number;
    scaleMax?: number;
};

export type GalaxyStarParams = {

    pos: {
        x: number;
        y: number;
        z: number;
    },

    // normalized RGBA
    color: {
        r: number;
        g: number;
        b: number;
        a: number;
    },

    scale: number;

    blink?: {
        isFade: boolean;
        duration: number;
        progressTime: number;
        tweenFunction: Function;
    }

};

export type FarGalaxyParams = {
    textureName: string;
    pos: {
        x: number;
        y: number;
        z: number;
    },
    size: number;
    alpha: number;
    dir: {
        x: number;
        y: number;
        z: number;
    },
    rotationSpeed: number;
};

let debugObjects = {
    farStarsSphereMin: null,
    farStarsSphereMax: null,
}

export class Galaxy {

    private fsm: FSM;

    private render: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;

    private cameraTarget: THREE.Vector3;
    private orbitCenter: THREE.Vector3;

    private dummyGalaxy: THREE.Group;

    private galaxyPlane: THREE.Mesh;
    private galaxyCenterSprite: THREE.Sprite;
    private galaxyCenterSprite2: THREE.Sprite;
    private galaxyCenterPlane: THREE.Mesh;

    private galaxyStarsData: GalaxyStarParams[];
    private starsParticles: GalaxyStars;

    private blinkStarsData: GalaxyStarParams[];
    private blinkStarsParticles: GalaxyStars;

    private solarSystemBlinkStarsData: GalaxyStarParams[];
    private solarSystemBlinkStarsParticles: GalaxyStars;

    private farStars: FarStars;

    private farGalaxiesData: FarGalaxyParams[];
    private smallGalaxies: THREE.Mesh[];

    private orbitControl: MyOrbitControls;

    private axiesHelper: THREE.AxesHelper;

    private raycaster: THREE.Raycaster;
    private checkMousePointerTimer = 0;

    private starPointSprites: StarPoint[];
    private starPointHovered: THREE.Sprite;
    private currentStarId = -1;

    private isStarPreviewState = false;

    private bigStarSprite: THREE.Sprite;
    private solarSystem: SolarSystem;

    private galaxySaveAnimData: any = {};

    private smallFlySystem: SmallFlySystem;

    private _starAlphaFactor = 1;

    // rot sound
    private rotSndStartTimer = 0;
    private prevCameraAzimutAngle = 0;
    private prevCamPolarAngle = 0;

    private quadTree: QuadTree;
    private qtDebugRender: QTDebugRender;


    constructor(aParams: any) {
        this.render = aParams.render;
        this.scene = aParams.scene;
        this.camera = aParams.camera;
        this.cameraTarget = new THREE.Vector3();
        this.orbitCenter = new THREE.Vector3();

        if (!DeviceInfo.getInstance().iOS) {
            this._starAlphaFactor = 0.6;
        }
    }

    public set centerVisible(v: boolean) {
        this.galaxyCenterSprite.visible = v;
        this.galaxyCenterSprite2.visible = v;
    }

    init() {

        AudioMng.getInstance().playSfx(AudioData.SFX_INIT_FLY);

        this.dummyGalaxy = new THREE.Group();
        this.scene.add(this.dummyGalaxy);

        this.createSkybox();

        this.createSmallGalaxies(true);

        // main galaxy sprite
        this.galaxyPlane = this.createGalaxyPlane();
        this.dummyGalaxy.add(this.galaxyPlane);

        // galaxy center sprite
        this.galaxyCenterSprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: ThreeLoader.getInstance().getTexture('sun_01'),
                color: Settings.GALAXY_CENTER_COLOR,
                transparent: true,
                alphaTest: 0.01,
                opacity: 1,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            })
        );
        this.galaxyCenterSprite.scale.set(Settings.GALAXY_CENTER_SCALE, Settings.GALAXY_CENTER_SCALE, Settings.GALAXY_CENTER_SCALE);
        // this.galaxyCenterSprite.renderOrder = 999;
        this.dummyGalaxy.add(this.galaxyCenterSprite);

        this.galaxyCenterSprite2 = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: ThreeLoader.getInstance().getTexture('sun_romb'),
                color: Settings.GALAXY_CENTER_COLOR,
                transparent: true,
                // alphaTest: 0.01,
                opacity: 1,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            })
        );
        this.galaxyCenterSprite2.scale.set(Settings.GALAXY_CENTER_SCALE_2, Settings.GALAXY_CENTER_SCALE_2, Settings.GALAXY_CENTER_SCALE_2);
        // this.galaxyCenterSprite2.renderOrder = 999;
        this.dummyGalaxy.add(this.galaxyCenterSprite2);

        let planeGeom = new THREE.PlaneGeometry(1, 1);
        let planeMat = new THREE.MeshBasicMaterial({
            map: ThreeLoader.getInstance().getTexture('sun_romb'),
            color: Settings.GALAXY_CENTER_COLOR,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        this.galaxyCenterPlane = new THREE.Mesh(planeGeom, planeMat);
        this.galaxyCenterPlane.visible = false;
        this.dummyGalaxy.add(this.galaxyCenterPlane);

        this.createGalaxyStars(true);

        // OUT STARS
        this.createFarStars();

        // BIG STARS (SOLAR SYSTEMS)
        this.createStarPoints();

        // fly system
        let starsPos: THREE.Vector3[] = [];
        for (let i = 0; i < SOLAR_SYSTEMS_DATA.length; i++) {
            const solSys = SOLAR_SYSTEMS_DATA[i];
            starsPos.push(new THREE.Vector3(solSys.positionInGalaxy.x, solSys.positionInGalaxy.y, solSys.positionInGalaxy.z));
        }
        for (let i = 0; i < this.galaxyStarsData.length; i += 2) {
            let pos = this.galaxyStarsData[i].pos;
            starsPos.push(new THREE.Vector3(pos.x, pos.y, pos.z));
        }
        this.smallFlySystem = new SmallFlySystem(this.dummyGalaxy, starsPos);

        // camera controls
        let minCameraDistance = 50;
        let maxCameraDistance = 500;
        if (!DeviceInfo.getInstance().desktop) maxCameraDistance = 1000;
        
        this.createCameraControls({
            enabled: false,
            minDist: minCameraDistance,
            maxDist: maxCameraDistance,
            stopAngleTop: 10,
            stopAngleBot: 170
        });

        this.raycaster = new THREE.Raycaster();

        // start music
        AudioMng.getInstance().playMusic(AudioData.MUSIC_MAIN);

        // helpers
        if (Settings.isDebugMode) {
            this.axiesHelper = new THREE.AxesHelper(150);
            this.scene.add(this.axiesHelper);
        }

        // inputs
        let inputMng = InputMng.getInstance();
        inputMng.onInputDownSignal.add(this.onInputDown, this);
        inputMng.onInputUpSignal.add(this.onInputUp, this);

        this.fsm = new FSM();
        this.fsm.addState(States.init, this, this.onStateInitEnter, this.onStateInitUpdate);
        this.fsm.addState(States.galaxy, this, this.onStateGalaxyEnter, this.onStateGalaxyUpdate);
        this.fsm.addState(States.toStar, this, this.onStateToStarEnter, this.onStateToStarUpdate);
        this.fsm.addState(States.star, this, this.onStateStarEnter, this.onStateStarUpdate);
        this.fsm.addState(States.fromStar, this, this.onStateFromStarEnter, this.onStateFromStarUpdate);
        this.fsm.startState(States.init);

        // front events

        FrontEvents.setMusicVolume.add((aData: { v: number }) => {
            let am = AudioMng.getInstance();
            let music = am.getSound(AudioData.MUSIC_MAIN);
            am.musicVolume = music.volume = aData.v;
            localStorage.setItem(`musicVolume`, String(am.musicVolume));
        }, this);
        
        FrontEvents.setSFXVolume.add((aData: { v: number }) => {
            let am = AudioMng.getInstance();
            am.sfxVolume = aData.v;
            localStorage.setItem(`sfxVolume`, String(am.sfxVolume));
        }, this);

        FrontEvents.diveIn.add((aData: { starId : number}) => {
            this.fsm.startState(States.toStar, { starId: aData.starId });
        }, this);

        FrontEvents.flyFromStar.add(() => {
            this.isStarPreviewState = false;
            if (this.fsm.getCurrentState().name == States.star) {
                this.fsm.startState(States.fromStar);
            }
        }, this);

    }

    initDebugGui() {

        const DEBUG_PARAMS = {
            'center visible': true,
            'recreate': () => {
                this.createGalaxyStars();
            },
            'recreateSmallGalaxies': () => {
                this.createSmallGalaxies();
            },
            'saveState': () => {
                this.saveState();
            },
            'flyFromStar': () => {
                if (this.fsm.getCurrentState().name == States.star) {
                    this.fsm.startState(States.fromStar);
                }
            },
            showSpheres: false,
            axiesHelper: false
        };

        const gui = Settings.datGui;

        let galaxyFolder = gui.addFolder('Galaxy');

        galaxyFolder.add(Settings.galaxyData, 'starsCount', 0, 10000, 100).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'blinkStarsCount', 0, 5000, 100).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'blinkDurMin', 0.1, 10, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'blinkDurMax', 1, 20, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'startAngle', 0, 2, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'endAngle', 0, Math.PI * 2, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'startOffsetXY', 0, 3, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'endOffsetXY', 0, 3, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'startOffsetH', 0, 10, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'endOffsetH', 0, 10, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'alphaMin', 0, 1, 0.02).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'alphaMax', 0, 1, 0.02).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'scaleMin', 0.5, 4, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Settings.galaxyData, 'scaleMax', 0.5, 4, 0.1).onChange(() => { this.createGalaxyStars(); });
        //galaxyFolder.add(Params.galaxyData, 'k', 0, 1, 0.02).onChange(() => { this.createGalaxyStars(); });
        // galaxyFolder.add(Params.galaxyData, 'isNewMethod').onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(this, '_starAlphaFactor', 0.1, 1, 0.01).onChange(() => {  });
        // this._starAlphaFactor = 0.5;

        galaxyFolder.add(DEBUG_PARAMS, 'center visible', true).onChange((value) => {
            this.centerVisible = value;
        });

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
        skyFolder.add(Settings.skyData, 'scaleMin', 0.1, 10, 0.1).onChange(() => { if (this.farStars) this.farStars.updateUniformValues(); });
        skyFolder.add(Settings.skyData, 'scaleMax', 1, 50, 1).onChange(() => { if (this.farStars) this.farStars.updateUniformValues(); });
        skyFolder.add(Settings.skyData, 'starSize', 0.1, 10, 0.1).onChange(() => { if (this.farStars) this.farStars.updateUniformValues(); });
        skyFolder.add(Settings.skyData, 'starAlpha', 0, 1, 0.1).onChange(() => { if (this.farStars) this.farStars.updateUniformValues(); });
        skyFolder.add(Settings.skyData, 'galaxiesCount', 0, 100, 1).onChange(() => { this.createSmallGalaxies(); });
        skyFolder.add(Settings.skyData, 'galaxiesSizeMin', 100, 5000, 10).onChange(() => { this.createSmallGalaxies(); });
        skyFolder.add(Settings.skyData, 'galaxiesSizeMax', 100, 8000, 10).onChange(() => { this.createSmallGalaxies(); });
        skyFolder.add(DEBUG_PARAMS, 'recreateSmallGalaxies');

        gui.add(DEBUG_PARAMS, 'saveState');

        this.axiesHelper.visible = DEBUG_PARAMS.axiesHelper;
        gui.add(DEBUG_PARAMS, 'axiesHelper').onChange((v: boolean) => {
            this.axiesHelper.visible = v;
        });

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

        let aGalaxyStarsData: any;
        let aGalaxyBlinkStarsData: any;
        if (aLoadFromFile) {
            let loader = ThreeLoader.getInstance();
            let loadData = loader.getJSON('galaxyState');
            if (loadData) {
                aGalaxyStarsData = loadData.galaxyStarsData;
                aGalaxyBlinkStarsData = loadData.blinkStarsData;
            }
        }

        // galaxy static stars data generate
        if (aGalaxyStarsData) {
            this.galaxyStarsData = aGalaxyStarsData;
        }
        else {
            this.galaxyStarsData = this.generateGalaxyStarsData({
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
            }, 145, 145, STARS_COLORS);
        }

        // blink stars data generate
        if (aGalaxyBlinkStarsData) {
            this.blinkStarsData = aGalaxyBlinkStarsData;
        }
        else {
            this.blinkStarsData = this.generateGalaxyStarsData({
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
                145, 145,
                STARS_COLORS,
                {
                    durationMin: Settings.galaxyData.blinkDurMin,
                    durationMax: Settings.galaxyData.blinkDurMax
                }
            );
        }

        // particle stars
        let t = ThreeLoader.getInstance().getTexture('star4');
        this.starsParticles = new GalaxyStars({
            starsData: this.galaxyStarsData,
            texture: t,
            onWindowResizeSignal: FrontEvents.onWindowResizeSignal
        });
        // this.starsParticles.alphaFactor = 0.5;
        this.dummyGalaxy.add(this.starsParticles);

        // blink particle stars
        this.blinkStarsParticles = new GalaxyStars({
            starsData: this.blinkStarsData,
            texture: t,
            onWindowResizeSignal: FrontEvents.onWindowResizeSignal
        });
        this.dummyGalaxy.add(this.blinkStarsParticles);

        // add stars to quadtree
        if (this.quadTree) this.quadTree.destroy();
        this.quadTree = new QuadTree(new QTRect(0, 0, 400, 400), 10);
        for (let i = 0; i < this.galaxyStarsData.length; i++) {
            const sd = this.galaxyStarsData[i];
            this.quadTree.addPoint(new QTPoint(sd.pos.x, sd.pos.z, { starData: sd }));
        }
        LogMng.debug(`qt:`, this.quadTree);

        if (!this.qtDebugRender) {
            this.qtDebugRender = new QTDebugRender();
            this.qtDebugRender.position.y = -20;
            this.dummyGalaxy.add(this.qtDebugRender);
        }
        this.qtDebugRender.quadtree = this.quadTree;
        this.qtDebugRender.render();

        // create a solar system blink stars data
        this.solarSystemBlinkStarsData = this.generateCircleGalaxyStarsData({
            starsCount: 400,
            minRadius: 180,
            maxRadius: 200,
            alphaMin: Settings.galaxyData.alphaMin,
            alphaMax: Settings.galaxyData.alphaMax,
            scaleMin: Settings.galaxyData.scaleMin,
            scaleMax: Settings.galaxyData.scaleMax,
        },
            STARS_COLORS,
            {
                durationMin: Settings.galaxyData.blinkDurMin,
                durationMax: Settings.galaxyData.blinkDurMax
            }
        );

        // solar system blink particle stars
        this.solarSystemBlinkStarsParticles = new GalaxyStars({
            starsData: this.solarSystemBlinkStarsData,
            texture: t,
            onWindowResizeSignal: FrontEvents.onWindowResizeSignal
        });
        this.solarSystemBlinkStarsParticles.visible = false;

    }

    private generateGalaxyStarsData(aParams: GalaxyParams, 
        xScale: number, zScale: number, aColorSet: any[], aBlinkData?: any): GalaxyStarParams[] {

        if (!aParams.startAngle) aParams.startAngle = 0;
        if (!aParams.endAngle) aParams.endAngle = Math.PI;
        if (!aParams.startOffsetXY) aParams.startOffsetXY = 0;
        if (!aParams.endOffsetXY) aParams.endOffsetXY = 0;
        if (!aParams.startOffsetH) aParams.startOffsetH = 0;
        if (!aParams.endOffsetH) aParams.endOffsetH = 0;
        if (!aParams.k) aParams.k = 0.3;
        if (!aParams.alphaMin) aParams.alphaMin = 1;
        if (!aParams.alphaMax) aParams.alphaMax = 1;
        if (!aParams.scaleMin) aParams.scaleMin = 1;
        if (!aParams.scaleMax) aParams.scaleMax = 1;

        let resData: GalaxyStarParams[] = [];
        const numArms = 5;
        const armDeltaAngle = 2 * Math.PI / numArms;

        // check
        if (aParams.startAngle > aParams.endAngle) aParams.startAngle = aParams.endAngle;

        for (let i = 0; i < aParams.starsCount; i++) {
            // choose an angle
            // let angle = Math.pow(Math.random(), 2) * maxAngle;
            // let angle = Math.pow(MyMath.randomInRange(minAngleFactor, 1), 2) * maxAngle;
            let dtAngle = aParams.endAngle - aParams.startAngle;
            let anglePercent = Math.pow(Math.random(), 2);
            let angle = aParams.startAngle + anglePercent * dtAngle;
            let r = aParams.k * angle;

            // set random galaxy arm
            let armId = MyMath.randomIntInRange(0, numArms - 1);
            let armAngle = angle + armId * armDeltaAngle;
            if (armId == 1) armAngle += .2;

            // convert polar coordinates to 2D
            let px = r * Math.cos(armAngle);
            let py = r * Math.sin(armAngle);

            // offset xy
            let offsetXY = aParams.startOffsetXY + anglePercent * (aParams.endOffsetXY - aParams.startOffsetXY);
            offsetXY *= 0.05;
            // let randomOffsetXY = 0.01 + (maxAngle - angle) * 0.03;
            let randomOffsetX = offsetXY * MyMath.randomInRange(-1, 1);
            let randomOffsetY = offsetXY * MyMath.randomInRange(-1, 1);

            px += randomOffsetX;
            py += randomOffsetY;

            // offset h
            let offsetH = aParams.startOffsetH + anglePercent * (aParams.endOffsetH - aParams.startOffsetH);
            offsetH = offsetH * MyMath.randomInRange(-1, 1);

            let clr = new THREE.Color(1, 1, 1);

            let customStarColor = aColorSet[MyMath.randomIntInRange(0, aColorSet.length - 1)];
            clr.r = customStarColor[0];
            clr.g = customStarColor[1];
            clr.b = customStarColor[2];

            // make result
            resData[i] = {
                pos: {
                    x: px * xScale,
                    y: offsetH,
                    z: py * zScale
                },
                color: {
                    r: clr.r,
                    g: clr.g,
                    b: clr.b,
                    a: MyMath.randomInRange(aParams.alphaMin, aParams.alphaMax)
                },
                scale: MyMath.randomInRange(aParams.scaleMin, aParams.scaleMax)
            };

            if (aBlinkData) {
                let dur = MyMath.randomInRange(aBlinkData.durationMin, aBlinkData.durationMax);
                resData[i].blink = {
                    isFade: Math.random() > 0.5,
                    duration: dur,
                    progressTime: MyMath.randomInRange(0, dur),
                    tweenFunction: MyMath.easeInOutSine
                }
            }
            
        }

        return resData;
    }

    private generateCircleGalaxyStarsData(aParams: GalaxyCircleParams , aColorSet: any[], aBlinkData?: any): GalaxyStarParams[] {

        if (!aParams.minRadius) aParams.minRadius = 0;
        if (!aParams.alphaMin) aParams.alphaMin = 1;
        if (!aParams.alphaMax) aParams.alphaMax = 1;
        if (!aParams.scaleMin) aParams.scaleMin = 1;
        if (!aParams.scaleMax) aParams.scaleMax = 1;
        
        let resData: GalaxyStarParams[] = [];
        const numArms = 5;
        const armDeltaAngle = 2 * Math.PI / numArms;

        // check
        if (aParams.minRadius > aParams.maxRadius) aParams.minRadius = aParams.maxRadius;

        for (let i = 0; i < aParams.starsCount; i++) {
            
            let pos = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
            pos.normalize().multiplyScalar(MyMath.randomInRange(aParams.minRadius, aParams.maxRadius));

            let clr = new THREE.Color(1, 1, 1);

            let customStarColor = aColorSet[MyMath.randomIntInRange(0, aColorSet.length - 1)];
            clr.r = customStarColor[0];
            clr.g = customStarColor[1];
            clr.b = customStarColor[2];

            // make result
            resData[i] = {
                pos: {
                    x: pos.x,
                    y: pos.y,
                    z: pos.z
                },
                color: {
                    r: clr.r,
                    g: clr.g,
                    b: clr.b,
                    a: MyMath.randomInRange(aParams.alphaMin, aParams.alphaMax)
                },
                scale: MyMath.randomInRange(aParams.scaleMin, aParams.scaleMax)
            };

            if (aBlinkData) {
                let dur = MyMath.randomInRange(aBlinkData.durationMin, aBlinkData.durationMax);
                resData[i].blink = {
                    isFade: Math.random() > 0.5,
                    duration: dur,
                    progressTime: MyMath.randomInRange(0, dur),
                    tweenFunction: MyMath.easeInOutSine
                }
            }

        }

        return resData;
    }

    private destroyGalaxyStars() {

        if (this.starsParticles) {
            this.starsParticles.free();
            this.starsParticles = null;
        }

        if (this.blinkStarsParticles) {
            this.blinkStarsParticles.free();
            this.blinkStarsParticles = null;
        }

    }

    private createFarStars() {

        if (this.farStars) {
            this.scene.remove(this.farStars);
            this.farStars.free();
            this.farStars = null;
        }

        this.farStars = new FarStars({
            starsCount: Settings.skyData.starsCount,
            // radiusMin: Params.skyData.radiusMin,
            // radiusMax: Params.skyData.radiusMax
        });

        // this.scene.add(this.farStars);
        this.dummyGalaxy.add(this.farStars);

    }

    private createDebugFarStarsMinSphere() {
        if (debugObjects.farStarsSphereMin) {
            this.scene.remove(debugObjects.farStarsSphereMin);
        }
        let geom = new THREE.SphereGeometry(Settings.skyData.radiusMin, 10, 10);
        let mat = new THREE.MeshNormalMaterial({
            wireframe: true
        });
        debugObjects.farStarsSphereMin = new THREE.Mesh(geom, mat);
        this.scene.add(debugObjects.farStarsSphereMin);
    }

    private createDebugFarStarsMaxSphere() {
        if (debugObjects.farStarsSphereMax) {
            this.scene.remove(debugObjects.farStarsSphereMax);
        }
        let geom = new THREE.SphereGeometry(Settings.skyData.radiusMax, 20, 20);
        let mat = new THREE.MeshNormalMaterial({
            wireframe: true
        });
        debugObjects.farStarsSphereMax = new THREE.Mesh(geom, mat);
        this.scene.add(debugObjects.farStarsSphereMax);
    }

    private createStarPoints() {

        // let loader = ThreeLoader.getInstance();
        this.starPointSprites = [];

        for (let i = 0; i < SOLAR_SYSTEMS_DATA.length; i++) {
            const starData = SOLAR_SYSTEMS_DATA[i];

            // let previewTexture = loader.getTexture('starPoint');
            // let previewMaterial = new THREE.SpriteMaterial({
            //     map: previewTexture,
            //     transparent: true,
            //     opacity: 0.9,
            //     depthWrite: false,
            //     // blending: THREE.AdditiveBlending
            // });
            
            let starPointSprite = new StarPoint({
                name: 'starPoint',
                starId: i,
                baseScale: 12,
                camera: this.camera
            });

            let starPos = starData.positionInGalaxy;
            starPointSprite.position.set(starPos.x, starPos.y, starPos.z);
            this.starPointSprites.push(starPointSprite);
            this.dummyGalaxy.add(starPointSprite);

        }

    }

    private createSkybox() {
        let loader = ThreeLoader.getInstance();
        this.scene.background = loader.getCubeTexture('skybox');
    }

    
    // SMALL GALAXIES

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
            this.farGalaxiesData = loadData;
        }
        else {
            this.farGalaxiesData = this.generateFarGalaxiesData();
        }

        this.smallGalaxies = [];
        for (let i = 0; i < this.farGalaxiesData.length; i++) {
            const galaxy = this.createSmallGalaxy(this.farGalaxiesData[i]);
            this.smallGalaxies.push(galaxy);
            this.scene.add(galaxy);
            // this.dummyGalaxy.add(galaxy);
        }

    }

    private destroySmallGalaxies() {
        if (this.smallGalaxies)
            for (let i = this.smallGalaxies.length - 1; i >= 0; i--) {
                this.scene.remove(this.smallGalaxies[i]);
            }
        this.smallGalaxies = [];
        this.farGalaxiesData = [];
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

    private createCameraControls(aParams?: any) {

        if (this.orbitControl) return;
        if (!aParams) aParams = {};
        let domElement = Settings.domRenderer;
        this.orbitControl = new MyOrbitControls(this.camera, domElement);
        this.orbitControl.enabled = aParams.enabled;
        this.orbitControl.rotateSpeed = .5;
        this.orbitControl.enableDamping = true;
        this.orbitControl.dampingFactor = Settings.CAM_DAMPING_FACTOR;
        this.orbitControl.zoomSpeed = aParams.zoomSpeed || 1;
        this.orbitControl.enablePan = aParams.enablePan == true;
        this.orbitControl.minDistance = aParams.minDist || 1;
        this.orbitControl.maxDistance = aParams.maxDist || 100;
        this.orbitControl.minPolarAngle = MyMath.toRadian(aParams.stopAngleTop || 0);
        this.orbitControl.maxPolarAngle = MyMath.toRadian(aParams.stopAngleBot || 0);
        // if (aParams.pos) {
        //     this.orbitControl.target.x = aParams.pos.x || 0;
        //     this.orbitControl.target.y = aParams.pos.y || 0;
        //     this.orbitControl.target.z = aParams.pos.z || 0;
        // }
        this.orbitControl.autoRotateSpeed = 0.05;
        this.orbitControl.autoRotate = true;

        this.orbitControl.target = this.orbitCenter;
        this.orbitControl.update();
        // this.orbitControl.addEventListener('change', () => {
        // });
        // this.orbitControl.addEventListener('end', () => {
        // });

    }

    private checkStarUnderPoint(normalCoords: any) {

        this.raycaster.setFromCamera(normalCoords, this.camera);
        const intersects = this.raycaster.intersectObjects(this.dummyGalaxy.children, true);
        let isHover = false;

        for (let i = 0; i < intersects.length; i++) {
            const obj = intersects[i].object;
            if (obj[`name`] == 'starPoint') {
                let newSpritePoint = obj as THREE.Sprite;
                if (newSpritePoint != this.starPointHovered) {
                    this.starPointHovered = newSpritePoint;
                    if (!this.isStarPreviewState) {
                        AudioMng.getInstance().playSfx(AudioData.SFX_HOVER);
                    }
                }
                isHover = true;
                break;
            }
        }

        if (!isHover) this.starPointHovered = null;

    }

    private updateInputMove() {
        let inMng = InputMng.getInstance();
        this.checkStarUnderPoint(inMng.normalInputPos);
        document.body.style.cursor = this.starPointHovered ? 'pointer' : 'default';
    }

    private onInputDown(x: number, y: number) {

        let inMng = InputMng.getInstance();
        this.checkStarUnderPoint(inMng.normalInputDown);

        if (!this.isStarPreviewState && !this.starPointHovered) {

            // window.dispatchEvent(new CustomEvent('gameEvent', { detail: { eventName: GameEvents.EVENT_HIDE_STAR_PREVIEW } }));
            GameEvents.dispatchEvent(GameEvents.EVENT_HIDE_STAR_PREVIEW);

            switch (this.fsm.getCurrentState().name) {
                case States.galaxy:
                    if (!this.orbitControl.autoRotate) this.orbitControl.autoRotate = true;
                    this.orbitControl.enableZoom = true;
                    if (!this.orbitControl.enabled) this.orbitControl.enabled = true;
                    break;
            }

        }

    }

    private onInputUp(x: number, y: number) {

        let distLimit = DeviceInfo.getInstance().desktop ? 10 : 30;
        let inMng = InputMng.getInstance();
        let dist = MyMath.getVectorLength(inMng.inputDownClientX, inMng.inputDownClientY, x, y);
        
        // LogMng.debug(`onInputUp: dist = ${dist}`);
        // if (!DeviceInfo.getInstance().desktop) alert(`onInputUp: dist = ${dist}`);

        if (dist > distLimit) return;

        switch (this.fsm.getCurrentState().name) {

            case States.galaxy:
                if (this.starPointHovered && !this.isStarPreviewState) {

                    AudioMng.getInstance().playSfx(AudioData.SFX_CLICK);

                    this.isStarPreviewState = true;
                    this.orbitControl.autoRotate = false;
                    this.orbitControl.setSphericalDelta(0, 0);
                    if (this.orbitControl.enabled) this.orbitControl.enabled = false;

                    let starId = this.starPointHovered[`starId`]!;
                    let starData = SOLAR_SYSTEMS_DATA[starId];

                    GameEvents.dispatchEvent(GameEvents.EVENT_SHOW_STAR_PREVIEW, {
                        starId: starId,
                        name: starData.name,
                        description: starData.description,
                        level: starData.level,
                        race: RACES[starData.raceId],
                        pos2d: {
                            x: inMng.inputDownClientX,
                            y: inMng.inputDownClientY
                        }
                    });
                    
                    FrontEvents.starPreviewClose.addOnce(() => {
                        this.isStarPreviewState = false;
                        this.orbitControl.autoRotate = true;
                        this.orbitControl.enableZoom = true;
                        if (!this.orbitControl.enabled) this.orbitControl.enabled = true;
                    }, this);

                }
                break;
            
        }

    }

    private updateGalaxyCenterSprite() {
        let cameraPolarAngle = this.orbitControl.getPolarAngle();

        if (this.galaxyCenterSprite) {
            // debugger;
            // console.log(`polarAngle: ${polarAngle}`);
            const scMin = 0.1;
            let anFactor = scMin + (1 - scMin) * (1 - (cameraPolarAngle / (Math.PI / 2)));
            if (cameraPolarAngle > Math.PI / 2) {
                anFactor = scMin + (1 - scMin) * (1 - (Math.abs(cameraPolarAngle - Math.PI) / (Math.PI / 2)));
            }
            this.galaxyCenterSprite.scale.y = Settings.GALAXY_CENTER_SCALE * anFactor;

            // LogMng.debug(`galaxyCenterSprite.scale.y: ${this.galaxyCenterSprite.scale.y}`);
        }

        if (this.galaxyCenterSprite2) {
            // debugger;
            // console.log(`polarAngle: ${polarAngle}`);
            const scMin = 0.3;
            let anFactor = scMin + (1 - scMin) * (1 - (cameraPolarAngle / (Math.PI / 2)));
            if (cameraPolarAngle > Math.PI / 2) {
                anFactor = scMin + (1 - scMin) * (1 - (Math.abs(cameraPolarAngle - Math.PI) / (Math.PI / 2)));
            }
            this.galaxyCenterSprite2.scale.y = Settings.GALAXY_CENTER_SCALE_2 * anFactor;

            // LogMng.debug(`galaxyCenterSprite2.scale.y: ${this.galaxyCenterSprite2.scale.y}`);
        }
    }

    private saveState() {
        function download(content, fileName, contentType) {
            var a = document.createElement("a");
            var file = new Blob([content], { type: contentType });
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
        }
        
        let saveData = {
            galaxyStarsData: this.galaxyStarsData,
            galaxyBlinkStarsData: this.blinkStarsData,
            farGalaxiesData: this.farGalaxiesData

        };

        let jsonData = JSON.stringify(saveData);
        
        // var fs = require('fs');
        // fs.writeFile("test.json", jsonData, (err) => {
        //     if (err) {
        //         console.log(err);
        //     }
        // });

        download(jsonData, 'galaxyState.json', 'text/plain');
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
        const cameraPolarAngle = this.orbitControl.getPolarAngle();
        // angle from main plane
        const an = cameraPolarAngle < Math.PI / 2 ?
            cameraPolarAngle :
            Math.abs(cameraPolarAngle - Math.PI);
        return an;
    }

    private updateGalaxyPlane(dt: number) {
        const an = this.getAbsPolarAngle();
        const MIN_ALPHA = 0.0;
        let galaxyOpacity = MIN_ALPHA + (1 - (an / (Math.PI / 2))) * (1 - MIN_ALPHA);
        this.galaxyPlane.material['opacity'] = galaxyOpacity;
    }

    private updateGalaxyStars(dt: number) {
        const an = this.getAbsPolarAngle();
        const MIN_ALPHA = 0.3;
        let starsOpacity = MIN_ALPHA + (1 - (an / (Math.PI / 2))) * (1 - MIN_ALPHA);
        this.starsParticles.alphaFactor = starsOpacity * this._starAlphaFactor;
        this.starsParticles.update(dt);
        this.blinkStarsParticles.update(dt);

    }

    private updateFarStars(dt: number) {
        let cameraAzimutAngle = this.orbitControl.getAzimuthalAngle();
        let cameraPolarAngle = this.orbitControl.getPolarAngle();
        this.farStars.azimutAngle = cameraAzimutAngle;
        this.farStars.polarAngle = cameraPolarAngle;
        this.farStars.update(dt);
    }

    private updateSmallGalaxies(dt: number) {
        for (let i = 0; i < this.smallGalaxies.length; i++) {
            const g = this.smallGalaxies[i];
            if (g) g.rotateZ(g['rotSpeed'] * dt);
        }
    }

    private updateRotationSound(dt: number) {
        const minDelta = 0.001;
        let cameraAzimutAngle = this.orbitControl.getAzimuthalAngle();
        let cameraPolarAngle = this.orbitControl.getPolarAngle();
        let azDelta = Math.abs(this.orbitControl.getAzimuthalAngle() - this.prevCameraAzimutAngle);
        let polDelta = Math.abs(this.orbitControl.getPolarAngle() - this.prevCamPolarAngle);

        let isRotate = this.orbitControl.isRotate() && (azDelta > minDelta || polDelta > minDelta);
        
        if (isRotate) {
            
            // this.rotSndStartTimer -= dt;
            if (this.rotSndStartTimer < 0) {
                let snd = AudioMng.getInstance().getSound(AudioData.SFX_CAM_ROTATE);
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
            this.rotSndStartTimer = 0.02;
            let snd = AudioMng.getInstance().getSound(AudioData.SFX_CAM_ROTATE);
            if (snd.isPlaying) {
                snd.stop();
            }
        }

        this.rotSndStartTimer -= dt;
        this.prevCameraAzimutAngle = cameraAzimutAngle;
        this.prevCamPolarAngle = cameraPolarAngle;
    }

    private updateStarPoints() {
        for (let i = 0; i < this.starPointSprites.length; i++) {
            const point = this.starPointSprites[i];
            point.update();
        }
    }

    // STATES
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    private onStateInitEnter() {

        this.isStarPreviewState = false;

        this.orbitControl.enabled = false;
        this.camera.position.set(-90 * 4, 0, 180 * 4);
        this.camera.lookAt(this.cameraTarget);
        gsap.to(this.camera.position, {
            x: -90,
            y: 60,
            z: 180,
            duration: 3,
            // delay: 0.1,
            ease: 'sine.inOut',
            onComplete: () => {
                this.fsm.startState(States.galaxy)
            }
        });

    }

    private onStateInitUpdate(dt: number) {

        this.orbitControl.update();

        if (this.cameraTarget && this.camera) {
            this.camera.lookAt(this.cameraTarget);
        }

        this.updateGalaxyPlane(dt);
        this.updateGalaxyCenterSprite();
        this.updateGalaxyStars(dt);
        this.updateFarStars(dt);
        this.updateSmallGalaxies(dt);
        this.updateStarPoints();

    }

    private onStateGalaxyEnter() {
        this.prevCameraAzimutAngle = this.orbitControl.getAzimuthalAngle();
        this.prevCamPolarAngle = this.orbitControl.getPolarAngle();
        this.orbitControl.update();
        this.orbitControl.autoRotate = true;
        this.orbitControl.enableZoom = true;
        this.orbitControl.enabled = true;

    }
    
    private onStateGalaxyUpdate(dt: number) {

        this.orbitControl.update();

        if (this.cameraTarget && this.camera) {
            this.camera.lookAt(this.cameraTarget);
        }

        this.updateGalaxyPlane(dt);
        this.updateGalaxyCenterSprite();
        this.updateGalaxyStars(dt);
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

    private onStateToStarEnter(aParams: any) {

        const LOOK_DUR = 2;
        const DUR = 3;

        this.currentStarId = aParams.starId;
        
        this.orbitControl.enabled = false;
        document.body.style.cursor = 'default';

        let systemData = SOLAR_SYSTEMS_DATA[aParams.starId];

        let starPos = new THREE.Vector3(
            systemData.positionInGalaxy.x,
            systemData.positionInGalaxy.y,
            systemData.positionInGalaxy.z
        );

        // create Solar System

        let starScale = 1;

        this.solarSystem = new SolarSystem(
            this.camera,
            starScale,
            {
                starParams: systemData.starParams
            }
        );

        this.solarSystem.position.copy(starPos);
        this.solarSystem.scale.set(0, 0, 0);
        this.solarSystem.visible = false;
        this.scene.add(this.solarSystem);

        // this.solarSystemBlinkStarsParticles.position.set(0, 0, 0);
        this.solarSystemBlinkStarsParticles.position.copy(starPos);
        this.solarSystemBlinkStarsParticles.scale.set(0.1, 0.1, 0.1);
        // this.solarSystem.add(this.solarSystemBlinkStarsParticles);
        this.scene.add(this.solarSystemBlinkStarsParticles);
        this.solarSystemBlinkStarsParticles.visible = false;
        this.solarSystemBlinkStarsParticles.alphaFactor = 0;

        gsap.to(this.solarSystemBlinkStarsParticles.scale, {
            x: 1,
            y: 1,
            z: 1,
            delay: DUR * 2 / 10,
            duration: DUR,
            ease: 'sine.inOut',
            onStart: () => {
                this.solarSystemBlinkStarsParticles.visible = true;
            }
        });
        gsap.to(this.solarSystemBlinkStarsParticles, {
            alphaFactor: 1,
            delay: DUR * 6 / 10,
            duration: DUR * .8,
            ease: 'sine.inOut'
        });

        // crete a small sprite of star in the galaxy
        let sunClr = systemData.starParams.sunClr1;
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
        let sc = 20;
        this.bigStarSprite.scale.set(sc, sc, sc);
        this.bigStarSprite.position.copy(starPos);
        this.scene.add(this.bigStarSprite);

        gsap.to([this.bigStarSprite.scale], {
            x: 100,
            y: 100,
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
        for (let i = 0; i < this.starPointSprites.length; i++) {
            this.starPointSprites[i].hide(DUR / 10);
        }
        
        // hide galaxy plane
        this.galaxySaveAnimData.galaxyPlaneOpacity = this.galaxyPlane.material['opacity'];
        gsap.to(this.galaxyPlane.material, {
            opacity: 0,
            duration: DUR / 1.5,
            ease: 'sine.in',
            onComplete: () => {
                this.galaxyPlane.visible = false;
            }
        });

        // change galo
        this.galaxySaveAnimData.galaxyCenter1Opacity = this.galaxyCenterSprite.material['opacity'];
        this.galaxySaveAnimData.galaxyCenter2Opacity = this.galaxyCenterSprite2.material['opacity'];
        gsap.to([this.galaxyCenterSprite.material, this.galaxyCenterSprite2.material], {
            opacity: 0.2,
            duration: DUR,
            ease: 'sine.in'
        });
        this.galaxySaveAnimData.galaxyCenter1Scale = this.galaxyCenterSprite.scale.clone();
        this.galaxySaveAnimData.galaxyCenter2Scale = this.galaxyCenterSprite2.scale.clone();
        gsap.to([this.galaxyCenterSprite.scale, this.galaxyCenterSprite2.scale], {
            x: Settings.GALAXY_CENTER_SCALE * 0.5,
            y: Settings.GALAXY_CENTER_SCALE * 0.1,
            duration: DUR,
            ease: 'sine.in'
        });

        // show galaxyCenterPlane
        this.galaxyCenterPlane.lookAt(starPos);
        gsap.to([this.galaxyCenterPlane.material], {
            opacity: 1,
            duration: DUR,
            ease: 'sine.in',
            onStart: () => {
                this.galaxyCenterPlane.visible = true;
            }
        });
        gsap.to([this.galaxyCenterPlane.scale], {
            x: Settings.GALAXY_CENTER_SCALE * 1.5,
            y: Settings.GALAXY_CENTER_SCALE * 0.1,
            duration: DUR,
            ease: 'sine.in',
            onStart: () => {
                this.galaxyCenterPlane.visible = true;
            }
        });

        // move camera target to center of Solar System
        gsap.to(this.cameraTarget, {
            x: systemData.positionInGalaxy.x,
            y: systemData.positionInGalaxy.y,
            z: systemData.positionInGalaxy.z,
            duration: DUR / 2,
            ease: 'sine.inOut',
            onUpdate: () => {
                this.orbitCenter.copy(this.cameraTarget);
            }
        });

        this.galaxySaveAnimData.cameraPosition = this.camera.position.clone();

        // move camera

        let distance = 30;
        // let aspect = window.visualViewport.width / window.visualViewport.height;
        // let factor = DeviceInfo.getInstance().desktop ? 1 : 1.1;
        // let inh = window.innerHeight;
        // let outh = window.outerHeight;
        // let rSize = new THREE.Vector2();
        // rSize = this.render.getSize(rSize);
        // let rh = rSize.y;
        // alert(`inner height: ${inh}`);
        // alert(`outer height: ${outh}`);
        // alert(`rh: ${rh}`);

        let h = GameUtils.getClientHeight();
        if (!DeviceInfo.getInstance().desktop) {
            if (!document.fullscreenElement) {
                h = window.innerHeight + 104;
            }
        } 
        
        let aspect = GameUtils.getClientWidth() / h;
        let guiScaleByW = this.guiGetScaleBigStarTooltipByWidth();
        let d = innerHeight / (20 * aspect);
        let starDist = d * (0.6 / guiScaleByW);

        // LogMng.debug(`guiScaleByWidth: ${guiScaleByW}`);
        // LogMng.debug(`asRat: ${aspect}`);
        // LogMng.debug(`d: ${d}`);
        // LogMng.debug(`-----> starDist: ${starDist}`);

        let newCameraPos = this.camera.position.clone().sub(starPos).normalize().
            multiplyScalar(starDist).add(starPos);
        
        gsap.to(this.camera.position, {
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
            s: 100,
            duration: DUR,
            ease: 'sine.in',
            onUpdate: () => {
                this.dummyGalaxy.scale.set(tObj.s, tObj.s, tObj.s);
                this.dummyGalaxy.position.copy(starPos.clone().add(gVec.clone().multiplyScalar(tObj.s)));
            }
        });

        // scale down small galaxies
        for (let i = 0; i < this.smallGalaxies.length; i++) {
            const galaxy = this.smallGalaxies[i];
            gsap.to(galaxy.scale, {
                x: 0.01,
                y: 0.01,
                z: 0.01,
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
                this.fsm.startState(States.star);
            }
        });

        this.smallFlySystem.activeSpawn = false;

        AudioMng.getInstance().playSfx(AudioData.SFX_DIVE_IN);

        setTimeout(() => {
            let starSnd = AudioMng.getInstance().getSound(AudioData.SFX_STAR_FIRE);
            starSnd.loop = true;
            starSnd.volume = AudioMng.getInstance().sfxVolume;
            starSnd.play();
        }, 1000 * DUR / 2);

    }

    private onStateToStarUpdate(dt: number) {

        this.orbitControl.update();

        if (this.cameraTarget && this.camera) {
            this.camera.lookAt(this.cameraTarget);
        }

        this.updateFarStars(dt);
        this.updateSmallGalaxies(dt);

        if (this.solarSystem) this.solarSystem.update(dt);

        if (this.solarSystemBlinkStarsParticles?.visible) this.solarSystemBlinkStarsParticles.update(dt);

        this.smallFlySystem.update(dt);

    }

    private onStateStarEnter() {

        this.orbitControl.autoRotate = false;
        this.orbitControl.enableZoom = false;
        this.orbitControl.enabled = true;

        let starData = SOLAR_SYSTEMS_DATA[this.currentStarId];

        let guiScale = this.guiGetScaleBigStarTooltip(); 

        GameEvents.dispatchEvent(GameEvents.EVENT_SHOW_STAR_GUI, {
            name: starData.name,
            description: starData.description,
            level: starData.level,
            race: RACES[starData.raceId],
            planetsSlots: starData.planetsSlots,
            energy: starData.energy,
            life: starData.life,
            scale: guiScale
        });

    }

    private onStateStarUpdate(dt: number) {

        this.orbitControl.update();

        if (this.cameraTarget && this.camera) {
            this.camera.lookAt(this.cameraTarget);
        }

        this.updateSmallGalaxies(dt);
        this.updateRotationSound(dt);

        if (this.solarSystem) this.solarSystem.update(dt);

        if (this.solarSystemBlinkStarsParticles?.visible) this.solarSystemBlinkStarsParticles.update(dt);

        this.smallFlySystem.update(dt);
    }

    private onStateFromStarEnter() {

        const DUR = 3;

        this.orbitControl.enabled = false;

        let starPos = this.solarSystem.position.clone();

        // show galaxy main sprite
        gsap.to(this.galaxyPlane.material, {
            opacity: this.galaxySaveAnimData.galaxyPlaneOpacity,
            duration: DUR * 2 / 3,
            delay: DUR * 1 / 3,
            ease: 'sine.Out',
            onStart: () => {
                this.galaxyPlane.visible = true;
            }
        });

        // show star point sprite
        for (let i = 0; i < this.starPointSprites.length; i++) {
            this.starPointSprites[i].show(DUR * 0.1, DUR * 0.9);
        }

        // change galo
        gsap.to([this.galaxyCenterSprite.material], {
            opacity: this.galaxySaveAnimData.galaxyCenter1Opacity,
            duration: DUR,
            ease: 'sine.Out'
        });
        gsap.to([this.galaxyCenterSprite2.material], {
            opacity: this.galaxySaveAnimData.galaxyCenter2Opacity,
            duration: DUR,
            ease: 'sine.Out'
        });
        // galaxyCenter1Scale
        gsap.to([this.galaxyCenterSprite.scale], {
            x: this.galaxySaveAnimData.galaxyCenter1Scale.x,
            y: this.galaxySaveAnimData.galaxyCenter1Scale.y,
            duration: DUR,
            ease: 'sine.in'
        });
        gsap.to([this.galaxyCenterSprite2.scale], {
            x: this.galaxySaveAnimData.galaxyCenter2Scale.x,
            y: this.galaxySaveAnimData.galaxyCenter2Scale.y,
            duration: DUR,
            ease: 'sine.in'
        });
        
        // hide galaxyCenterPlane
        gsap.to([this.galaxyCenterPlane.material], {
            opacity: 0,
            duration: DUR,
            ease: 'sine.Out',
            onComplete: () => {
                this.galaxyCenterPlane.visible = false;
            }
        });

        // move camera target to center of Galaxy
        gsap.to(this.cameraTarget, {
            x: 0,
            y: 0,
            z: 0,
            duration: DUR,
            ease: 'sine.inOut',
            onUpdate: () => {
                this.orbitCenter.copy(this.cameraTarget);
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
                this.dummyGalaxy.scale.set(tObj.s, tObj.s, tObj.s);
                this.dummyGalaxy.position.copy(starPos.clone().add(gVec.clone().multiplyScalar(tObj.s)));
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
                this.scene.remove(this.bigStarSprite);
                this.bigStarSprite = null;
            }
        });

        // scale down small galaxies
        for (let i = 0; i < this.smallGalaxies.length; i++) {
            const galaxy = this.smallGalaxies[i];
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
                this.scene.remove(this.solarSystem);
                this.solarSystem = null;
            }
        });

        // hide star blink stars
        gsap.to(this.solarSystemBlinkStarsParticles, {
            alphaFactor: 0,
            duration: DUR * 4 / 10,
            ease: 'sine.in'
        });

        // move camera
        gsap.to(this.camera.position, {
            x: this.galaxySaveAnimData.cameraPosition.x,
            y: this.galaxySaveAnimData.cameraPosition.y,
            z: this.galaxySaveAnimData.cameraPosition.z,
            duration: DUR,
            ease: 'sine.inOut',
            onComplete: () => {
                this.fsm.startState(States.galaxy);
            }
        });

        this.smallFlySystem.activeSpawn = true;

        AudioMng.getInstance().playSfx(AudioData.SFX_DIVE_OUT);
        
        setTimeout(() => {
            AudioMng.getInstance().getSound(AudioData.SFX_STAR_FIRE).stop();
        }, 1000 * DUR / 3);

    }
    
    private onStateFromStarUpdate(dt: number) {
        this.orbitControl.update();

        if (this.cameraTarget && this.camera) {
            this.camera.lookAt(this.cameraTarget);
        }

        this.updateFarStars(dt);
        this.updateSmallGalaxies(dt);

        if (this.solarSystem) this.solarSystem.update(dt);

        if (this.solarSystemBlinkStarsParticles?.visible) this.solarSystemBlinkStarsParticles.update(dt);

        this.smallFlySystem.update(dt);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////


    /**
     * 
     * @param dt in sec
     */
    update(dt: number) {

        this.fsm.update(dt);


    }

}