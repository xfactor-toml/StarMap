import { AcceptScreenData, BoxOpenData, ExpData, GameCompleteData } from "../battle/Types";

export type AcceptData = {
    eventName: GameEvent.BATTLE_ACCEPT_SCREEN,
    action: 'show' | 'update' | 'close',
    time?: {
        acceptTimeSec: number
    },
    state?: {
        current: number,
        max: number
    }
}

export type EmotionData = {
    type: 'showSelection' | 'show' | 'selected',
    emotion?: 'smile' | 'evil' | 'dead' | 'thinking' | 'angry' | 'sad'
}

export enum GameEvent {

    MESSAGE = 'MESSAGE',

    GAME_LOADING = 'GAME_LOADING',
    GAME_LOADED = 'GAME_LOADED',
    GAME_CREATED = 'GAME_CREATED',
    GAME_FULLSCREEN = 'GAME_FULLSCREEN',

    /**
     * starData: ServerStarData
     * pos2d: { x, y }
     */
    SHOW_STAR_PREVIEW = 'SHOW_STAR_PREVIEW',
    HIDE_STAR_PREVIEW = 'HIDE_STAR_PREVIEW',

    /**
     * pos3d: {x, y, z}
     * pos2d: { x, y }
     */
    PHANTOM_STAR_PREVIEW = 'PHANTOM_STAR_PREVIEW',

    /**
     * starData: ServerStarData
     * scale
     */
    SHOW_STAR_GUI = 'SHOW_STAR_GUI',
    HIDE_STAR_GUI = 'HIDE_STAR_GUI',

    GALAXY_MODE = 'GALAXY_MODE',
    STAR_MODE = 'STAR_MODE',

    SHOW_REAL_MODE = 'SHOW_REAL_MODE',
    SHOW_PHANTOM_MODE = 'SHOW_PHANTOM_MODE',

    // BATTLE
    BATTLE_ACCEPT_SCREEN = 'BATTLE_ACCEPT_SCREEN',
    BATTLE_SEARCHING_START = 'BATTLE_SEARCHING_START',
    BATTLE_SEARCHING_STOP = 'BATTLE_SEARCHING_STOP',
    /**
     * reason: string
    */
    BATTLE_SEARCHING_ERROR = 'BATTLE_SEARCHING_ERROR',
    BATTLE_PREROLL_SHOW = 'BATTLE_PREROLL_SHOW',
    // battle results
    BATTLE_COMPLETE_SHOW = 'BATTLE_COMPLETE_SHOW',
    BATTLE_COMPLETE_HIDE = 'BATTLE_COMPLETE_HIDE',
    SHOW_TOKEN_REWARD = 'SHOW_TOKEN_REWARD',
    SHOW_BOX_OPEN = 'SHOW_BOX_OPEN',
    // battle process
    BATTLE_EXP_DATA = 'BATTLE_EXP_DATA',
    BATTLE_EMOTION = 'BATTLE_EMOTION',
}

export class GameEventDispatcher {
    
    static dispatchEvent(aEventName: GameEvent, aData: any = {}) {
        aData.eventName = aEventName;
        window.dispatchEvent(new CustomEvent('gameEvent', { detail: aData }));
    }

    static showMessage(aMsg: string) {
        let data = {
            eventName: GameEvent.MESSAGE,
            msg: aMsg
        }
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    static battlePrerollShow(aData: {
        timer: number,
        playerWallet: string,
        enemyWallet: string
    }) {
        aData[`eventName`] = GameEvent.BATTLE_PREROLL_SHOW;
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: aData
        }));
    }

    static battleComplete(aData: GameCompleteData) {
        aData[`eventName`] = GameEvent.BATTLE_COMPLETE_SHOW;
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: aData
        }));
    }

    static battleCompleteHide() {
        let data = {
            eventName: GameEvent.BATTLE_COMPLETE_HIDE
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    static battleExpUpdate(aData: ExpData) {
        aData[`eventName`] = GameEvent.BATTLE_EXP_DATA;
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: aData
        }));
    }

    static showTokenReward(aData: { tokens: number }) {
        aData[`eventName`] = GameEvent.SHOW_TOKEN_REWARD;
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: aData
        }));
    }
    
    static showBoxOpenScreen(aData: BoxOpenData) {
        aData[`eventName`] = GameEvent.SHOW_BOX_OPEN;
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: aData
        }));
    }

    static battleAcceptScreenShow(aAcceptTime: number) {
        let data: AcceptData = {
            eventName: GameEvent.BATTLE_ACCEPT_SCREEN,
            action: 'show',
            time: {
                acceptTimeSec: aAcceptTime
            }
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    static battleAcceptScreenUpdate(aData: AcceptScreenData) {
        let data: AcceptData = {
            eventName: GameEvent.BATTLE_ACCEPT_SCREEN,
            action: 'update',
            state: aData.state
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    static battleAcceptScreenClose() {
        let data: AcceptData = {
            eventName: GameEvent.BATTLE_ACCEPT_SCREEN,
            action: 'close'
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

}
