
export const GameEvents = {

    EVENT_LOADING: 'GAME_LOADING',
    EVENT_LOADED: 'GAME_LOADED',
    EVENT_GAME_CREATED: 'GAME_CREATED',
    EVENT_GAME_FULSCREEN: 'GAME_FULLSCREEN',

    /**
     * starId: number,
     * name: string,
     * description: string,
     * level: number,
     * race: string,
     * pos2d: { x, y }
     */
    EVENT_SHOW_STAR_PREVIEW: 'SHOW_STAR_PREVIEW',
    EVENT_HIDE_STAR_PREVIEW: 'HIDE_STAR_PREVIEW',

    /**
     * name,
     * description,
     * level,
     * race,
     * planetSlots,
     * energy,
     * life,
     * scale
     */
    EVENT_SHOW_STAR_GUI: 'SHOW_STAR_GUI',

    /**
     * starId: number,
     * send pos: {x, y, z}
     */
    EVENT_PHANTOM_STAR_PREVIEW: 'PHANTOM_STAR_PREVIEW',

    dispatchEvent: (aEventName: string, aData: any = {}) => {
        aData.eventName = aEventName;
        window.dispatchEvent(new CustomEvent('gameEvent', { detail: aData }));
    }

}
