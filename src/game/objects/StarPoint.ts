import * as THREE from "three";
import gsap from "gsap";
import { Callbacks } from "../utils/events/Callbacks";
import { GalaxyStarParams } from "~/game/data/Types";
import { DB } from "~/game/data/DB";
import { ThreeLoader } from "../utils/threejs/ThreeLoader";

export type StarPointParams = {
    baseScale: number;
    camera: THREE.PerspectiveCamera;
    maxAlpha?: number;
    starParams: GalaxyStarParams;
    scaleFactor: number;
    isPhantom: boolean;
};

export class StarPoint extends THREE.Group {

    private _params: StarPointParams;
    private _starPointSprite: THREE.Sprite;
    private _cameraScale = 1;
    private _scaleFactor = 1;

    constructor(aParams: StarPointParams) {

        super();
        this._params = aParams;

        let loader = ThreeLoader.getInstance();

        let clr = DB.getStarPointColorByLevel(this._params.starParams.starInfo.level);
        if (this._params.isPhantom) clr = DB.getStarPointColorPhantom();

        let previewTexture = loader.getTexture('starPoint');
        // previewTexture.magFilter = THREE.NearestFilter;
        // previewTexture.wrapT = previewTexture.wrapS = THREE.MirroredRepeatWrapping;
        let previewMaterial = new THREE.SpriteMaterial({
            map: previewTexture,
            color: clr,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            // blending: THREE.AdditiveBlending
        });

        this._starPointSprite = new THREE.Sprite(previewMaterial);

        this._starPointSprite.scale.set(1, 1, 1);
        this._starPointSprite[`name`] = 'starPoint';
        // this._starPointSprite[`starId`] = this._params.starId;
        // this.updateScale();
        this.updateCameraScale();
        this.add(this._starPointSprite);

    }
    
    public get params(): StarPointParams {
        return this._params;
    }
    
    public get maxOpacity(): number {
        return this._params.maxAlpha || .9;
    }
    
    public set cameraScale(v: number) {
        this._cameraScale = v;
        this.updateScale();
    }
    
    private updateScale() {
        let sc = this._params.baseScale * this._cameraScale;
        this._starPointSprite.scale.set(sc, sc, 1);
    }

    private updateCameraScale() {

        let version = 0;

        switch (version) {

            case 0:

                const minScale = 0.01;
                const maxScale = 25;
                const dtScale = maxScale - minScale;
                const minDist = 2; // 10
                const maxDist = 4000;
                const dtDist = maxDist - minDist;

                let dist = this._params.camera.position.distanceTo(this.position);
                // console.log(`dist:`, dist);

                dist = Math.min(maxDist, Math.max(minDist, dist));

                let perc = (dist - minDist) / dtDist;
                this._cameraScale = minScale + perc * dtScale;

                break;
            
            case 1:

                let dist1 = this._params.camera.position.distanceTo(this.position);
                this._cameraScale = dist1 / 70;

                break;
        }
            
        this.updateScale();

    }
    
    show(aDur: number, aDelay?: number) {
        const starPointSprite = this._starPointSprite;
        gsap.to([starPointSprite.material], {
            opacity: this.maxOpacity,
            duration: aDur,
            delay: aDelay || 0,
            ease: 'sine.out',
            onStart: () => {
                starPointSprite.visible = true;
            }
        });
    }

    hide(aDur: number, aDelay?: number, cb?: Callbacks) {
        const starPointSprite = this._starPointSprite;
        gsap.to([starPointSprite.material], {
            opacity: 0,
            duration: aDur,
            delay: aDelay || 0,
            ease: 'sine.in',
            onComplete: () => {
                starPointSprite.visible = false;
                cb?.onComplete?.call(cb?.context);
            }
        });
    }

    destroy() {
        this.clear();
        this._params = null;
        this._starPointSprite = null;
    }

    update() {
        this.updateCameraScale();
    }

}