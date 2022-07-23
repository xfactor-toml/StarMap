
export const GameEvents = {

    EVENT_GAME_CREATED: 'EVENT_GAME_CREATED',
    EVENT_SHOW_STAR_PREVIEW: 'EVENT_SHOW_STAR_PREVIEW',
    EVENT_HIDE_STAR_PREVIEW: 'EVENT_HIDE_STAR_PREVIEW',
    EVENT_SHOW_STAR_GUI: 'EVENT_SHOW_STAR_GUI',

    dispatchEvent: (aEventName: string, aData: any = {}) => {
        aData.eventName = aEventName;
        window.dispatchEvent(new CustomEvent('gameEvent', { detail: aData }));
    }

}

