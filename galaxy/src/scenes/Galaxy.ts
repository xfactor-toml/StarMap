import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { ThreeLoader } from '../loaders/ThreeLoader';
import { MyMath } from '../utils/MyMath';
import { LogMng } from '../utils/LogMng';
import { sound } from '@pixi/sound';
import gsap from 'gsap';
import { Params } from '../data/Params';
import { Config } from '../data/Config';
import { FarStars } from '../objects/FarStars';
import { GalaxyStars } from '../objects/GalaxyStars';
import { GlobalEvents } from '../events/GlobalEvents';
import { DeviceInfo } from '../utils/DeviceInfo';
import { InputMng } from '../inputs/InputMng';
import { FSM } from '../states/FSM';
import { States } from '../states/States';
import { SolarSystem } from '../objects/SolarSystem';

const SOLAR_SYSTEMS_DATA = [

    {
        name: "Star1",
        positionInGalaxy: {
            x: 40, y: 0, z: 100
        },
        starSize: 100
    },

];

const STARS_COLORS = [
    [0.505, 0.39, 0.3],
    [0.258, 0.282, 0.145],
    [0.694, 0.301, 0.282],
    [0.745, 0.635, 0.360],
    [0.431, 0.831, 0.819],
    [1.0, 0.901, 0.890]
];

const STARS_COLORS_2 = [
    // orange
    // [0.505 * 255, 0.39 * 255, 0.3 * 255],
    // green
    // [0.258 * 255, 0.282 * 255, 0.145 * 255],
    // red
    // [0.694 * 255, 0.301 * 255, 0.282 * 255],
    // yellow
    // [0.745 * 255, 0.635 * 255, 0.360 * 255],
    // teal
    [0.431, 0.831, 0.819],
    [0.431, 0.831, 0.819],
    // violet
    [0xb3 / 255, 0x8d / 255, 0xf9 / 255],
    [0xb3 / 255, 0x8d / 255, 0xf9 / 255],
    [0xb3 / 255, 0x8d / 255, 0xf9 / 255],
    [0xb3 / 255, 0x8d / 255, 0xf9 / 255],
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

    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;

    private cameraTarget: THREE.Vector3;
    private orbitCenter: THREE.Vector3;

    private dummyGalaxy: THREE.Group;

    private galaxyPlane: THREE.Mesh;
    private sprGalaxyCenter: THREE.Sprite;
    private sprGalaxyCenter2: THREE.Sprite;

    private galaxyStarsData: GalaxyStarParams[];
    // private galaxyStarSprites: THREE.Sprite[];
    private starsParticles: GalaxyStars;

    private blinkStarsData: GalaxyStarParams[];
    // private blinkStars: THREE.Sprite[];
    private blinkStarsParticles: GalaxyStars;

    private farStars: FarStars;

    private farGalaxiesData: FarGalaxyParams[];
    private smallGalaxies: THREE.Mesh[];

    private orbitControl: OrbitControls;

    private axiesHelper: THREE.AxesHelper;

    private raycaster: THREE.Raycaster;
    private checkMousePointerTimer = 0;
    private starPointHovered: THREE.Sprite;

    private solarSystem: SolarSystem;


    constructor(aParams: any) {
        this.scene = aParams.scene;
        this.camera = aParams.camera;
        this.cameraTarget = new THREE.Vector3();
        this.orbitCenter = new THREE.Vector3();
    }

    public set centerVisible(v: boolean) {
        this.sprGalaxyCenter.visible = v;
        this.sprGalaxyCenter2.visible = v;
    }

    init() {

        this.dummyGalaxy = new THREE.Group();
        this.scene.add(this.dummyGalaxy);

        this.camera.position.set(-90, 120, 180);

        this.createSkybox2();

        this.createSmallGalaxies(true);

        // main galaxy sprite
        this.galaxyPlane = this.createGalaxyPlane();
        this.dummyGalaxy.add(this.galaxyPlane);

        // galaxy center sprite
        this.sprGalaxyCenter = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: ThreeLoader.getInstance().getTexture('sun_01'),
                color: 0xFFCCCC,
                transparent: true,
                opacity: 1,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            })
        );
        this.sprGalaxyCenter.scale.set(Config.GALAXY_CENTER_SCALE, Config.GALAXY_CENTER_SCALE, Config.GALAXY_CENTER_SCALE);
        this.sprGalaxyCenter.renderOrder = 999;
        this.dummyGalaxy.add(this.sprGalaxyCenter);

        this.sprGalaxyCenter2 = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: ThreeLoader.getInstance().getTexture('sun_romb'),
                color: 0xFFCCCC,
                transparent: true,
                opacity: 1,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            })
        );
        this.sprGalaxyCenter2.scale.set(Config.GALAXY_CENTER_SCALE_2, Config.GALAXY_CENTER_SCALE_2, Config.GALAXY_CENTER_SCALE_2);
        this.sprGalaxyCenter2.renderOrder = 999;
        this.dummyGalaxy.add(this.sprGalaxyCenter2);


        this.createGalaxyStars(true);

        // OUT STARS
        this.createFarStars();

        // PLANETS
        this.createStarPoints();

        // camera controls
        let minCameraDistance = 50;
        let maxCameraDistance = 500;
        if (!DeviceInfo.getInstance().desktop) maxCameraDistance = 1000;
        this.createCameraControls({
            minDist: minCameraDistance,
            maxDist: maxCameraDistance,
            stopAngleTop: 10,
            stopAngleBot: 170,
            // pos: { x: 0, y: 0, z: 0 }
        });

        this.raycaster = new THREE.Raycaster();

        // pixi music
        sound.add('music', './assets/audio/vorpal-12.mp3');
        sound.play('music');

        // helpers
        if (Params.isDebugMode) {
            this.axiesHelper = new THREE.AxesHelper(200);
            this.scene.add(this.axiesHelper);
        }

        // document.addEventListener('pointermove', onMouseMove);
        // document.addEventListener('click', onMouseClick);
        // document.addEventListener('keydown', onKeyPress);

        // inputs
        let inputMng = InputMng.getInstance();
        inputMng.onInputDownSignal.add(this.onInputDown, this);
        inputMng.onInputUpSignal.add(this.onInputUp, this);

        this.fsm = new FSM();
        this.fsm.addState(States.GALAXY, this, this.onGalaxyEnter, this.onGalaxyUpdate);
        this.fsm.addState(States.TO_STAR, this, this.onToStarEnter, this.onToStarUpdate);
        this.fsm.addState(States.STAR, this, this.onStarEnter, this.onStarUpdate);
        this.fsm.addState(States.FROM_STAR, this, this.onFromStarEnter, this.onFromStarUpdate);
        this.fsm.startState(States.GALAXY);

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
            showSpheres: false,
            axiesHelper: false
        };

        const gui = Params.datGui;

        let galaxyFolder = gui.addFolder('Galaxy');

        galaxyFolder.add(Params.galaxyData, 'starsCount', 0, 10000, 100).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'blinkStarsCount', 0, 5000, 100).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'blinkDurMin', 0.1, 10, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'blinkDurMax', 1, 20, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'startAngle', 0, 2, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'endAngle', 0, Math.PI * 2, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'startOffsetXY', 0, 3, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'endOffsetXY', 0, 3, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'startOffsetH', 0, 10, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'endOffsetH', 0, 10, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'alphaMin', 0, 1, 0.02).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'alphaMax', 0, 1, 0.02).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'scaleMin', 0.5, 4, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'scaleMax', 0.5, 4, 0.1).onChange(() => { this.createGalaxyStars(); });
        //galaxyFolder.add(Params.galaxyData, 'k', 0, 1, 0.02).onChange(() => { this.createGalaxyStars(); });
        // galaxyFolder.add(Params.galaxyData, 'isNewMethod').onChange(() => { this.createGalaxyStars(); });

        galaxyFolder.add(DEBUG_PARAMS, 'center visible', true).onChange((value) => {
            this.centerVisible = value;
        });

        galaxyFolder.add(DEBUG_PARAMS, 'recreate');

        let skyFolder = gui.addFolder('Sky');

        skyFolder.add(Params.skyData, 'starsCount', 0, 2000, 10).onChange(() => { this.createFarStars(); });
        skyFolder.add(Params.skyData, 'radiusMin', 0, 500, 5).onChange(() => {
            this.createFarStars();
            if (DEBUG_PARAMS.showSpheres === true) this.createFarStarsMinSphere();
        });
        skyFolder.add(Params.skyData, 'radiusMax', 10, 2000, 10).onChange(() => {
            this.createFarStars();
            if (DEBUG_PARAMS.showSpheres === true) this.createFarStarsMaxSphere();
        });
        skyFolder.add(DEBUG_PARAMS, 'showSpheres').onChange((v: boolean) => {
            if (v) {
                this.createFarStarsMinSphere();
                this.createFarStarsMaxSphere();
            }
            else {
                if (debugObjects.farStarsSphereMin) debugObjects.farStarsSphereMin.visible = false;
                if (debugObjects.farStarsSphereMax) debugObjects.farStarsSphereMax.visible = false;
            }
        });
        skyFolder.add(Params.skyData, 'scaleMin', 0.1, 10, 0.1).onChange(() => { if (this.farStars) this.farStars.updateUniformValues(); });
        skyFolder.add(Params.skyData, 'scaleMax', 1, 50, 1).onChange(() => { if (this.farStars) this.farStars.updateUniformValues(); });
        skyFolder.add(Params.skyData, 'starSize', 0.1, 10, 0.1).onChange(() => { if (this.farStars) this.farStars.updateUniformValues(); });
        skyFolder.add(Params.skyData, 'starAlpha', 0, 1, 0.1).onChange(() => { if (this.farStars) this.farStars.updateUniformValues(); });
        skyFolder.add(Params.skyData, 'galaxiesCount', 0, 100, 1).onChange(() => { this.createSmallGalaxies(); });
        skyFolder.add(Params.skyData, 'galaxiesSizeMin', 100, 5000, 10).onChange(() => { this.createSmallGalaxies(); });
        skyFolder.add(Params.skyData, 'galaxiesSizeMax', 100, 8000, 10).onChange(() => { this.createSmallGalaxies(); });
        skyFolder.add(DEBUG_PARAMS, 'recreateSmallGalaxies');

        // let starsFolder = gui.addFolder('Stars');

        gui.add(DEBUG_PARAMS, 'saveState');

        this.axiesHelper.visible = DEBUG_PARAMS.axiesHelper;
        gui.add(DEBUG_PARAMS, 'axiesHelper').onChange((v: boolean) => {
            this.axiesHelper.visible = v;
        });

        // galaxyFolder.open();
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
            this.galaxyStarsData = this.generateGalaxyStars({
                starsCount: Params.galaxyData.starsCount,
                startAngle: Params.galaxyData.startAngle,
                endAngle: Params.galaxyData.endAngle,
                startOffsetXY: Params.galaxyData.startOffsetXY,
                endOffsetXY: Params.galaxyData.endOffsetXY,
                startOffsetH: Params.galaxyData.startOffsetH,
                endOffsetH: Params.galaxyData.endOffsetH,
                k: Params.galaxyData.k,
                alphaMin: Params.galaxyData.alphaMin,
                alphaMax: Params.galaxyData.alphaMax,
                scaleMin: Params.galaxyData.scaleMin,
                scaleMax: Params.galaxyData.scaleMax
            }, 145, 145, STARS_COLORS);
        }

        // blink stars data generate
        if (aGalaxyBlinkStarsData) {
            this.blinkStarsData = aGalaxyBlinkStarsData;
        }
        else {
            this.blinkStarsData = this.generateGalaxyStars({
                starsCount: Params.galaxyData.blinkStarsCount,
                startAngle: Params.galaxyData.startAngle,
                endAngle: Params.galaxyData.endAngle,
                startOffsetXY: Params.galaxyData.startOffsetXY,
                endOffsetXY: Params.galaxyData.endOffsetXY,
                startOffsetH: Params.galaxyData.startOffsetH,
                endOffsetH: Params.galaxyData.endOffsetH,
                k: Params.galaxyData.k,
                alphaMin: Params.galaxyData.alphaMin,
                alphaMax: Params.galaxyData.alphaMax,
                scaleMin: Params.galaxyData.scaleMin,
                scaleMax: Params.galaxyData.scaleMax,
            },
                145, 145,
                STARS_COLORS,
                {
                    durationMin: Params.galaxyData.blinkDurMin,
                    durationMax: Params.galaxyData.blinkDurMax
                }
            );
        }

        // particle stars
        let t = ThreeLoader.getInstance().getTexture('star4');
        this.starsParticles = new GalaxyStars({
            starsData: this.galaxyStarsData,
            texture: t,
            onWindowResizeSignal: GlobalEvents.onWindowResizeSignal
        });

        this.dummyGalaxy.add(this.starsParticles);

        // blink particle stars
        this.blinkStarsParticles = new GalaxyStars({
            starsData: this.blinkStarsData,
            texture: t,
            onWindowResizeSignal: GlobalEvents.onWindowResizeSignal
        });

        this.dummyGalaxy.add(this.blinkStarsParticles);

    }

    private generateGalaxyStars(aParams: GalaxyParams, xScale: number, zScale: number, aColorSet: any[], aBlinkData?: any): GalaxyStarParams[] {

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

    // private createStarSprite(aSpriteAlias: string, aStarData: GalaxyStarParams): THREE.Sprite {
    //     let t = ThreeLoader.getInstance().getTexture(aSpriteAlias);

    //     let mat = new THREE.SpriteMaterial({
    //         map: t,
    //         color: new THREE.Color(aStarData.color.r, aStarData.color.g, aStarData.color.b),
    //         transparent: true,
    //         opacity: aStarData.color.a,
    //         depthWrite: false,
    //         depthTest: true,
    //         blending: THREE.AdditiveBlending
    //     });
    //     let sprite = new THREE.Sprite(mat);
    //     sprite.scale.set(aStarData.scale, aStarData.scale, aStarData.scale);
    //     sprite.position.set(aStarData.pos.x, aStarData.pos.y, aStarData.pos.z);
    //     return sprite;
    // }

    private destroyGalaxyStars() {
        // if (this.galaxyStarSprites)
        //     for (let i = this.galaxyStarSprites.length - 1; i >= 0; i--) {
        //         this.scene.remove(this.galaxyStarSprites[i]);
        //     }
        // this.galaxyStarSprites = [];

        // if (this.blinkStars)
        //     for (let i = this.blinkStars.length - 1; i >= 0; i--) {
        //         let spr = this.blinkStars[i];
        //         spr['stopBlinkAnimation'] = true;
        //         this.scene.remove(spr);
        //     }
        // this.blinkStars = [];

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
            starsCount: Params.skyData.starsCount,
            // radiusMin: Params.skyData.radiusMin,
            // radiusMax: Params.skyData.radiusMax
        });

        this.scene.add(this.farStars);

    }

    private createFarStarsMinSphere() {
        if (debugObjects.farStarsSphereMin) {
            this.scene.remove(debugObjects.farStarsSphereMin);
        }
        let geom = new THREE.SphereGeometry(Params.skyData.radiusMin, 10, 10);
        let mat = new THREE.MeshNormalMaterial({
            wireframe: true
        });
        debugObjects.farStarsSphereMin = new THREE.Mesh(geom, mat);
        this.scene.add(debugObjects.farStarsSphereMin);
    }

    private createFarStarsMaxSphere() {
        if (debugObjects.farStarsSphereMax) {
            this.scene.remove(debugObjects.farStarsSphereMax);
        }
        let geom = new THREE.SphereGeometry(Params.skyData.radiusMax, 20, 20);
        let mat = new THREE.MeshNormalMaterial({
            wireframe: true
        });
        debugObjects.farStarsSphereMax = new THREE.Mesh(geom, mat);
        this.scene.add(debugObjects.farStarsSphereMax);
    }

    private createStarPoints() {

        let loader = ThreeLoader.getInstance();

        for (let i = 0; i < SOLAR_SYSTEMS_DATA.length; i++) {
            const starData = SOLAR_SYSTEMS_DATA[i];

            let previewTexture = loader.getTexture('starPoint');
            let previewMaterial = new THREE.SpriteMaterial({
                map: previewTexture,
                transparent: true,
                opacity: 1,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });
            let starPointSprite = new THREE.Sprite(previewMaterial);

            starPointSprite.scale.set(12, 12, 12);
            starPointSprite.position.set(starData.positionInGalaxy.x, starData.positionInGalaxy.y, starData.positionInGalaxy.z);
            starPointSprite[`name`] = "starPoint";
            starPointSprite[`starId`] = i;
            // starPointSprite.renderOrder = 1;
            this.scene.add(starPointSprite);

        }

    }

    private createSkybox2() {
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

        const radius = MyMath.randomInRange(Config.FAR_GALAXIES_RADIUS_MIN, Config.FAR_GALAXIES_RADIUS_MAX);

        let res = [];
        let positions: THREE.Vector3[] = [];

        let ids = Array.from(Array(Config.SMALL_GALAXIES_SPRITE_COUNT - 1).keys());
        MyMath.shuffleArray(ids, 4);

        let galaxyCnt = Params.skyData.galaxiesCount;
        let k = 0;

        for (let i = 0; i < galaxyCnt; i++) {

            if (k >= ids.length) k = 0;
            let tNum = ids[k] + 1;
            k++;
            let tName = `galaxy_${tNum.toString().padStart(2, '0')}`;
            let size = MyMath.randomInRange(Params.skyData.galaxiesSizeMin, Params.skyData.galaxiesSizeMax);
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
        let domElement = Params.domCanvasParent;
        this.orbitControl = new OrbitControls(this.camera, domElement);
        // if (!aParams.noTarget) this.orbitControl.target = new THREE.Vector3();
        this.orbitControl.enabled = !(aParams.isOrbitLock == true);
        this.orbitControl.rotateSpeed = .5;
        this.orbitControl.enableDamping = true;
        this.orbitControl.dampingFactor = 0.025;
        this.orbitControl.zoomSpeed = aParams.zoomSpeed || 1;
        this.orbitControl.enablePan = aParams.enablePan == true;
        // this.camOrbitCtrl.keys = {};
        this.orbitControl.minDistance = aParams.minDist || 1;
        this.orbitControl.maxDistance = aParams.maxDist || 100;
        this.orbitControl.minPolarAngle = MyMath.toRadian(aParams.stopAngleTop || 0); // Math.PI / 2.5;
        // camOrbit.maxPolarAngle = Math.PI - an;
        this.orbitControl.maxPolarAngle = MyMath.toRadian(aParams.stopAngleBot || 0);
        // if (aParams.pos) {
        //     this.orbitControl.target.x = aParams.pos.x || 0;
        //     this.orbitControl.target.y = aParams.pos.y || 0;
        //     this.orbitControl.target.z = aParams.pos.z || 0;
        // }
        this.orbitControl.target = this.orbitCenter;
        this.orbitControl.update();
        this.orbitControl.addEventListener('change', () => {
        });
        this.orbitControl.addEventListener('end', () => {
        });

    }

    private updateInputMove() {

        let inMng = InputMng.getInstance();
        this.raycaster.setFromCamera(inMng.normalInputPos, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        let isHover = false;

        for (let i = 0; i < intersects.length; i++) {
            const obj = intersects[i].object;
            if (obj[`name`] == 'starPoint') {
                this.starPointHovered = obj as THREE.Sprite;
                isHover = true;
                break;
            }
        }

        if (!isHover) this.starPointHovered = null;

        document.body.style.cursor = isHover ? 'pointer' : 'default';
    }

    private onInputDown(x: number, y: number) {

    }

    private onInputUp(x: number, y: number) {
        let inMng = InputMng.getInstance();
        let dist = MyMath.getVectorLength(inMng.inputDownClientX, inMng.currInputClientY, inMng.currInputClientX, inMng.currInputClientY);
        if (dist > 20) return;
        
        switch (this.fsm.getCurrentState().name) {
            case States.GALAXY:
                if (this.starPointHovered) {
                    let starId = this.starPointHovered[`starId`]!;
                    this.fsm.startState(States.TO_STAR, { starId: starId });
                }
                break;
        }

    }

    private updateGalaxyCenter() {
        let cameraPolarAngle = this.orbitControl.getPolarAngle();

        if (this.sprGalaxyCenter) {
            // debugger;
            // console.log(`polarAngle: ${polarAngle}`);
            const scMin = 0.1;
            let anFactor = scMin + (1 - scMin) * (1 - (cameraPolarAngle / (Math.PI / 2)));
            if (cameraPolarAngle > Math.PI / 2) {
                anFactor = scMin + (1 - scMin) * (1 - (Math.abs(cameraPolarAngle - Math.PI) / (Math.PI / 2)));
            }
            this.sprGalaxyCenter.scale.y = Config.GALAXY_CENTER_SCALE * anFactor;
        }

        if (this.sprGalaxyCenter2) {
            // debugger;
            // console.log(`polarAngle: ${polarAngle}`);
            const scMin = 0.3;
            let anFactor = scMin + (1 - scMin) * (1 - (cameraPolarAngle / (Math.PI / 2)));
            if (cameraPolarAngle > Math.PI / 2) {
                anFactor = scMin + (1 - scMin) * (1 - (Math.abs(cameraPolarAngle - Math.PI) / (Math.PI / 2)));
            }
            this.sprGalaxyCenter2.scale.y = Config.GALAXY_CENTER_SCALE_2 * anFactor;
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


    // STATES
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    private onGalaxyEnter() {
        
    }

    private onGalaxyUpdate(dt: number) {

        this.orbitControl.update();

        if (this.cameraTarget && this.camera) {
            this.camera.lookAt(this.cameraTarget);
        }

        let cameraAzimutAngle = this.orbitControl.getAzimuthalAngle();
        let cameraPolarAngle = this.orbitControl.getPolarAngle();
        
        // opacity of the main galaxy plane
        if (this.galaxyPlane) {
            if (cameraPolarAngle < Math.PI / 2) {
                this.galaxyPlane.material['opacity'] = 0.1 + (1 - (cameraPolarAngle / (Math.PI / 2))) * 0.9;
            } else {
                this.galaxyPlane.material['opacity'] = 0.1 + (1 - (Math.abs(cameraPolarAngle - Math.PI) / (Math.PI / 2))) * 0.9;
            }
        }

        this.updateGalaxyCenter();

        if (this.blinkStarsParticles) this.blinkStarsParticles.update(dt);

        // far stars
        this.farStars.azimutAngle = cameraAzimutAngle;
        this.farStars.polarAngle = cameraPolarAngle;
        this.farStars.update(dt);

        // small galaxies
        for (let i = 0; i < this.smallGalaxies.length; i++) {
            const g = this.smallGalaxies[i];
            if (g) g.rotateZ(g['rotSpeed'] * dt);
        }

        this.checkMousePointerTimer -= dt;
        if (this.checkMousePointerTimer <= 0) {
            this.checkMousePointerTimer = 0.1;
            this.updateInputMove();
        }
    }

    private onToStarEnter(aParams: any) {

        const DUR = 4;
        
        this.orbitControl.enabled = false;
        document.body.style.cursor = 'default';

        let systemData = SOLAR_SYSTEMS_DATA[aParams.starId];

        this.solarSystem = new SolarSystem({
            camera: this.camera,
            starSize: systemData.starSize
        });

        let starPos = new THREE.Vector3(
            systemData.positionInGalaxy.x,
            systemData.positionInGalaxy.y,
            systemData.positionInGalaxy.z
        );

        this.solarSystem.position.copy(starPos);

        this.solarSystem.scale.set(0, 0, 0);
        this.solarSystem.visible = false;
        this.scene.add(this.solarSystem);

        // hide point sprite and galo
        gsap.to([this.starPointHovered.material, this.sprGalaxyCenter.material, this.sprGalaxyCenter2.material], {
            opacity: 0,
            duration: DUR / 2,
            ease: 'sine.in',
            onComplete: () => {
                this.starPointHovered.visible = false;
            }
        });

        // expand solar system
        gsap.to(this.solarSystem.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: DUR,
            delay: DUR / 1.5,
            ease: 'sine.Out',
            onStart: () => {
                this.solarSystem.visible = true;
            },
            onUpdate: () => {

            },
            onComplete: () => {
                this.fsm.startState(States.STAR);
            }
        });

        // move camera target to center of Solar System
        gsap.to(this.cameraTarget, {
            x: systemData.positionInGalaxy.x,
            y: systemData.positionInGalaxy.y,
            z: systemData.positionInGalaxy.z,
            duration: DUR,
            ease: 'sine.inOut',
            onUpdate: () => {
                this.orbitCenter.copy(this.cameraTarget);
            },
            onComplete: () => {

            }
        });

        // hide galaxy plane
        gsap.to(this.galaxyPlane.material, {
            opacity: 0,
            duration: DUR / 1.5,
            ease: 'sine.in',
            onComplete: () => {
                this.galaxyPlane.visible = false;
            }
        });

        let newCameraPos = this.camera.position.clone().sub(starPos).normalize().multiplyScalar(systemData.starSize * 2).add(starPos);

        gsap.to(this.camera.position, {
            x: newCameraPos.x,
            y: newCameraPos.y,
            z: newCameraPos.z,
            duration: DUR,
            ease: 'sine.inOut',
            onUpdate: () => {                
            },
            onComplete: () => {
            }
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
            },
            onComplete: () => {
            }
        });

    }

    private onToStarUpdate(dt: number) {

        this.orbitControl.update();

        if (this.cameraTarget && this.camera) {
            this.camera.lookAt(this.cameraTarget);
        }

        let cameraAzimutAngle = this.orbitControl.getAzimuthalAngle();
        let cameraPolarAngle = this.orbitControl.getPolarAngle();

        // this.updateGalaxyCenter();

        if (this.blinkStarsParticles) this.blinkStarsParticles.update(dt);

        // far stars
        this.farStars.azimutAngle = cameraAzimutAngle;
        this.farStars.polarAngle = cameraPolarAngle;
        this.farStars.update(dt);

        // small galaxies
        for (let i = 0; i < this.smallGalaxies.length; i++) {
            const g = this.smallGalaxies[i];
            if (g) g.rotateZ(g['rotSpeed'] * dt);
        }

        if (this.solarSystem) this.solarSystem.update(dt);
    }

    private onStarEnter() {
        this.orbitControl.enabled = true;
    }

    private onStarUpdate(dt: number) {

        this.orbitControl.update();

        if (this.cameraTarget && this.camera) {
            this.camera.lookAt(this.cameraTarget);
        }

        let cameraAzimutAngle = this.orbitControl.getAzimuthalAngle();
        let cameraPolarAngle = this.orbitControl.getPolarAngle();

        // this.updateGalaxyCenter();

        if (this.blinkStarsParticles) this.blinkStarsParticles.update(dt);

        // far stars
        this.farStars.azimutAngle = cameraAzimutAngle;
        this.farStars.polarAngle = cameraPolarAngle;
        this.farStars.update(dt);

        // small galaxies
        for (let i = 0; i < this.smallGalaxies.length; i++) {
            const g = this.smallGalaxies[i];
            if (g) g.rotateZ(g['rotSpeed'] * dt);
        }

        if (this.solarSystem) this.solarSystem.update(dt);
    }

    private onFromStarEnter() {

    }
    
    private onFromStarUpdate(dt: number) {
        
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