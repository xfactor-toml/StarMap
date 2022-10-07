import { Signal } from "../events/Signal";
import { LogMng } from "../utils/LogMng";
import { GamePreloader } from "./GamePreloader";
import * as MyUtils from "../utils/MyUtils";
import { Settings } from "../data/Settings";
import { GameRender } from "./GameRender";
import { GameEvents } from "../events/GameEvents";
import { FrontEvents } from "../events/FrontEvents";
import { AudioMng } from "../audio/AudioMng";
import { AudioData } from "../audio/AudioData";

type InitParams = {

};

export class GameBoot {
    private inited = false;
    private preloader: GamePreloader;
    isLoaded = false;

    constructor() {
        Settings.domCanvasParent = document.getElementById('game');
        Settings.domTouchParent = document.getElementById('touch');
        Settings.domGuiParent = document.getElementById('gui');
    }

    init(aParams?: InitParams) {
        if (this.inited) {
            LogMng.warn('GameBoot: game is already inited!');
            return;
        }
        this.inited = true;

        // Boot
        Settings.isDebugMode = window.location.hash === '#debug';

        // LogMng settings
        if (!Settings.isDebugMode) LogMng.setMode(LogMng.MODE_RELEASE);
        LogMng.system('LogMng mode: ' + LogMng.getMode());

        if (Settings.isDebugMode) {
            console.log('GameStarter.init(): init params: ', aParams);
        }
        
        // GET Params
        this.readGETParams();

        // Preloader
        this.startPreloader();

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

    private startPreloader() {
        this.preloader = new GamePreloader();
        this.preloader.onLoadCompleteSignal.addOnce(this.onLoadComplete, this);
        this.preloader.loadDefault();

        FrontEvents.startGame.add((aFullscreen = false) => {
            Settings.INIT_FULL_SCREEN = aFullscreen;
            this.startGame();
        }, this);
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
        let gameEngine = new GameRender();
        GameEvents.dispatchEvent(GameEvents.EVENT_GAME_CREATED);
    }


}
