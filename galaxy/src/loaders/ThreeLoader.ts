import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { FontLoader } from "three";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Signal } from "../events/Signal";
import { LogMng } from "../utils/LogMng";

const TYPE_ATLAS_JSON = 'atlasJSONArray';
const TYPE_TEXTURE = 'image';
const TYPE_CUBE_TEXTURE = 'cubeTexture';
const TYPE_OBJ = 'obj';
const TYPE_FBX = 'fbx';
const TYPE_GLB = 'glb';
const TYPE_GZ = 'gz';
const TYPE_GZIP = 'gzip';
const TYPE_JSON = 'json';
const TYPE_FONT = 'font';

const TEXTURE_PREF = 't_';
const MODEL_PREF = 'm_';
const JSON_PREF = 'json_';

const HEADERS = {
    requestedWith: false,
    json: 'application/json',
    xml: 'application/xml'
};

type LoaderParams = {
    isDebugMode?: boolean;
    retryCount?: number;
    textureMapping?: THREE.Mapping;
    textureEncoding?: THREE.TextureEncoding;
};

export class ThreeLoader {
    private static instance: ThreeLoader = null;

    // params
    private isDebugMode = false;
    private retryCount = 0;
    private textureMapping: THREE.Mapping = null;
    private textureEncoding: THREE.TextureEncoding = null;

    private loadQueue: any[] = [];
    private currLoadData: any;

    private total_items = 0;
    private curr_item = 0;

    // cache.key = data
    private cache = {};

    private retryCounter = {};

    private _isLoaded = true;
    private _isParallel = true;

    // atr1 - percent
    onLoadUpdateSignal = new Signal();
    onLoadCompleteSignal = new Signal();
    onSingleLoadCompleteSignal = new Signal();

    constructor() {
        if (ThreeLoader.instance) {
            throw new Error("Don't use ThreeLoader.constructor(), it's SINGLETON, use getInstance() method");
        }
    }

    static getInstance(aParams: LoaderParams = null): ThreeLoader {
        if (!ThreeLoader.instance) {
            ThreeLoader.instance = new ThreeLoader();
        }
        let loader = ThreeLoader.instance;
        if (aParams) {
            if (aParams.isDebugMode != undefined) loader.isDebugMode = aParams.isDebugMode;
            if (aParams.retryCount != undefined) loader.retryCount = aParams.retryCount;
            if (aParams.textureMapping != undefined) loader.textureMapping = aParams.textureMapping;
            if (aParams.textureEncoding != undefined) loader.textureEncoding = aParams.textureEncoding;
        }
        return ThreeLoader.instance;
    }

    private logDebug(aMessage: string) {
        LogMng.debug('ThreeLoader: ' + aMessage);
    }

    private logWarn(aMessage: string) {
        LogMng.warn('ThreeLoader: ' + aMessage);
    }

    private logError(aMessage: string) {
        LogMng.error('ThreeLoader: ' + aMessage);
    }

    public get isLoaded(): boolean {
        return this._isLoaded;
    }

    public get isParallel(): boolean {
        return this._isParallel;
    }

    public set isParallel(aVal: boolean) {
        this._isParallel = aVal;
    }

    private isItemExists(aKey: string): boolean {
        // check in cache
        if (this.cache[aKey]) {
            this.logWarn(`itemExists ${aKey}:`);
            console.log(this.cache[aKey]);
            return true;
        }
        // check in load queue 1
        if (this.currLoadData && this.currLoadData.key == aKey) {
            this.logWarn(`itemExists ${aKey}:`);
            console.log(this.currLoadData);
            return true;
        }
        // check in load queue 2
        for (let i = 0; i < this.loadQueue.length; i++) {
            const ldata = this.loadQueue[i];
            if (ldata.key == aKey) {
                this.logWarn(`itemExists ${aKey}:`);
                console.log(ldata);
                return true;
            }
        }
        return false;
    }

    atlasJSONArray(aKey: string, imgFile: string, aJSONFile: string) {
        if (this.isItemExists(aKey)) return;
        this.loadQueue.push({ type: TYPE_ATLAS_JSON, key: aKey, img: imgFile, json: aJSONFile });
    }

    texture(aKey: string, imgFile: string) {
        // add prefix
        aKey = TEXTURE_PREF + aKey;
        if (this.isItemExists(aKey)) {
            this.logDebug(`Clone texture Key (${aKey}) load request: aborted.`);
            return;
        }
        this.loadQueue.push({ type: TYPE_TEXTURE, key: aKey, img: imgFile });
    }

    /**
     * Load CubeTexture via CubeTextureLoader
     * @param aKey alias
     * @param files [px, nx, py, ny, pz, nz]
     * @returns 
     */
    cubeTexture(aKey: string, files: string[]) {
        // add prefix
        //aKey = CUBE_TEXTURE_PREF + aKey;
        if (this.isItemExists(aKey)) return;
        this.loadQueue.push({ type: TYPE_CUBE_TEXTURE, key: aKey, img: files });
    }

    private obj(aKey: string, objFile: string) {
        this.loadQueue.push({ type: TYPE_OBJ, key: aKey, obj: objFile });
    }

    private fbx(aKey: string, fbxFile: string) {
        this.loadQueue.push({ type: TYPE_FBX, key: aKey, fbx: fbxFile });
    }

    private glb(aKey: string, glbFile: string) {
        this.loadQueue.push({ type: TYPE_GLB, key: aKey, obj: glbFile });
    }

    model(aKey: string, modelFile: string) {
        if (this.isItemExists(aKey)) {
            this.logDebug(`Clone model Key (${aKey}) load request: aborted.`);
            return;
        }

        var postfix = modelFile.substr(modelFile.length - 3, 3).toLowerCase();
        if (postfix == '.gz') {
            postfix = modelFile.substr(modelFile.length - 6, 3).toLowerCase();
        }
        this.logDebug('postfix = ' + postfix);
        switch (postfix) {
            case TYPE_OBJ:
                this.obj(aKey, modelFile);
                break;

            case TYPE_FBX:
                this.fbx(aKey, modelFile);
                break;

            case TYPE_GLB:
                this.glb(aKey, modelFile);
                break;

            default:
                this.logWarn('TJSLoader unknown model file: ' + postfix);
                break;
        }
    }

    json(aKey: string, aUrl: string) {
        aKey = JSON_PREF + aKey;
        if (this.isItemExists(aKey)) {
            this.logWarn('ThreeLoader.json(): key already exists: ' + aKey);
            return;
        }
        this.loadQueue.push({ type: TYPE_JSON, key: aKey, url: aUrl });
    }

    addText(aKey: string, fontFile: string) {
        this.logDebug('LOAD addText start...');
        if (this.isItemExists(aKey)) {
            this.logWarn('Load addText itemExists!');
            return;
        }
        this.loadQueue.push({ type: TYPE_FONT, key: aKey, file: fontFile });
    }

    start() {
        if (!this._isLoaded) return;
        this._isLoaded = false;
        this.curr_item = 0;
        this.total_items = this.loadQueue.length;

        if (this.total_items <= 0) {
            this.loadComplete();
            return;
        }

        if (this._isParallel) {
            for (let i = 0; i < this.loadQueue.length; i++) {
                const ldata = this.loadQueue[i];
                this.loadByData(ldata);
            }
        }
        else {
            this.nextLoad();
        }
    }

    private loadComplete() {
        this._isLoaded = true;
        this.loadQueue = [];
        this.onLoadCompleteSignal.dispatch();
    }

    private nextLoad() {
        this.currLoadData = this.loadQueue.shift();
        this.loadByData(this.currLoadData);
    }

    private loadByData(aData: any) {
        switch (aData.type) {
            case TYPE_ATLAS_JSON:
                //this.loadAtlasJSONArray(aData.key, aData.img, aData.json);
                break;

            case TYPE_TEXTURE:
                this.loadTexture(aData.key, aData.img);
                break;

            case TYPE_CUBE_TEXTURE:
                this.loadCubeTexture(aData.key, aData.img);
                break;

            case TYPE_OBJ:
                this.loadObj(aData.key, aData.obj);
                break;

            case TYPE_FBX:
                this.loadFBX(aData.key, aData.fbx);
                break;

            case TYPE_GLB:
                this.loadGLB(aData.key, aData.obj);
                break;

            case TYPE_JSON:
                this.loadJSON(aData.key, aData.url);
                break;

            case TYPE_FONT:
                this.loadFont(aData.key, aData.file);
                break;

            default:
                this.logError('ThreeLoader: unknown data type: ' + aData.type);
                break;
        }
    }

    private onItemLoaded() {
        this.curr_item++;
        this.onLoadUpdateSignal.dispatch(100 * this.curr_item / this.total_items);

        if (this.curr_item >= this.total_items) {
            this.loadComplete();
            return;
        }

        if (!this._isParallel) {
            this.nextLoad();
        }
    }

    loadSingleTexture(aKey: string, aImg: string, onComplete: Function, isRepeat = false) {
        if (!isRepeat)
            aKey = TEXTURE_PREF + aKey;
        let cache = this.cache;
        let loader = new THREE.TextureLoader();
        loader.crossOrigin = "Anonymous";
        loader.load(aImg,
            (tex: THREE.Texture) => {
                // loaded
                if (this.isDebugMode) console.log('loadSingleTexture: complete (' + aKey + '):', tex);
                cache[aKey] = tex;
                if (onComplete) onComplete();
            },
            null,
            (err) => {
                // error
                if (this.retryCount > 0) {
                    if (!this.retryCounter[aKey]) this.retryCounter[aKey] = 0;
                    this.retryCounter[aKey]++;
                    if (this.retryCounter[aKey] <= this.retryCount) {
                        this.logWarn(`loadSingleTexture: retry loading ${this.retryCounter[aKey]} (${aKey})`);
                        setTimeout(() => {
                            this.loadSingleTexture(aKey, aImg, onComplete, true);
                        }, 100);
                    }
                    else {
                        this.logError(`loadSingleTexture error (try cnt ${this.retryCount}):`);
                        console.log(err);
                    }
                }
                else {
                    this.logError('loadSingleTexture error:');
                    console.log(err);
                }
            });
    }

    private loadTexture(aKey: string, aFile: string) {
        let loader = new THREE.TextureLoader();
        loader.crossOrigin = "Anonymous";
        loader.load(aFile,
            (tex: THREE.Texture) => {
                // loaded
                if (this.textureMapping) {
                    tex.mapping = this.textureMapping;
                }
                if (this.textureEncoding) {
                    tex.encoding = this.textureEncoding;
                }
                if (this.isDebugMode) console.log(`loadTexture: load complete (${aKey}) file(${aFile}):`, tex);
                this.cache[aKey] = tex;
                this.onItemLoaded();
            },
            null,
            (err) => {
                // error
                if (this.retryCount > 0) {
                    if (!this.retryCounter[aKey]) this.retryCounter[aKey] = 0;
                    this.retryCounter[aKey]++;
                    if (this.retryCounter[aKey] <= this.retryCount) {
                        this.logWarn(`loadTexture: retry loading ${this.retryCounter[aKey]} (${aKey})`);
                        setTimeout(() => {
                            this.loadTexture(aKey, aFile);
                        }, 100);
                    }
                    else {
                        this.logError(`loadTexture error (try cnt ${this.retryCount}):`);
                        console.log(err);
                    }
                }
                else {
                    this.logError('loadTexture error:');
                    this.logError(`key: ${aKey}; file: ${aFile};`);
                    console.log(err);
                }
            });
    }

    private loadCubeTexture(aKey: string, aFiles: string[]) {
        let cache = this.cache;
        let loader = new THREE.CubeTextureLoader();
        loader.crossOrigin = "Anonymous";
        loader.load(aFiles,
            (tex: THREE.CubeTexture) => {
                // loaded
                if (this.textureEncoding) {
                    tex.encoding = this.textureEncoding;
                }
                if (this.isDebugMode) console.log(`loadCubeTexture: load complete (${aKey}):`, tex);
                cache[aKey] = tex;
                this.onItemLoaded();
            },
            null,
            (err) => {
                // error
                if (this.retryCount > 0) {
                    if (!this.retryCounter[aKey]) this.retryCounter[aKey] = 0;
                    this.retryCounter[aKey]++;
                    if (this.retryCounter[aKey] <= this.retryCount) {
                        this.logWarn(`loadCubeTexture: retry loading ${this.retryCounter[aKey]} (${aKey})`);
                        setTimeout(() => {
                            this.loadCubeTexture(aKey, aFiles);
                        }, 100);
                    }
                    else {
                        this.logError(`loadCubeTexture error (try cnt ${this.retryCount}):`);
                        console.log(err);
                    }
                }
                else {
                    this.logError('loadCubeTexture error:');
                    this.logError(`key: ${aKey};`);
                    console.log(`files: `, aFiles);
                    console.log(err);
                }
            });
    }

    private loadObj(aKey: string, aObjFile: string) {
        var loader = new OBJLoader();
        loader.load(aObjFile,
            (aObj: THREE.Group) => {
                this.cache[aKey] = aObj;
                if (this.isDebugMode) console.log('loadObj: load complete (' + aKey + '):', aObj);
                this.onItemLoaded();
            },
            (xhr) => {
                //debug('OBJ loading progress: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                if (this.retryCount > 0) {
                    if (!this.retryCounter[aKey]) this.retryCounter[aKey] = 0;
                    this.retryCounter[aKey]++;
                    if (this.retryCounter[aKey] <= this.retryCount) {
                        this.logWarn(`loadObj: retry loading ${this.retryCounter[aKey]} (${aKey})`);
                        setTimeout(() => {
                            this.loadObj(aKey, aObjFile);
                        }, 100);
                    }
                    else {
                        this.logError(`loadObj error (try cnt ${this.retryCount}):`);
                        console.log(error);
                    }
                }
                else {
                    this.logError('loadObj error:');
                    console.log(error);
                }
            }
        );
    }

    private loadFBX(aKey: string, aFbxFile: string) {
        let loader = new FBXLoader();
        loader.load(aFbxFile,
            (aObj: THREE.Group) => {
                if (this.isDebugMode) console.log('loadFBX: load complete (' + aKey + '):', aObj);
                this.cache[aKey] = aObj;
                this.onItemLoaded();
            },
            (xhr) => {
                //debug('FBX loading progress: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                if (this.retryCount > 0) {
                    if (!this.retryCounter[aKey]) this.retryCounter[aKey] = 0;
                    this.retryCounter[aKey]++;
                    if (this.retryCounter[aKey] <= this.retryCount) {
                        this.logWarn(`loadFBX: retry loading ${this.retryCounter[aKey]} (${aKey})`);
                        setTimeout(() => {
                            this.loadFBX(aKey, aFbxFile);
                        }, 100);
                    }
                    else {
                        this.logError(`loadFBX error (try cnt ${this.retryCount}):`);
                        console.log(error);
                    }
                }
                else {
                    this.logError('loadFBX error:');
                    console.log(error);
                }
            }
        );
    }

    private loadGLB(aKey: string, aGlbFile: string) {
        let loader = new GLTFLoader();
        loader.load(aGlbFile,
            (aObj: GLTF) => {
                this.cache[aKey] = aObj;
                if (this.isDebugMode) console.log(`loadGLB: load complete (${aKey}):`, aObj);
                this.onItemLoaded();
            },
            (xhr) => {
                //if (xhr.total > 0) this.logDebug('GLB loading progress: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                if (this.retryCount > 0) {
                    if (!this.retryCounter[aKey]) this.retryCounter[aKey] = 0;
                    this.retryCounter[aKey]++;
                    if (this.retryCounter[aKey] <= this.retryCount) {
                        this.logWarn(`loadGLB: retry loading ${this.retryCounter[aKey]} (${aKey})`);
                        setTimeout(() => {
                            this.loadGLB(aKey, aGlbFile);
                        }, 100);
                    }
                    else {
                        this.logError(`loadGLB failed: number of tries: ${this.retryCount}`);
                        this.logError(`key: ${aKey}; file: ${aGlbFile};`);
                        console.log(error);
                    }
                }
                else {
                    this.logError(`loadGLB error:`);
                    this.logError(`key: ${aKey}; file: ${aGlbFile};`);
                    console.log(error);
                }
            }
        );
    }

    private loadJSONFromUrl(url: string, aCallback: Function) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('X-Requested-With', 'true');
        xhr.setRequestHeader('Accept', HEADERS.json);
        xhr.onload = function () {
            let status = xhr.status;
            if (xhr.readyState === 4 && status >= 400 && status <= 599) { // Handle HTTP status codes of 4xx and 5xx as errors, even if xhr.onerror was not called.
                aCallback(status, xhr.response);
            }
            else {
                aCallback(null, xhr.response);
            }
        };
        xhr.send();
    }

    private loadJSON(aKey: string, url: string) {
        this.loadJSONFromUrl(url,
            (error, aData) => {
                if (error !== null) {
                    if (this.retryCount > 0) {
                        if (!this.retryCounter[aKey]) this.retryCounter[aKey] = 0;
                        this.retryCounter[aKey]++;
                        if (this.retryCounter[aKey] <= this.retryCount) {
                            this.logWarn(`loadJSON: retry loading ${this.retryCounter[aKey]} (${aKey})`);
                            setTimeout(() => {
                                this.loadJSON(aKey, url);
                            }, 100);
                        }
                        else {
                            this.logError(`loadJSON error (try cnt ${this.retryCount}):`);
                            console.log(error);
                        }
                    }
                    else {
                        this.logError('loadJSON error:');
                        console.log(error);
                    }
                }
                else {
                    this.cache[aKey] = aData;
                    if (this.isDebugMode) console.log(`loadJSON: load complete (${aKey}):`, aData);
                    this.onItemLoaded();
                }
            }
        );
    }

    private loadFont(aKey: string, aFile: string) {
        let fontLoader = new FontLoader();
        fontLoader.load(aFile,
            (aFont) => {
                this.cache[aKey] = aFont;
                if (this.isDebugMode) console.log(`loadFont: load complete (${aKey}):`, aFont);
                this.onItemLoaded();
            },
            (event) => {
                // on progress event
            },
            (error) => {
                if (this.retryCount > 0) {
                    if (!this.retryCounter[aKey]) this.retryCounter[aKey] = 0;
                    this.retryCounter[aKey]++;
                    if (this.retryCounter[aKey] <= this.retryCount) {
                        this.logWarn(`loadFont: retry loading ${this.retryCounter[aKey]} (${aKey})`);
                        setTimeout(() => {
                            this.loadFont(aKey, aFile);
                        }, 100);
                    }
                    else {
                        this.logError(`loadFont error (try cnt ${this.retryCount}):`);
                        console.log(error);
                    }
                }
                else {
                    this.logError(`loadFont error:`);
                    console.log(error);
                }
            }
        );
    }


    getTexture(aKey: string): THREE.Texture {
        aKey = TEXTURE_PREF + aKey;
        let data = this.cache[aKey];
        if (!data) this.logWarn('ThreeLoader.getTexture() key not found: ' + aKey);
        return data;
    }

    getCubeTexture(aKey: string): THREE.CubeTexture {
        let data = this.cache[aKey];
        if (!data) this.logWarn('ThreeLoader.getCubeTexture() key not found: ' + aKey);
        return data;
    }

    /**
     * Get model for .obj .fbx
     */
    getModel(aKey: string): THREE.Group {
        let data = this.cache[aKey];
        if (!data) this.logWarn('ThreeLoader.getModelOBJ() key not found: ' + aKey);
        if (data instanceof THREE.Group) {
            return data.clone(true);
        }
        else {
            this.logWarn(`ThreeLoader.getModel() data for key (${aKey}) is not THREE.Group, use anothe method!`);
            return null;
        }
    }

    getModelGLB(aKey: string, isFullData = false): any {
        let data = this.cache[aKey];
        if (!data) {
            this.logWarn('ThreeLoader.getModelGLB() key not found: ' + aKey);
            return;
        }

        if (data.scene && data.scene instanceof THREE.Group) {
            if (isFullData) return data;
            return data.scene.clone(true);
        }
        else {
            this.logWarn(`ThreeLoader.getModelGLB() data for key (${aKey}) is not GLB format, use anothe method!`);
            return null;
        }
    }

    getJSON(aKey: string): any {
        aKey = JSON_PREF + aKey;
        let data = this.cache[aKey];
        if (!data) this.logWarn('ThreeLoader.getJSON() key not found: ' + aKey);
        return data;
    }

    getFont(aKey: string): any {
        let font = this.cache[aKey];
        if (!font) this.logWarn('ThreeLoader.getFont() key not found: ' + aKey);
        return font;
    }

}