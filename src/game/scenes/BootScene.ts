import { LogMng } from "../utils/LogMng";
import { GlobalParams } from "../data/GlobalParams";
import { BasicScene } from "../core/scene/BasicScene";
import { SceneNames } from "./SceneNames";
import { MyUtils } from "../utils/MyUtils";
import { BattleConnection } from "../battle/BattleConnection";
import { GameEvent, GameEventDispatcher } from "../events/GameEvents";
import { PackTitle } from "../battle/Types";

export class BootScene extends BasicScene {

    constructor() {
        super(SceneNames.BootScene);
    }
    
    onInit() {
        // init params
        GlobalParams.domCanvasParent = document.getElementById('game');
        GlobalParams.domTouchParent = document.getElementById('touch');
        GlobalParams.domGuiParent = document.getElementById('gui');
        // GET Params
        this.readGETParams();
        // battle connection
        this.initBattleConnection();
        // Preloader
        this.startPreloader();
    }

    private readGETParams() {

        const LIST = [
            {
                // load from file
                keys: ['loadfromfile'],
                onReadHandler: (aValue: string) => {
                    GlobalParams.loadFromFile = aValue == '1';
                    LogMng.debug(`Config.loadFromFile = ${GlobalParams.loadFromFile}`);
                }
            },
            {
                // battle local connection
                keys: ['blc'],
                onReadHandler: (aValue: string) => {
                    GlobalParams.BATTLE.localConnect = aValue == '1';
                    LogMng.debug(`Settings.BATTLE.localConnect = ${GlobalParams.BATTLE.localConnect}`);
                }
            },
            {
                // battle free link connection
                keys: ['bfc'],
                onReadHandler: (aValue: string) => {
                    GlobalParams.BATTLE.freeConnect = aValue == '1';
                    LogMng.debug(`Settings.BATTLE.localConnect = ${GlobalParams.BATTLE.localConnect}`);
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

    private initBattleConnection() {
        let con = BattleConnection.getInstance();
        con.on(PackTitle.gameSearching, this.onGameSearchPack, this);
    }

    private onGameSearchPack(aData: {
        cmd: 'start' | 'stop'
    }) {
        switch (aData.cmd) {
            case 'start':
                GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_START);
                break;
            case 'stop':
                GameEventDispatcher.dispatchEvent(GameEvent.BATTLE_SEARCHING_STOP);
                break;
            default:
                this.logDebug(`onGameSearchPack(): unknown cmd`, aData);
                break;
        }
    }

    private startPreloader() {
        this.startScene(SceneNames.PreloaderScene);
    }

}
