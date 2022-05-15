import * as datGui from "dat.gui";

// global game params
export class Params {
    static isDebugMode = false;
    static domCanvasParent = null;
    static assetsPath = './assets/';

    // utils
    static datGui: datGui.GUI;

    // data
    static galaxyData = {
        'stars count': 4000
    };

    // game
    static isCameraAutoRotate = false;
    static cameraAutoRotateSpeed = -0.05;

    // debug
    static debugAxeHelperOn = false;
    
};
