import { ThreeLoader } from '../loaders/ThreeLoader';
import { Signal } from '../events/Signal';
import { LogMng } from '../utils/LogMng';
import { Config } from '../data/Config';
import { Params } from '../data/Params';

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

        let sb_format = '.png';
        let path = './assets/skybox/black/1024/';
        
        this.loader.texture('skybox1-xpos', path + 'right' + sb_format);
        this.loader.texture('skybox1-xneg', path + 'left' + sb_format);
        this.loader.texture('skybox1-ypos', path + 'top' + sb_format);
        this.loader.texture('skybox1-yneg', path + 'bot' + sb_format);
        this.loader.texture('skybox1-zpos', path + 'front' + sb_format);
        this.loader.texture('skybox1-zneg', path + 'back' + sb_format);

        // main sprite
        path = './assets/galaxies/';
        this.loader.texture('galaxySprite', `./assets/BC10.webp`);

        // galaxy sprites
        path = './assets/galaxies/';
        for (let i = 0; i < Config.SMALL_GALAXIES_COUNT; i++) {
            let gName = `galaxy_${(i + 1).toString().padStart(2, '0')}`;
            this.loader.texture(gName, path + `${gName}.png`);
        }

        path = './assets/particles/';
        // loader.texture('circle_01', `${path}circle_01.png`);
        this.loader.texture('star3', `${path}Star_3_256.png`);
        this.loader.texture('star4', `${path}Star_4_256.png`);
        this.loader.texture('star4_512', `${path}Star_4_512.png`);

        path = './assets/sun/';
        this.loader.texture('sun_01', `${path}Sun_01.png`);
        this.loader.texture('sun_02', `${path}Sun_02.png`);
        this.loader.texture('sun_romb', `${path}Galaxy_512.png`);

        path = './assets/';
        this.loader.json('galaxyStructure', `${path}galaxyStructure.json`);

        path = './assets/audio/';
        // loader.sound('sndMain', `${path}vorpal-12.mp3`);

        this.loader.texture('cloud', './assets/cloud.png');

    }

    private onLoaderUpdate(aPerc: number) {
        if (aPerc - this.currLoadPerc > 10) {
            this.currLoadPerc = aPerc;
            this.onLoadProgressSignal.dispatch(this.currLoadPerc);
            if (Params.isDebugMode) {
                console.log('loading: ', this.currLoadPerc);
            }
        }
    }

    private onLoadComplete() {
        this._isLoadingInProcess = false;
        this.onLoadCompleteSignal.dispatch();
    }

}
