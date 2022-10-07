import { ThreeLoader } from '../loaders/ThreeLoader';
import { Signal } from '../events/Signal';
import { LogMng } from '../utils/LogMng';
import { Settings } from '../data/Settings';
import { AudioMng } from '../audio/AudioMng';
import { AudioData } from '../audio/AudioData';
import { GameEvents } from '../events/GameEvents';
import { FrontEvents } from '../events/FrontEvents';

export class GamePreloader {

    private _loader: ThreeLoader;
    private _currLoadPerc = 0;
    private _isDefaultLoaded = false;
    private _isLoadingInProcess = false;

    onLoadProgressSignal = new Signal();
    onLoadCompleteSignal = new Signal();


    constructor() {

        this._loader = ThreeLoader.getInstance({
            isDebugMode: Settings.isDebugMode
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
        this._loader.onLoadCompleteSignal.addOnce(() => {
            LogMng.debug('mapConfigLoaded...');
            this._loader.onLoadUpdateSignal.add(this.onLoaderUpdate, this);
            this._loader.onLoadCompleteSignal.add(this.onLoadComplete, this);
            this.addCommonAssetsToLoader();
            this._loader.start();
        }, this);
        // this.loader.json('map_config', aMapConfigFile);
        this._loader.start();

    }

    private addCommonAssetsToLoader() {

        let assetsPath = Settings.assetsPath;

        // star point sprite
        this._loader.texture('starPoint', `./assets/starPoint.svg`);

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
        this._loader.cubeTexture(alias, sbFullFileNames);


        // main sprite
        this._loader.texture('galaxySprite', `./assets/galaxySprite.webp`);

        // small galaxy sprites
        path = assetsPath + 'galaxies/';
        for (let i = 0; i < Settings.SMALL_GALAXIES_SPRITE_COUNT; i++) {
            let gName = `galaxy_${(i + 1).toString().padStart(2, '0')}`;
            this._loader.texture(gName, path + `${gName}.png`);
        }

        path = assetsPath + 'particles/';
        // loader.texture('circle_01', `${path}circle_01.png`);  
        // this.loader.texture('star3', `${path}Star_3_256.png`);
        this._loader.texture('star4', `${path}Star_4_256.png`);
        this._loader.texture('star4_512', `${path}Star_4_512.png`);

        path = assetsPath + 'sun/';
        this._loader.texture('sun_01', `${path}Sun_01.png`);
        this._loader.texture('sun_02', `${path}Sun_02.png`);
        this._loader.texture('sun_romb', `${path}Galaxy_512.png`);
        this._loader.texture('sun_surf', `${path}surfTexture.jpg`);

        // ready system state
        path = assetsPath;
        this._loader.json('galaxyState', `${path}galaxyState.json`);

        // TODO: clouds
        // this.loader.texture('cloud', assetsPath + 'cloud.png');

        let am = AudioMng.getInstance({});
        // storage data
        am.musicVolume = Number(localStorage.getItem(`musicVolume`) || 1);
        am.sfxVolume = Number(localStorage.getItem(`sfxVolume`) || 1);
        am.init(AudioData.SOUNDS);

    }

    private onLoaderUpdate(aPerc: number) {

        if (aPerc - this._currLoadPerc > 10) {
            this._currLoadPerc = aPerc;
            this.onLoadProgressSignal.dispatch(this._currLoadPerc);
            if (Settings.isDebugMode) {
                console.log('loading: ', this._currLoadPerc);
            }
        }

        GameEvents.dispatchEvent(GameEvents.EVENT_LOADING, { percent: aPerc });

    }

    private onLoadComplete() {

        this._isLoadingInProcess = false;
        this.onLoadCompleteSignal.dispatch();

        GameEvents.dispatchEvent(GameEvents.EVENT_LOADED, { frontEvents: FrontEvents });

    }

}
