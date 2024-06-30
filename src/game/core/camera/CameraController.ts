import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MyMath } from "../../../monax/MyMath";

type OrbitControllerParams = {
    // enabled?: boolean,
    rotateSpeed?: number,
    enableDamping?: boolean,
    dampingFactor?: number,
    zoomSpeed?: number,
    enablePan?: boolean,
    panRadius?: number,
    minDist?: number,
    maxDist?: number,
    stopAngleTop?: number,
    stopAngleBot?: number,
    autoRotate?: boolean,
    autoRotateSpeed?: number,
    panLimits?: {
        x?: {
            min: number,
            max: number
        },
        y?: {
            min: number,
            max: number
        },
        z?: {
            min: number,
            max: number
        }
    }
}

export type CameraControllerParams = {
    domElement: HTMLElement,
    camera: THREE.Camera,
    orbitController?: OrbitControllerParams
}

export class CameraController {

    protected _domElement: HTMLElement;
    protected _camera: THREE.Camera;

    protected _orbitControllerParams: OrbitControllerParams;
    protected _orbitController: OrbitControls;
    protected _orbitTarget: THREE.Vector3;

    constructor(aParams: CameraControllerParams) {
        this._domElement = aParams.domElement;
        this._camera = aParams.camera;
        this._orbitControllerParams = aParams.orbitController;
        this._orbitTarget = new THREE.Vector3();
    }

    protected initOrbitControl(aParams: OrbitControllerParams) {
        if (this._orbitController) return;
        this._orbitController = new OrbitControls(this._camera, this._domElement);
        // this._orbitControl.enabled = aParams.enabled;
        this._orbitController.rotateSpeed = .5;
        this._orbitController.enableDamping = true;
        this._orbitController.dampingFactor = .9;
        this._orbitController.zoomSpeed = aParams.zoomSpeed || 1;
        this._orbitController.enablePan = aParams.enablePan == true;
        this._orbitController.minDistance = aParams.minDist || 1;
        this._orbitController.maxDistance = aParams.maxDist || 100;
        this._orbitController.minPolarAngle = MyMath.toRadian(aParams.stopAngleTop || 0);
        this._orbitController.maxPolarAngle = MyMath.toRadian(aParams.stopAngleBot || 0);
        this._orbitController.autoRotateSpeed = aParams.autoRotateSpeed;
        this._orbitController.autoRotate = aParams.autoRotate;
        this._orbitController.target = this._orbitTarget;
        this._orbitController.addEventListener('change', this.onOrbitCtrlChange.bind(this));
        this._orbitController.update();
    }

    protected freeOrbitControl() {
        if (this._orbitController) {
            this._orbitController.enabled = false;
            this._orbitController.dispose();
            this._orbitController = null;
        }
    }

    protected onOrbitCtrlChange(e: THREE.Event) {
        let panLimits = this._orbitControllerParams.panLimits;
        if (panLimits) {
            if (panLimits.x) this._orbitController.target.x = MyMath.clamp(this._orbitController.target.x, panLimits.x.min, panLimits.x.max);
            if (panLimits.y) this._orbitController.target.y = MyMath.clamp(this._orbitController.target.y, panLimits.y.min, panLimits.y.max);
            if (panLimits.z) this._orbitController.target.z = MyMath.clamp(this._orbitController.target.z, panLimits.z.min, panLimits.z.max);
        }
    }
    
    enableOrbitController() {
        this.initOrbitControl(this._orbitControllerParams);
    }

    disableOrbitController() {
        this.freeOrbitControl();
    }

    free() {
        this.freeOrbitControl();
        this._orbitTarget = null;
        this._camera = null;
        this._domElement = null;
    }

    update(dt: number) {
        this._orbitController?.update();
    }

}