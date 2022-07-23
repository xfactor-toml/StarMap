import { Config } from "../data/Config";
import { Signal } from "../events/Signal";
import { LogMng } from "../utils/LogMng";
import { Preloader } from "./Preloader";
import * as MyUtils from "../utils/MyUtils";
import { Params } from "../data/Params";

type InitParams = {

};

export class GameBoot {
    private inited = false;
    private preloader: Preloader;
    onLoadProgressSignal = new Signal();
    onLoadCompleteSignal = new Signal();

    constructor() {
        Params.domCanvasParent = document.getElementById('game');
        Params.domGuiParent = document.getElementById('gui');
    }

    init(aParams?: InitParams) {
        if (this.inited) {
            LogMng.warn('GameBoot: game is already inited!');
            return;
        }
        this.inited = true;

        // Boot
        let anc = window.location.hash.replace("#", "");
        Params.isDebugMode = (anc === "debug");

        // LogMng settings
        if (!Params.isDebugMode) LogMng.setMode(LogMng.MODE_RELEASE);
        LogMng.system('LogMng mode: ' + LogMng.getMode());

        if (Params.isDebugMode) {
            console.log('GameStarter.init(): init params: ', aParams);
        }
        
        // GET Params
        this.readGETParams();

        // preloader
        this.preloader = new Preloader();
        this.preloader.onLoadProgressSignal.add((aPercent: number) => {
            this.onLoadProgress(aPercent);
        }, this);
        this.preloader.onLoadCompleteSignal.addOnce(() => {
            this.onLoadComplete();
        }, this);
        this.preloader.loadDefault();

    }

    private readGETParams() {
        const names = [];

        for (let i = 0; i < names.length; i++) {
            const n = names[i];
            let val = MyUtils.getQueryValue(n);
            if (val != null && val != undefined) {
                switch (i) {
                    case 0: // skytype
                        // Config.ENVIRONMENT_TYPE = Number(val);
                        // LogMng.debug(`Config.SKYBOX_TYPE = ${Config.ENVIRONMENT_TYPE}`);
                        break;

                }
            }
        }


    }

    private onLoadProgress(aPercent: number) {
        this.onLoadProgressSignal.dispatch(aPercent);
        LogMng.debug(`loading: ${aPercent}`);
    }

    private onLoadComplete() {
        try {
            document.getElementById('loader').style.display = 'none';
        } catch (error) {

        }

        this.onLoadCompleteSignal.dispatch();
    }

}
