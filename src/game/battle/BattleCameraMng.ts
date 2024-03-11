import * as THREE from 'three';
import { MyOrbitControls } from "../mythree/MyOrbitControls";
import { MyEventDispatcher } from '../basics/MyEventDispatcher';
import { IUpdatable } from '../interfaces/IUpdatable';
import { FSM } from '../states/FSM';
import { Settings } from '../data/Settings';
import { MyMath } from '../utils/MyMath';
import gsap from 'gsap';

type BattleCameraMode = 'static' | 'orbit';

type MoveData = {
    aCamPos,
    aTargetPos?,
    duration?: number,
}

enum States {
    Idle = 'Idle',
    Moving = 'Moving',
}

export class BattleCameraMng extends MyEventDispatcher implements IUpdatable {
    private _camera: THREE.PerspectiveCamera;
    private _cameraTarget: THREE.Vector3;
    private _orbitControl: MyOrbitControls;
    private _mode: BattleCameraMode;
    private _fsm: FSM;

    constructor(aParams: {
        camera: THREE.PerspectiveCamera,
        cameraTarget: THREE.Vector3,
    }) {
        super('BattleCameraMng');

        this._camera = aParams.camera;
        this._cameraTarget = aParams.cameraTarget;

        // this.initOrbitController();

        this._fsm = new FSM();
        this._fsm.addState(States.Idle, this, this.onIdleEnter, this.onIdleUpdate);
        this._fsm.addState(States.Moving, this, this.onMovingEnter, this.onMovingUpdate);

        this._fsm.startState(States.Idle);
        this.mode = 'static';

    }

    private initOrbitController(aParams?: {
        // enabled?: boolean,
        zoomSpeed?: number,
        enablePan?: boolean,
        panRadius?: number,
        minDist?: number,
        maxDist?: number,
        stopAngleTop?: number,
        stopAngleBot?: number
    }) {

        if (this._orbitControl) return;
        if (!aParams) aParams = {};
        let domElement = Settings.domRenderer;
        this._orbitControl = new MyOrbitControls(this._camera, domElement);
        this._orbitControl.enabled = false;
        this._orbitControl.rotateSpeed = .5;
        this._orbitControl.enableDamping = true;
        this._orbitControl.dampingFactor = Settings.CAM_DAMPING_FACTOR;
        this._orbitControl.zoomSpeed = aParams.zoomSpeed || 1;
        this._orbitControl.enablePan = aParams.enablePan == true;
        this._orbitControl.minDistance = aParams.minDist || 1;
        this._orbitControl.maxDistance = aParams.maxDist || 100;
        this._orbitControl.minPolarAngle = MyMath.toRadian(aParams.stopAngleTop || 0);
        this._orbitControl.maxPolarAngle = MyMath.toRadian(aParams.stopAngleBot || 0);
        this._orbitControl.target = this._cameraTarget;
        
    }

    private updateAccordingMode() {
        switch (this._fsm.getCurrentState().name) {
            case States.Idle:
                switch (this._mode) {
                    case 'static':
                        if (this._orbitControl) this._orbitControl.enabled = false;
                        break;
                    case 'orbit':
                        if (this._orbitControl) this._orbitControl.enabled = true;
                        break;
                }
                break;
        }
    }

    private onIdleEnter() {

    }

    private onIdleUpdate() {
        if (this._orbitControl?.enabled) {
            this._orbitControl.update();
        }
        else {
            this._camera.lookAt(this._cameraTarget);
        }
    }

    private onMovingEnter(aData: MoveData) {

        let cp = aData.aCamPos;
        let tp = aData.aTargetPos;

        if (aData.duration > 0) {
            gsap.to(this._camera.position, {
                x: cp.x,
                y: cp.y,
                z: cp.z,
                duration: aData.duration,
                ease: 'sine.inOut',
                onComplete: () => {
                    this._fsm.startState(States.Idle);
                }
            });
            if (tp) {
                gsap.to(this._cameraTarget, {
                    x: tp.x,
                    y: tp.y,
                    z: tp.z,
                    duration: aData.duration,
                    ease: 'sine.inOut'
                });
            }
        }
        else {
            this._camera.position.set(cp.x, cp.y, cp.z);
            if (tp) this._cameraTarget.set(tp.x, tp.y, tp.z);
            this._fsm.startState(States.Idle);
        }
    }

    private onMovingUpdate(dt: number) {
        this._camera.lookAt(this._cameraTarget);
    }

    public get mode(): BattleCameraMode {
        return this._mode;
    }
    public set mode(value: BattleCameraMode) {
        if (this._mode == value) return;
        this._mode = value;
        this.updateAccordingMode();
    }

    moveTo(aParams: MoveData) {
        this._fsm.startState(States.Moving, aParams);
    }

    update(dt: number) {
        this._fsm.update(dt);
    }

}