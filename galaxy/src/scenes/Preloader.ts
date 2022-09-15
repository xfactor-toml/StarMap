import { ThreeLoader } from '../loaders/ThreeLoader';
import { Signal } from '../events/Signal';
import { LogMng } from '../utils/LogMng';
import { Config } from '../data/Config';
import { Params } from '../data/Params';
import { AudioMng } from '../audio/AudioMng';
import { AudioData } from '../audio/AudioData';
import { GameEvents } from '../events/GameEvents';
import { FrontEvents } from '../events/FrontEvents';

export class Preloader {
    private loader: ThreeLoader;
    private currLoadPerc = 0;
    private isDefaultLoaded = false;
    private _isLoadingInProcess = false;

    onLoadProgressSignal = new Signal();
    onLoadCompleteSignal = new Signal();


    constructor() {
        this.loader = ThreeLoader.getInstance({
            isDebugMode: Params.isDebugMode
        });
    }
    
    public get isLoadingInProcess(): boolean {
        return this._isLoadingInProcess;
    }    

    loadDefault() {
        if (this.isDefaultLoaded || this._isLoadingInProcess) return;
        this.isDefaultLoaded = true;
        this._isLoadingInProcess = true;
        // load default
        this.loader.onLoadCompleteSignal.addOnce(() => {
            LogMng.debug('mapConfigLoaded...');
            this.loader.onLoadUpdateSignal.add(this.onLoaderUpdate, this);
            this.loader.onLoadCompleteSignal.add(this.onLoadComplete, this);
            this.addCommonAssetsToLoader();
            this.loader.start();
        }, this);
        // this.loader.json('map_config', aMapConfigFile);
        this.loader.start();
    }

    private addCommonAssetsToLoader() {
        let assetsPath = Params.assetsPath;

        // star point sprite
        this.loader.texture('starPoint', `./assets/star.svg`);
        this.loader.texture('starInducePoint', `./assets/star_induce.svg`);

        // big stars sprites
        // this.loader.texture('bigStarSprite4', `./assets/sprites/stars/star_04.png`);

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
        this.loader.cubeTexture(alias, sbFullFileNames);


        // main sprite
        this.loader.texture('galaxySprite', `./assets/galaxySprite.webp`);

        // small galaxy sprites
        path = assetsPath + 'galaxies/';
        for (let i = 0; i < Config.SMALL_GALAXIES_SPRITE_COUNT; i++) {
            let gName = `galaxy_${(i + 1).toString().padStart(2, '0')}`;
            this.loader.texture(gName, path + `${gName}.png`);
        }

        path = assetsPath + 'particles/';
        // loader.texture('circle_01', `${path}circle_01.png`);
        this.loader.texture('star3', `${path}Star_3_256.png`);
        this.loader.texture('star4', `${path}Star_4_256.png`);
        this.loader.texture('star4_512', `${path}Star_4_512.png`);

        path = assetsPath + 'sun/';
        this.loader.texture('sun_01', `${path}Sun_01.png`);
        this.loader.texture('sun_02', `${path}Sun_02.png`);
        this.loader.texture('sun_romb', `${path}Galaxy_512.png`);

        // ready system state
        path = assetsPath;
        this.loader.json('galaxyState', `${path}galaxyState.json`);

        // this.loader.texture('cloud', assetsPath + 'cloud.png');

        let am = AudioMng.getInstance({});
        // storage data
        am.musicVolume = Number(localStorage.getItem(`musicVolume`) || 1);
        am.sfxVolume = Number(localStorage.getItem(`sfxVolume`) || 1);
        am.init(AudioData.SOUNDS);

    }

    private onLoaderUpdate(aPerc: number) {
        if (aPerc - this.currLoadPerc > 10) {
            this.currLoadPerc = aPerc;
            this.onLoadProgressSignal.dispatch(this.currLoadPerc);
            if (Params.isDebugMode) {
                console.log('loading: ', this.currLoadPerc);
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
