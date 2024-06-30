import * as THREE from 'three';
import { ILogger } from "../core/interfaces/ILogger";
import { IUpdatable } from "../core/interfaces/IUpdatable";
import { LogMng } from '../../monax/LogMng';
import { PopupText } from './PopupText';

export class TextViewer implements ILogger, IUpdatable {
    private _className = 'TextViewer';
    private _parent: THREE.Group;
    private _camera: THREE.Camera;
    private _isTopViewPosition = false;

    constructor(aParent: THREE.Group, aCamera: THREE.Camera) {
        this._parent = aParent;
        this._camera = aCamera;
    }

    logDebug(aMsg: string, aData?: any): void {
        LogMng.debug(`${this._className}: ${aMsg}`, aData);
    }

    logWarn(aMsg: string, aData?: any): void {
        LogMng.warn(`${this._className}: ${aMsg}`, aData);
    }

    logError(aMsg: string, aData?: any): void {
        LogMng.error(`${this._className}: ${aMsg}`, aData);
    }

    public get isTopViewPosition() {
        return this._isTopViewPosition;
    }
    public set isTopViewPosition(value) {
        this._isTopViewPosition = value;
    }

    showText(aParams: {
        pos: THREE.Vector3,
        text: string,
        color: number,
        dirrection?: THREE.Vector3
    }) {
        let text = aParams.text;
        let clr = aParams.color;
        const popupText = new PopupText({
            parent: this._parent,
            camera: this._camera,
            position: aParams.pos,
            text: text,
            color: clr
        });
        popupText.animate(1);
    }

    clear() {

    }

    free() {
        this._parent = null;
        this._camera = null;
    }

    update(dt: number) {
        
    }

}