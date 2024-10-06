import { AcceptScreenData, BoxOpenData, Emotion, ExpData, GameCompleteData, ShopData, StartGameData } from "../battle/Types";
import { ServerStarData } from "../data/Types";
import { AcceptEventData, EmotionEventData, ExplosionEventData, GameEvent, ShopEventData, StarGameEventData, StarGameInitData, StarGameUpdateData } from "./Types";

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

    static showGalaxyMode() {
        this.dispatchEvent(GameEvent.GALAXY_MODE);
    }

    static showStarPreview(aData: {
        starData: ServerStarData,
        pos2d: {
            x: number,
            y: number
        }
    }) {
        this.dispatchEvent(GameEvent.SHOW_STAR_PREVIEW, aData);
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
        let data: AcceptEventData = {
            eventName: GameEvent.BATTLE_ACCEPT_SCREEN,
            action: 'start',
            timer: aAcceptTime
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    static battleAcceptScreenUpdate(aData: AcceptScreenData) {
        let data: AcceptEventData = {
            eventName: GameEvent.BATTLE_ACCEPT_SCREEN,
            action: aData.action,
            state: aData.state
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    static battleAcceptScreenLoading(aData: AcceptScreenData) {
        let data: AcceptEventData = {
            eventName: GameEvent.BATTLE_ACCEPT_SCREEN,
            action: aData.action
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    static battleAcceptScreenClose() {
        let data: AcceptEventData = {
            eventName: GameEvent.BATTLE_ACCEPT_SCREEN,
            action: 'cancel'
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    static playerPickScreenClose() {
        let data: AcceptEventData = {
            eventName: GameEvent.BATTLE_ACCEPT_SCREEN,
            action: 'playerPick'
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }
    

    static showEmotionSelection(aPos2d: {x, y}) {
        let data: EmotionEventData = {
            eventName: GameEvent.BATTLE_EMOTION,
            type: 'showSelection',
            position2d: aPos2d
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    static showEmotion(aEmotion: Emotion, aPos2d: { x, y }) {
        let data: EmotionEventData = {
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
        let data: EmotionEventData = {
            eventName: GameEvent.BATTLE_EMOTION,
            type: 'show',
            emotion: emotion,
            position2d: aPos2d
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    static battleShopEvent(aData: ShopData) {
        let data: ShopEventData = {
            eventName: GameEvent.BATTLE_SHOP,
            data: aData
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    /**
     * for test of GUI animation
     * @param aPos2d 
     */
    static explosion(aPos2d: { x: number, y: number }) {
        let data: ExplosionEventData = {
            eventName: GameEvent.BATTLE_EXPLOSION,
            position2d: aPos2d
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    static initStarGames(list: StarGameInitData[]) {
        let data: StarGameEventData = {
            eventName: GameEvent.STAR_GAME,
            action: 'init',
            initList: list
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    static updateStarGamePosition(updData: StarGameUpdateData) {
        let data: StarGameEventData = {
            eventName: GameEvent.STAR_GAME,
            action: 'update',
            updateData: updData
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }

    static setStarGamesVisible(visible: boolean) {
        let data: StarGameEventData = {
            eventName: GameEvent.STAR_GAME,
            action: 'visible',
            visible: visible
        };
        window.dispatchEvent(new CustomEvent('gameEvent', {
            detail: data
        }));
    }


}
