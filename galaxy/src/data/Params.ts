import * as datGui from "dat.gui";

// global game params
export class Params {
    static isDebugMode = false;
    static domCanvasParent: HTMLElement = null;
    static domTouchParent: HTMLElement = null;
    static domGuiParent: HTMLElement = null;
    static domRenderer: HTMLElement = null;
    static assetsPath = './assets/';

    // utils
    static datGui: datGui.GUI;

    // galaxy default data and varaibled
    static galaxyData = {
        starsCount: 3000,
        blinkStarsCount: 1000,
        blinkDurMin: 1,
        blinkDurMax: 2,
        startAngle: 0.7,
        endAngle: 3.6,
        startOffsetXY: 2.2,
        endOffsetXY: 0.8,
        startOffsetH: 4,
        endOffsetH: 1,
        k: 0.3,
        alphaMin: 1,
        alphaMax: 1,
        scaleMin: 1,
        scaleMax: 1
    };

    static skyData = {
        starsCount: 500,
        radiusMin: 30,
        radiusMax: 1000,
        scaleMin: 3,
        scaleMax: 30,
        starSize: 1.5,
        starAlpha: 0.8,

        galaxiesCount: 5,
        galaxiesSizeMin: 1000,
        galaxiesSizeMax: 2000
    };

    // game
    static isCameraAutoRotate = false;
    static cameraAutoRotateSpeed = -0.05;

    // debug
    static debugAxeHelperOn = false;
    
};
