import { LogMng } from "../utils/LogMng";
import { GamePreloader } from "./GamePreloader";
import * as MyUtils from "../utils/MyUtils";
import { Settings } from "../data/Settings";
import { GameRender } from "./GameRender";
import { GameEvents } from "../events/GameEvents";
import { FrontEvents } from "../events/FrontEvents";
import { AudioMng } from "../audio/AudioMng";
import { AudioData } from "../audio/AudioData";
import { ILogger } from "../interfaces/ILogger";

type InitParams = {

};

export class GameBoot implements ILogger {
    private inited = false;
    private preloader: GamePreloader;
    isLoaded = false;

    constructor() {
        Settings.domCanvasParent = document.getElementById('game');
        Settings.domTouchParent = document.getElementById('touch');
        Settings.domGuiParent = document.getElementById('gui');
    }

    logDebug(aMsg: string, aData?: any): void {
        LogMng.debug(`GameBoot -> ${aMsg}`, aData);
    }
    logWarn(aMsg: string, aData?: any): void {
        LogMng.warn(`GameBoot -> ${aMsg}`, aData);
    }
    logError(aMsg: string, aData?: any): void {
        LogMng.error(`GameBoot -> ${aMsg}`, aData);
    }

    init(aParams?: InitParams) {
        if (this.inited) {
            this.logWarn('game is already inited!');
            return;
        }
        this.inited = true;

        // init debug mode
        Settings.isDebugMode = window.location.hash === '#debug';

        // LogMng settings
        if (!Settings.isDebugMode) LogMng.setMode(LogMng.MODE_RELEASE);
        LogMng.system('log mode: ' + LogMng.getMode());

        this.logDebug('GameStarter.init(): init params: ', aParams);
        
        // GET Params
        this.readGETParams();

        // Preloader
        this.startPreloader();

    }

    private readGETParams() {

        const LIST = [
            {
                // load from file
                keys: ['loadfromfile'],
                onReadHandler: (aValue: string) => {
                    Settings.loadFromFile = aValue == '1';
                    LogMng.debug('Config.loadFromFile = ' + Settings.loadFromFile);
                }
            }
        ];

        for (let i = 0; i < LIST.length; i++) {
            const listItem = LIST[i];
            const keys = listItem.keys;
            for (let j = 0; j < keys.length; j++) {
                const getName = keys[j];
                let qValue = MyUtils.getQueryValue(getName);
                if (qValue != null && qValue != undefined) {
                    listItem.onReadHandler(qValue);
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
