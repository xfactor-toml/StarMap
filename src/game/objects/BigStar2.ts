import * as THREE from "three";
import { ThreeLoader } from "../utils/threejs/ThreeLoader";
import * as datGui from "dat.gui";
import vsSun from '../shaders/sunTextured/vert.glsl';
import fsSun from '../shaders/sunTextured/frag.glsl';
import { ThreeUtils } from "../utils/threejs/ThreejsUtils";

export type BigStar2Params = {
    starSize: number;
    galaxyColor: { r, g, b };
    mainColor?: { r, g, b };
    coronaColor?: { r, g, b };
};

export class BigStar2 extends THREE.Group {

    private _parentPos: THREE.Vector3;
    private _camera: THREE.Camera;
    private _starScale: number;
    private _params: BigStar2Params;
    private _light: THREE.PointLight;
    private _mesh: THREE.Mesh;
    private _uniforms: any;
    // debug
    private _gui: datGui.GUI;
    private _guiFolder: datGui.GUI;
    private _guiControllers: datGui.GUIController[];

    constructor(aParentPos: THREE.Vector3, aCamera: THREE.Camera, aStarScale: number, aParams: BigStar2Params) {

        super();

        this._parentPos = aParentPos;
        this._camera = aCamera;
        this._starScale = aStarScale;
        this._params = aParams;

        if (!this._params.mainColor) this._params.mainColor = { r: .9, g: .6, b: .3 };
        if (!this._params.coronaColor) this._params.coronaColor = { r: .9, g: .3, b: .1 };

        // RGB
        let centerClr = this._params.mainColor;
        let coronaClr = this._params.coronaColor;

        let loader = ThreeLoader.getInstance();
        let tSun = loader.getTexture('sun_surf');

        this._uniforms = {
            tSun: { value: tSun },
            centerColor: { value: { x: centerClr.r, y: centerClr.g, z: centerClr.b } },
            coronaColor: { value: { x: coronaClr.r, y: coronaClr.g, z: coronaClr.b } },
            coronaNoiseParam1: { value: 3.0 },
            coronaNoiseParam2: { value: 4.0 },
            coronaResolution: { value: 25 },
            iTime: { value: 0 },
            mx: { value: 0 },
            my: { value: 0 },
        };

        let shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vsSun,
            fragmentShader: fsSun,
            uniforms: this._uniforms,
            transparent: true,
            depthWrite: false,
            // blending: THREE.NormalBlending
        });

        let size = (this._params.starSize || 1) * this._starScale;
        let geom = new THREE.PlaneGeometry(size, size);
        this._mesh = new THREE.Mesh(geom, shaderMaterial);
        this.add(this._mesh);
    }

    public get starScale(): number {
        return this._starScale;
    }

    public set starScale(v: number) {
        this._starScale = v;
        if (this._mesh) this._mesh.scale.set(v, v, 1);
    }

    createDebugGui(aGui: datGui.GUI) {

        const GUI_PARAMS = {
            // coronaColor: MyMath.rgbToHex(this._uniforms.coronaColor.value.x * 255, this._uniforms.coronaColor.value.y * 255, this._uniforms.coronaColor.value.z * 255),
            coronaColor: {
                r: this._params.mainColor.r * 255,
                g: this._params.mainColor.g * 255,
                b: this._params.mainColor.b * 255
            },
            // centerColor: MyMath.rgbToHex(this._uniforms.centerColor.value.x * 255, this._uniforms.centerColor.value.y * 255, this._uniforms.centerColor.value.z * 255),
            centerColor: {
                r: this._params.coronaColor.r * 255,
                g: this._params.coronaColor.g * 255,
                b: this._params.coronaColor.b * 255
            },
            coronaNoiseParam1: this._uniforms.coronaNoiseParam1.value,
            coronaNoiseParam2: this._uniforms.coronaNoiseParam2.value,
            coronaResolution: this._uniforms.coronaResolution.value,
        }

        let gui = this._gui = aGui;

        this._guiFolder = gui.addFolder('Star');
        this._guiControllers = [];

        let ctrl = gui.addColor(GUI_PARAMS, 'centerColor').onChange((v) => {
            // let rgb = MyMath.hexToRGB(v);
            let rgb = v;
            this._uniforms.centerColor.value.x = rgb.r / 255;
            this._uniforms.centerColor.value.y = rgb.g / 255;
            this._uniforms.centerColor.value.z = rgb.b / 255;
            console.log('centerColor:', this._uniforms.centerColor.value);
        });
        this._guiControllers.push(ctrl);
        
        ctrl = gui.addColor(GUI_PARAMS, 'coronaColor').onChange((v) => {
            // let rgb = MyMath.hexToRGB(v);
            let rgb = v;
            this._uniforms.coronaColor.value.x = rgb.r / 255;
            this._uniforms.coronaColor.value.y = rgb.g / 255;
            this._uniforms.coronaColor.value.z = rgb.b / 255;
            console.log('coronaColor:', this._uniforms.coronaColor.value);
            
        });
        this._guiControllers.push(ctrl);

        ctrl = gui.add(GUI_PARAMS, 'coronaNoiseParam1', 1, 6, 0.01).onChange(() => {
            this._uniforms.coronaNoiseParam1.value = GUI_PARAMS.coronaNoiseParam1;
        });
        this._guiControllers.push(ctrl);

        ctrl = gui.add(GUI_PARAMS, 'coronaNoiseParam2', 0.5, 6, 0.01).onChange(() => {
            this._uniforms.coronaNoiseParam2.value = GUI_PARAMS.coronaNoiseParam2;
        });
        this._guiControllers.push(ctrl);

        ctrl = gui.add(GUI_PARAMS, 'coronaResolution', 1, 100, 1).onChange(() => {
            this._uniforms.coronaResolution.value = GUI_PARAMS.coronaResolution;
        });
        this._guiControllers.push(ctrl);

    }

    updateStar(aParams: BigStar2Params) {
        this._params = aParams;
        if (!this._params.mainColor) this._params.mainColor = { r: .9, g: .6, b: .3 };
        if (!this._params.coronaColor) this._params.coronaColor = { r: .9, g: .3, b: .1 };
        // RGB
        let centerClr = this._params.mainColor;
        let coronaClr = this._params.coronaColor;
        this._uniforms.centerColor.value = { x: centerClr.r, y: centerClr.g, z: centerClr.b };
        this._uniforms.coronaColor.value = { x: coronaClr.r, y: coronaClr.g, z: coronaClr.b };
    }

    free() {
        // debug gui
        if (this._gui) {
            for (let i = 0; i < this._guiControllers.length; i++) {
                const gctrl = this._guiControllers[i];
                this._gui.remove(gctrl);
            }
            this._gui.removeFolder(this._guiFolder);
        }
        this._gui = null;
        this._guiFolder = null;
        this._guiControllers = null;

        this._parentPos = null;
        this._camera = null;
        this._params = null;
        if (this._light) {
            this._light.dispose();
        }
        this._light = null;
        if (this._mesh) {
            ThreeUtils.removeAndDispose(this._mesh);
        }
        this._mesh = null;
        this._uniforms = null;

    }

    update(dt: number) {

        this._uniforms.iTime.value += dt;

        let camera = this._camera;
        if (camera) {
            this._mesh.quaternion.copy(camera.quaternion);
            let p = camera.position.clone().sub(this._parentPos).normalize();
            this._uniforms.mx.value = Math.atan2(p.z, p.x);
            this._uniforms.my.value = Math.atan2(Math.sqrt(p.x * p.x + p.z * p.z), p.y);
        }
    }

}