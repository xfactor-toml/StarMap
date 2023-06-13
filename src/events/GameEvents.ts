
export const GameEvents = {

    EVENT_LOADING: 'GAME_LOADING',
    EVENT_LOADED: 'GAME_LOADED',
    EVENT_GAME_CREATED: 'GAME_CREATED',
    EVENT_GAME_FULSCREEN: 'GAME_FULLSCREEN',
    EVENT_SHOW_STAR_PREVIEW: 'SHOW_STAR_PREVIEW',
    EVENT_HIDE_STAR_PREVIEW: 'HIDE_STAR_PREVIEW',
    EVENT_SHOW_STAR_GUI: 'SHOW_STAR_GUI',
    /**
     * send pos: {x, y, z}
     */
    EVENT_SHOW_PHANTOM_STAR_GUI: 'SHOW_PHANTOM_STAR_GUI',

    dispatchEvent: (aEventName: string, aData: any = {}) => {
        aData.eventName = aEventName;
        window.dispatchEvent(new CustomEvent('gameEvent', { detail: aData }));
    }

}
