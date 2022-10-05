import { Config } from "../data/Config";
import { Signal } from "../events/Signal";
import { LogMng } from "../utils/LogMng";
import { Preloader } from "./Preloader";
import * as MyUtils from "../utils/MyUtils";
import { Params } from "../data/Params";
import { GameEngine } from "./GameEngine";
import { GameEvents } from "../events/GameEvents";
import { FrontEvents } from "../events/FrontEvents";
import { AudioMng } from "../audio/AudioMng";
import { AudioData } from "../audio/AudioData";

type InitParams = {

};

export class GameBoot {
    private inited = false;
    private preloader: Preloader;
    isLoaded = false;

    constructor() {
        Params.domCanvasParent = document.getElementById('game');
        Params.domTouchParent = document.getElementById('touch');
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
        this.preloader.onLoadCompleteSignal.addOnce(this.onLoadComplete, this);
        this.preloader.loadDefault();

        FrontEvents.startGame.add((aFullscreen = false) => {
            Config.INIT_FULL_SCREEN = aFullscreen;
            this.startGame();
        }, this);

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
        // LogMng.debug(`loading: ${aPercent}`);
    }

    private onLoadComplete() {
        this.initEvents();
        this.isLoaded = true;
    }

    private initEvents() {
        FrontEvents.playInitScreenSfx.addOnce(() => {
            let am = AudioMng.getInstance();
            am.playSfx(AudioData.SFX_INIT);
        }, this);

        FrontEvents.onHover.add(() => {
            // LogMng.debug('onHover...');
            AudioMng.getInstance().playSfx(AudioData.SFX_HOVER);
        }, this);

        FrontEvents.onClick.add(() => {
            AudioMng.getInstance().playSfx(AudioData.SFX_CLICK);
        }, this);
    }
        
    startGame() {
        let gameEngine = new GameEngine();
        GameEvents.dispatchEvent(GameEvents.EVENT_GAME_CREATED);
    }


}
