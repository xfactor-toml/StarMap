import { LogMng } from '../utils/LogMng';
import { Settings } from '../data/Settings';
import { AudioMng } from '../audio/AudioMng';
import { GameEvents } from '../events/GameEvents';
import { FrontEvents } from '../events/FrontEvents';
import { Signal } from '../utils/events/Signal';
import { AudioAlias, MusicLoadList, SoundLoadList } from '../audio/AudioData';
import { MODEL_LOAD_LIST } from '../data/ModelData';
import { ThreeLoader } from '../utils/threejs/ThreeLoader';
import { TEXTURE_LOAD_LIST } from '../data/TextureData';

export class GamePreloader {

    private _loader: ThreeLoader;
    private _currLoadPerc = 0;
    private _isDefaultLoaded = false;
    private _isLoadingInProcess = false;

    onLoadProgressSignal = new Signal();
    onLoadCompleteSignal = new Signal();


    constructor() {
        this._loader = ThreeLoader.getInstance({
            retryCount: 2
        });
    }
    
    public get isLoadingInProcess(): boolean {
        return this._isLoadingInProcess;
    }    

    loadDefault() {

        if (this._isDefaultLoaded || this._isLoadingInProcess) return;

        this._isDefaultLoaded = true;
        this._isLoadingInProcess = true;

        // load default

        let setId = this._loader.createNewSet({
            context: this,
            onProgress: this.onLoadProgress,
            onComplete: this.onLoadComplete
        });
        this.addCommonAssetsToLoader(setId);
        this._loader.startSetLoading(setId);

    }

    private addCommonAssetsToLoader(aSetId: number) {

        let assetsPath = Settings.assetsPath;

        // star point sprite
        // this._loader.texture('starPoint', `./assets/starPoint.svg`);
        // this._loader.texture('starPoint', `./assets/starPoint_512.png`);
        // this._loader.addFileToSet(aSetId, 'starPoint', `./assets/starPoint_128.png`);
        // this._loader.texture('starPoint', `./assets/starPoint2.svg`);

        // skybox
        let path = assetsPath + 'skybox/skybox5/';
        let sbNames = ['right', 'left', 'top', 'bottom', 'front', 'back'];
        let sb_ext = '.png';
        // let sb_size = SkyboxMng.size = '2048';
        let sbFullFileNames = [];
        for (let i = 0; i < sbNames.length; i++) {
            const name = sbNames[i];
            let fileName = path + name + sb_ext;
            sbFullFileNames.push(fileName);
        }
        let alias = 'skybox';
        this._loader.addCubeTextureToSet(aSetId, alias, sbFullFileNames);

        // main sprite
        // this._loader.texture('galaxySprite', `./assets/galaxySprite.webp`);

        // path = assetsPath + 'sprites/stars/';
        // this._loader.texture(`star_03`, path + `star_03.png`);

        // small galaxy sprites
        path = assetsPath + 'galaxies/';
        for (let i = 0; i < Settings.SMALL_GALAXIES_SPRITE_COUNT; i++) {
            let gName = `galaxy_${(i + 1).toString().padStart(2, '0')}`;
            // this._loader.texture(gName, path + `${gName}.png`);
            this._loader.addFileToSet(aSetId, {
                alias: gName,
                file: path + `${gName}.png`
            });
        }

        path = assetsPath + 'particles/';
        // loader.texture('circle_01', `${path}circle_01.png`);  
        // this.loader.texture('star3', `${path}Star_3_256.png`);
        this._loader.addFileToSet(aSetId, {
            alias: 'star4',
            file: `${path}Star_4_256.png`
        });
        this._loader.addFileToSet(aSetId, {
            alias: 'star4_512',
            file: `${path}Star_4_512.png`
        });

        path = assetsPath + 'sun/';
        this._loader.addFileToSet(aSetId, {
            alias: 'sun_01',
            file: `${path}Sun_01.png`
        });
        this._loader.addFileToSet(aSetId, {
            alias: 'sun_02',
            file: `${path}Sun_02.png`
        });
        this._loader.addFileToSet(aSetId, {
            alias: 'sun_romb',
            file: `${path}Galaxy_512.png`
        });
        this._loader.addFileToSet(aSetId, {
            alias: 'sun_surf',
            file: `${path}surfTexture.jpg`
        });

        // ready system state
        path = assetsPath;
        this._loader.addFileToSet(aSetId, {
            alias: 'galaxyState',
            file: `${path}galaxyState.json`
        });

        // TODO: clouds
        // this.loader.texture('cloud', assetsPath + 'cloud.png');

        // models
        let modelsPath = `${assetsPath}models/`;
        for (let i = 0; i < MODEL_LOAD_LIST.length; i++) {
            const item = MODEL_LOAD_LIST[i];
            this._loader.addFileToSet(aSetId, {
                alias: item.alias,
                file: modelsPath + item.file
            });
        }

        // textures
        let texturesPath = `${assetsPath}`;
        for (let i = 0; i < TEXTURE_LOAD_LIST.length; i++) {
            const item = TEXTURE_LOAD_LIST[i];
            this._loader.addFileToSet(aSetId, {
                alias: item.alias,
                file: texturesPath + item.file
            });
        }

        let am = AudioMng.getInstance({});
        // storage data
        am.musicVolume = Number(localStorage.getItem(`musicVolume`)) || Settings.AUDIO.defaultMusicVolume;
        am.sfxVolume = Number(localStorage.getItem(`sfxVolume`)) || Settings.AUDIO.defaultSfxVolume;
        am.init({
            musicList: MusicLoadList,
            soundList: SoundLoadList
        });

    }

    private onLoadProgress(aProgressPercent: number) {

        if (aProgressPercent - this._currLoadPerc > 10) {
            this._currLoadPerc = aProgressPercent;
            this.onLoadProgressSignal.dispatch(this._currLoadPerc);
            if (Settings.isDebugMode) {
                console.log('loading: ', this._currLoadPerc);
            }
        }

        GameEvents.dispatchEvent(GameEvents.EVENT_LOADING, { percent: aProgressPercent });

    }

    private onLoadComplete() {

        this._isLoadingInProcess = false;
        this.onLoadCompleteSignal.dispatch();

        GameEvents.dispatchEvent(GameEvents.EVENT_LOADED, { frontEvents: FrontEvents });

    }

}
