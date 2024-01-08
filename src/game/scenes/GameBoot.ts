import { LogMng } from "../utils/LogMng";
import { GamePreloader } from "./GamePreloader";
import * as MyUtils from "../utils/MyUtils";
import { Settings } from "../data/Settings";
import { GameRenderer } from "./GameRenderer";
import { GameEvent, GameEventDispatcher } from "../events/GameEvents";
import { FrontEvents } from "../events/FrontEvents";
import { AudioMng } from "../audio/AudioMng";
import { ILogger } from "../interfaces/ILogger";
import { DB } from "../data/DB";
import { ServerStarData } from "../data/Types";
import { AudioAlias } from "../audio/AudioData";
import { GameEngine } from "../GameEngine";

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
                    LogMng.debug(`Config.loadFromFile = ${Settings.loadFromFile}`);
                }
            },
            {
                keys: ['blc'],
                onReadHandler: (aValue: string) => {
                    Settings.BATTLE.localConnect = aValue == '1';
                    LogMng.debug(`Settings.BATTLE.localConnect = ${Settings.BATTLE.localConnect}`);
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

        FrontEvents.startGame.add((aFullscreen = false, aRealStars = []) => {
            Settings.INIT_FULL_SCREEN = aFullscreen;
            this.startGame(aRealStars);
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
            am.playSfx(AudioAlias.SFX_INIT);
        }, this);

        FrontEvents.onHover.add(() => {
            // LogMng.debug('onHover...');
            AudioMng.getInstance().playSfx(AudioAlias.SFX_HOVER);
        }, this);

        FrontEvents.onClick.add(() => {
            AudioMng.getInstance().playSfx(AudioAlias.SFX_CLICK);
        }, this);
    }
        
    startGame(aRealStars: ServerStarData[]) {
        DB.realStars = aRealStars;
        let gameEngine = new GameEngine();
        gameEngine.initGame();
        GameEventDispatcher.dispatchEvent(GameEvent.GAME_CREATED);
    }


}
