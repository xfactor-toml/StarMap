import { GameCompleteData } from "../battle/Types";

export enum GameEvent {
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
    BATTLE_SEARCHING_START = 'BATTLE_SEARCHING_START',
    BATTLE_SEARCHING_STOP = 'BATTLE_SEARCHING_STOP',
    /**
     * reason: string
     */
    BATTLE_SEARCHING_ERROR = 'BATTLE_SEARCHING_ERROR',
    BATTLE_PREROLL_SHOW = 'BATTLE_PREROLL_SHOW',
    BATTLE_COMPLETE_SHOW = 'BATTLE_COMPLETE_SHOW',
}

export class GameEventDispatcher {

    static dispatchEvent(aEventName: GameEvent, aData: any = {}) {
        aData.eventName = aEventName;
        window.dispatchEvent(new CustomEvent('gameEvent', { detail: aData }));
    }

    static battlePrerollShow(aData: {
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

}
