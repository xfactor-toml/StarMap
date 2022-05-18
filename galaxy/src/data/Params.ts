import * as datGui from "dat.gui";

// global game params
export class Params {
    static isDebugMode = false;
    static domCanvasParent = null;
    static assetsPath = './assets/';

    // utils
    static datGui: datGui.GUI;

    // galaxy default data and varaibled
    static galaxyData = {
        starsCount: 3000,
        blinkStarsCount: 500,
        startAngle: 0.7,
        endAngle: 3.6,
        startOffsetXY: 1.8,
        endOffsetXY: 0,
        startOffsetH: 4,
        endOffsetH: 0,
        k: 0.3,
        isNewMethod: false
    };

    static skyData = {
        starsCount: 500,
        // radius: 300,
        radiusMin: 30,
        radiusMax: 1000,
        scaleMin: 2,
        scaleMax: 20,
        starSize: 1,
        starAlpha: 0.8
    };

    // game
    static isCameraAutoRotate = false;
    static cameraAutoRotateSpeed = -0.05;

    // debug
    static debugAxeHelperOn = false;
    
};
