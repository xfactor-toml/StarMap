import * as THREE from "three";
import { ThreeLoader } from "../loaders/ThreeLoader";
import gsap from "gsap";

export type StarPointParams = {
    name: string;
    starId: number;
    baseScale: number;
};

export class StarPoint extends THREE.Group {

    private _params: StarPointParams;
    private _starPointSprite: THREE.Sprite;

    constructor(aParams: StarPointParams) {

        super();
        this._params = aParams;

        let loader = ThreeLoader.getInstance();

        let previewTexture = loader.getTexture('starPoint');
        let previewMaterial = new THREE.SpriteMaterial({
            map: previewTexture,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
            // blending: THREE.AdditiveBlending
        });

        this._starPointSprite = new THREE.Sprite(previewMaterial);

        this._starPointSprite.scale.set(12, 12, 12);
        this._starPointSprite[`name`] = 'starPoint';
        this._starPointSprite[`starId`] = this._params.starId;
        this.add(this._starPointSprite);

    }

    public show(aDur: number, aDelay: number) {
        const starPointSprite = this._starPointSprite;
        gsap.to([starPointSprite.material], {
            opacity: 1,
            duration: aDur,
            delay: aDelay,
            ease: 'sine.out',
            onStart: () => {
                starPointSprite.visible = true;
            }
        });
    }

    public hide(aDur: number) {
        const starPointSprite = this._starPointSprite;
        gsap.to([starPointSprite.material], {
            opacity: 0,
            duration: aDur,
            ease: 'sine.in',
            onComplete: () => {
                starPointSprite.visible = false;
            }
        });
    }

}