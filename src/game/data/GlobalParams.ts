
export type GalaxyData = {
    starsCount: number;
    blinkStarsCount: number;
    blinkDurMin: number;
    blinkDurMax: number;
    startAngle: number;
    endAngle: number;
    startOffsetXY: number;
    endOffsetXY: number;
    startOffsetH: number;
    endOffsetH: number;
    k: number;
    alphaMin: number;
    alphaMax: number;
    scaleMin: number;
    scaleMax: number;
    starAlphaFactor: number;
    cameraDistAlpha: {
        min: number;
        max: number;
        factor: number;
    },
    camDistMin: number;
    camDistMax: number;
}

/**
 * Global parameters
 */
export class GlobalParams {

    static version = 'v0.3.410';
    static isDebugMode = false;
    static domCanvasParent: HTMLElement = null;
    static domTouchParent: HTMLElement = null;
    static domGuiParent: HTMLElement = null;
    static domRenderer: HTMLElement = null;
    static assetsPath = './assets/';

    // galaxy default data and varaibled
    static galaxyData: GalaxyData = {

        starsCount: 21000,
        blinkStarsCount: 2000,
        blinkDurMin: 1,
        blinkDurMax: 2,
        startAngle: 0.1,
        endAngle: 3.6,

        startOffsetXY: 5,
        endOffsetXY: 0.4,

        startOffsetH: 6,
        endOffsetH: 1,

        k: 0.3,
        alphaMin: 1,
        alphaMax: 1,
        scaleMin: .5,
        scaleMax: 1.1,

        starAlphaFactor: .8,
        cameraDistAlpha: {
            min: 100,
            max: 500,
            factor: .6
        },

        camDistMin: 2,
        camDistMax: 300
    };

    static skyData = {
        starsCount: 2000,
        radiusMin: 200,
        radiusMax: 1000,
        scaleMin: 8,
        scaleMax: 10,
        starSize: 1.5,
        starAlpha: 0.5,

        galaxiesCount: 5,
        galaxiesSizeMin: 1000,
        galaxiesSizeMax: 2000
    };

    // game
    static loadFromFile = true;
    static isCameraAutoRotate = false;
    static cameraAutoRotateSpeed = -0.05;
    static isFakeStarLevels = true;
    static isGridPlane = false;

    static INIT_FULL_SCREEN = false;

    static USE_DEVICE_PIXEL_RATIO = true;
    static BG_COLOR = 0x333333;

    // SKYBOX_PATH: 'textures/skybox/lightblue/1024/',
    // FOG_TYPE: 0, // 0 - 'fog', 1 - 'exp'
    static AA_TYPE = 1; // 0 - none, 1 - FXAA, 2 - SMAA

    static CAMERA = {
        near: 1,
        far: 20000
    };
    static CAM_DAMPING_FACTOR = 0.025;

    // SKY_BOX_SIZE: 8000,

    static SMALL_GALAXIES_SPRITE_COUNT = 5;
    static FAR_GALAXIES_RADIUS_MIN = 3000;
    static FAR_GALAXIES_RADIUS_MAX = 5000;

    static GALAXY_CENTER_COLOR = 0xd3ccff;
    static GALAXY_CENTER_SCALE = 150;
    static GALAXY_CENTER_SCALE_2 = 150 * 0.8;

    static USE_BLINK_STARS = false;
    static STAR_CLICK_POINTS = true;
    static POINTS_CAMERA_MAX_DIST = 100;
    static POINTS_MAX_CHECK_RADIUS = 10;

    // battle
    static duelChecked = false;
    static BATTLE = {
        // serverAddr: wsServerUrl,
        serverAddr: 'https://staging-api.vorpal.finance',
        localConnect: false,
        freeConnect: false,
        // duelNumber: -1
    };

    // audio
    static AUDIO = {
        defaultMusicVolume: .3,
        defaultSfxVolume: .3
    };

    // debug
    static debugAxeHelperOn = false;
    
};
