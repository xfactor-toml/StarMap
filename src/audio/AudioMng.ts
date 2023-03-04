import { Sound, sound } from '@pixi/sound';
import { LogMng } from "../utils/LogMng";

type InitParams = {

};

export class AudioMng {

    private static _instance: AudioMng = null;
    private _params: InitParams;
    private _sounds: { [key: string]: Sound };

    musicVolume = 1;
    sfxVolume = 1;

    constructor(aParams: InitParams) {
        if (AudioMng._instance) throw new Error("Don't use AudioMng.constructor(), it's SINGLETON, use getInstance() method");
        this._params = aParams;
    }

    static getInstance(aParams?: InitParams): AudioMng {
        if (!AudioMng._instance) {
            if (aParams) {
                AudioMng._instance = new AudioMng(aParams);
            }
            else {
                LogMng.error('AudioMng.getInstance(): aParams = null!');
            }
        }
        return AudioMng._instance;
    }

    init(aList: {
        alias: string,
        file: string
    }[]) {
        this._sounds = {};
        for (let i = 0; i < aList.length; i++) {
            const item = aList[i];
            this._sounds[item.alias] = sound.add(item.alias, item.file);
        }
    }

    getSound(aAlias: string): Sound {
        return this._sounds[aAlias];
    }

    playMusic(aAlias: string, aLoop = true, aVolume?) {
        let snd = this._sounds[aAlias];
        snd.volume = aVolume || this.musicVolume;
        snd.loop = aLoop;
        snd.play();
    }

    playSfx(aAlias: string, aVolume?) {
        let snd = this._sounds[aAlias];
        snd.volume = aVolume || this.sfxVolume;
        snd.play();
    }

}