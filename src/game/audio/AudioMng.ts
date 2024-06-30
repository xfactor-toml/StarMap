import { Sound, sound } from '@pixi/sound';
import { LogMng } from "../../monax/LogMng";
import { ILogger } from '../core/interfaces/ILogger';

type InitParams = {

};

export class AudioMng implements ILogger {

    private static _instance: AudioMng = null;
    private _params: InitParams;
    private _musicVolume = 1;
    private _sfxVolume = 1;
    private _musics: { [key: string]: Sound };
    private _sounds: { [key: string]: Sound };

    private constructor(aParams: InitParams) {
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

    logDebug(aMsg: string, aData?: any): void {
        LogMng.debug(`AudioMng: ${aMsg}`, aData);
    }
    logWarn(aMsg: string, aData?: any): void {
        LogMng.warn(`AudioMng: ${aMsg}`, aData);
    }
    logError(aMsg: string, aData?: any): void {
        LogMng.error(`AudioMng: ${aMsg}`, aData);
    }
    
    public set musicVolume(v: number) {
        this._musicVolume = v;
        for (const key in this._musics) {
            const m = this._musics[key];
            m.volume = v;
        }
    }

    public get musicVolume(): number {
        return this._musicVolume;
    }

    public set sfxVolume(v: number) {
        this._sfxVolume = v;
        for (const key in this._sounds) {
            const s = this._sounds[key];
            s.volume = v;
        }
    }

    public get sfxVolume(): number {
        return this._sfxVolume;
    }

    init(aParams: {
        musicList: { alias: string, file: string }[],
        soundList: { alias: string, file: string }[]
    }) {
        this._musics = {};
        this._sounds = {};
        for (let i = 0; i < aParams.musicList.length; i++) {
            const item = aParams.musicList[i];
            this._musics[item.alias] = sound.add(item.alias, item.file);
        }
        for (let i = 0; i < aParams.soundList.length; i++) {
            const item = aParams.soundList[i];
            this._sounds[item.alias] = sound.add(item.alias, item.file);
        }
    }

    getMusic(aAlias: string): Sound {
        return this._musics[aAlias];
    }

    getSound(aAlias: string): Sound {
        return this._sounds[aAlias];
    }

    playMusic(aAlias: string): Sound {
        let snd = this._musics[aAlias];
        if (!snd) {
            this.logError(`playMusic: unknown alias: ${aAlias}`);
            return snd;
        }
        if (!snd.isPlaying) {
            snd.volume = this.musicVolume;
            snd.loop = true;
            snd.play();
        }
        return snd;
    }

    stopMusic(aAlias: string) {
        let snd = this._musics[aAlias];
        if (!snd) {
            this.logDebug(`stopMusic: !snd alias: ${aAlias}`);
            return;
        }
        snd.stop();
    }

    playSfx(aParams: { alias: string, loop?: boolean, volume?: number }): Sound;
    playSfx(aAlias: string): Sound;
    playSfx(atr1: any): Sound {
        let params: { alias: string, loop?: boolean, volume?: number };

        // read atributes
        if (atr1 instanceof Object) params = atr1;
        else params = { alias: atr1 as string };

        let snd = this._sounds[params.alias];
        snd.volume = params.volume != null ? this.sfxVolume * params.volume : this.sfxVolume;
        snd.loop = params.loop != null ? params.loop : false;
        snd.play();

        return snd;
    }

}