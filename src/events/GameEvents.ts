
export const GameEvents = {

    EVENT_LOADING: 'GAME_LOADING',
    EVENT_LOADED: 'GAME_LOADED',
    EVENT_GAME_CREATED: 'GAME_CREATED',
    EVENT_GAME_FULSCREEN: 'GAME_FULLSCREEN',

    /**
     * starData: ServerStarData
     * pos2d: { x, y }
     */
    EVENT_SHOW_STAR_PREVIEW: 'SHOW_STAR_PREVIEW',
    EVENT_HIDE_STAR_PREVIEW: 'HIDE_STAR_PREVIEW',

    /**
     * pos3d: {x, y, z}
     * pos2d: { x, y }
     */
    EVENT_PHANTOM_STAR_PREVIEW: 'PHANTOM_STAR_PREVIEW',

    /**
     * starData: ServerStarData
     * scale
     */
    EVENT_SHOW_STAR_GUI: 'SHOW_STAR_GUI',

    EVENT_SHOW_REAL_MODE: 'SHOW_REAL_MODE',
    EVENT_SHOW_PHANTOM_MODE: 'SHOW_PHANTOM_MODE',

    dispatchEvent: (aEventName: string, aData: any = {}) => {
        aData.eventName = aEventName;
        window.dispatchEvent(new CustomEvent('gameEvent', { detail: aData }));
    }

}
