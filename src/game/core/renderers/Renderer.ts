import * as THREE from "three";
import { ILogger } from "../interfaces/ILogger";
import { LogMng } from "../../utils/LogMng";

export type RendererParams = {
    domCanvasParent: HTMLElement,
    scene?: THREE.Scene,
    camera?: THREE.Camera,
    bgColor: number,
    debugMode?: boolean
};

export abstract class Renderer implements ILogger {

    protected _domCanvasParent: HTMLElement;
    protected _scene: THREE.Scene;
    protected _camera: THREE.Camera;
    protected _bgColor: THREE.Color;
    protected _renderer: THREE.WebGLRenderer;
    protected _debugMode = false;

    constructor(aParams: RendererParams) {
        this._domCanvasParent = aParams.domCanvasParent;
        this._scene = aParams.scene;
        this._camera = aParams.camera;
        this._bgColor = new THREE.Color(aParams.bgColor);
        this._debugMode = aParams.debugMode;
    }

    public get renderer(): THREE.WebGLRenderer {
        return this._renderer;
    }

    public set scene(v: THREE.Scene) {
        this._scene = v;
    }

    public get scene(): THREE.Scene {
        return this._scene;
    }

    public set camera(v: THREE.Camera) {
        this._camera = v;
    }

    public get camera(): THREE.Camera {
        return this._camera;
    }

    logDebug(aMsg: string, aData?: any): void {
        LogMng.debug(`Renderer: ${aMsg}`, aData);
    }
    logWarn(aMsg: string, aData?: any): void {
        LogMng.warn(`Renderer: ${aMsg}`, aData);
    }
    logError(aMsg: string, aData?: any): void {
        LogMng.error(`Renderer: ${aMsg}`, aData);
    }

    protected abstract initRenderer(...params): void;
    abstract onWindowResize(w: number, h: number): void;
    abstract free(): void;
    abstract render(): void;

}