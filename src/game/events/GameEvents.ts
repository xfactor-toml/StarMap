import { AcceptScreenAction, AcceptScreenData, BoxOpenData, Emotion, ExpData, GameCompleteData, StartGameData } from "../battle/Types";

export type AcceptData = {
    eventName: GameEvent.BATTLE_ACCEPT_SCREEN,
    action: AcceptScreenAction,
    time?: {
        acceptTimeSec: number
    },
    state?: {
        current: number,
        max: number
    }
}

export type EmotionData = {
    eventName: GameEvent.BATTLE_EMOTION,
    type: 'showSelection' | 'show' | 'selected',
    emotion?: Emotion,
    position2d?: { x: number, y: number }
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

    static battlePrerollShow(aData: StartGameData) {
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
            action: 'start',
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
            action: aData.action,
            state: aData.state
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    static battleAcceptScreenLoading(aData: AcceptScreenData) {
        let data: AcceptData = {
            eventName: GameEvent.BATTLE_ACCEPT_SCREEN,
            action: aData.action
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    static battleAcceptScreenClose() {
        let data: AcceptData = {
            eventName: GameEvent.BATTLE_ACCEPT_SCREEN,
            action: 'cancel'
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    static showEmotionSelection(aPos2d: {x, y}) {
        let data: EmotionData = {
            eventName: GameEvent.BATTLE_EMOTION,
            type: 'showSelection',
            position2d: aPos2d
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    static showEmotion(aEmotion: Emotion, aPos2d: { x, y }) {
        let data: EmotionData = {
            eventName: GameEvent.BATTLE_EMOTION,
            type: 'show',
            emotion: aEmotion,
            position2d: aPos2d
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    private static getRandomEmotion(): Emotion {
        const emotions: Emotion[] = ['smile', 'evil', 'dead', 'thinking', 'angry', 'sad'];
        const randomIndex = Math.floor(Math.random() * emotions.length);
        return emotions[randomIndex];
    }

    static showRandomEmotion(aPos2d: { x, y }) {
        let emotion: Emotion = this.getRandomEmotion();
        let data: EmotionData = {
            eventName: GameEvent.BATTLE_EMOTION,
            type: 'show',
            emotion: emotion,
            position2d: aPos2d
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

}
