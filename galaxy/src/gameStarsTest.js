import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ThreeLoader } from './loaders/ThreeLoader';
import { MyMath } from './utils/MyMath';
import { LogMng } from './utils/LogMng';

import vsFarStars from './shaders/farStars/vs.glsl';
import fsFarStars from './shaders/farStars/fs.glsl';

const Config = {
    isDebugMode: false
};

const SKY_BOX_SIZE = 6000;

const minCameraDistance = 50;
const maxCameraDistance = 350;

let renderer;
let camera;
let scene;
let sceneBg;

let loader;
let clock;

let camOrbit;
let prevCamPolarAngle = 0;
let prevCamAzimutAngle = 0;

let mainGalaxyPlane;
let farStars;


export function initScene() {

    // check #debug
    let anc = window.location.hash.replace("#", "");
    Config.isDebugMode = (anc === "debug");

    // LogMng settings
    if (!Config.isDebugMode) LogMng.setMode(LogMng.MODE_RELEASE);
    LogMng.system('client log mode: ' + LogMng.getMode());

    clock = new THREE.Clock();

    preload(() => {
        setScene();
        animate();
    });
}

function preload(cb) {
    let sb_format = '.png';
    let path = './assets/skybox/black/1024/';

    // ts loader
    loader = ThreeLoader.getInstance({ isDebugMode: true });
    // js loader
    // loader = new ThreeLoader({ isDebugMode: true });

    loader.onLoadCompleteSignal.addOnce(cb);

    loader.texture('skybox1-xpos', path + 'right' + sb_format);
    loader.texture('skybox1-xneg', path + 'left' + sb_format);
    loader.texture('skybox1-ypos', path + 'top' + sb_format);
    loader.texture('skybox1-yneg', path + 'bot' + sb_format);
    loader.texture('skybox1-zpos', path + 'front' + sb_format);
    loader.texture('skybox1-zneg', path + 'back' + sb_format);

    // main sprite
    path = './assets/galaxies/';
    loader.texture('galaxySprite', `./assets/BC10.webp`);

    path = './assets/';
    loader.json('galaxyStructure', `${path}galaxyStructure.json`);

    loader.start();
}

function getFarStarsPositions() {
    const starsCount = 500;
    const systemRadius = 300;
    let stars = [];
    for (var i = 0; i < starsCount; i++) {
        let layer = 0;
        let r = MyMath.randomIntInRange(0, 100);
        if (r < 10) layer = 0;
        else if (r < 30) layer = 1;
        else layer = 2;
        
        let radius = 0;

        switch (layer) {
            case 0:
                radius = MyMath.randomInRange(systemRadius / 2, systemRadius);
                break;
            case 1:
                radius = MyMath.randomInRange(systemRadius, systemRadius * 2);
                break;
            case 2:
                radius = MyMath.randomInRange(systemRadius * 2, systemRadius * 8);
                break;
        }

        let newStarPos = new THREE.Vector3(
            MyMath.randomInRange(-10, 10),
            MyMath.randomInRange(-10, 10),
            MyMath.randomInRange(-10, 10)
        );
        newStarPos.normalize().multiplyScalar(radius);
        stars.push(newStarPos);
    }
    return stars;
}

//threejs functions
function setScene() {
    
    renderer = new THREE.WebGLRenderer();
    // renderer.getContext().getExtension('OES_standard_derivatives');
    renderer.autoClear = false;
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x0);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.5, 100000);
    camera.position.set(-90, 120, 180);

    sceneBg = new THREE.Scene();
    scene = new THREE.Scene();

    createSkybox();

    createCameraControls({
        minDist: minCameraDistance,
        maxDist: maxCameraDistance,
        stopAngleTop: 10,
        stopAngleBot: 170,
        pos: {x: 5, y: 0, z: 0}
    });

    // main galaxy sprite
    mainGalaxyPlane = createMainGalaxy();
    scene.add(mainGalaxyPlane);


    // FAR STARS

    let farStarsGeometry = new THREE.Geometry();
    farStarsGeometry.vertices = getFarStarsPositions();

    let farStarsMaterial = new THREE.ShaderMaterial({
        vertexShader: vsFarStars,
        fragmentShader: fsFarStars,
        uniforms: {
            cameraMovmentPower: { value: [0.0, 0.0] },
        },
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    farStars = new THREE.Points(farStarsGeometry, farStarsMaterial);
    farStars.rotation.set(0, 0, 0);
    scene.add(farStars);

}

function createSkybox() {
    let imagePrefix = "skybox1-";
    let directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    let materialArray = [];
    for (let i = 0; i < directions.length; i++)
        materialArray.push(new THREE.MeshBasicMaterial({
            map: loader.getTexture(imagePrefix + directions[i]),
            side: THREE.BackSide,
            depthWrite: false,
        }));

    let imgArray = [];
    for (let i = 0; i < directions.length; i++)
        imgArray.push(loader.getTexture(imagePrefix + directions[i]).image);

    let skyGeometry = new THREE.BoxBufferGeometry(SKY_BOX_SIZE, SKY_BOX_SIZE, SKY_BOX_SIZE);
    let skyBox = new THREE.Mesh(skyGeometry, materialArray);
    skyBox.position.set(0, 0, 0);
    sceneBg.add(skyBox);
}

function createMainGalaxy() {
    let t = loader.getTexture('galaxySprite');
    let galaxy = new THREE.Mesh(
        new THREE.PlaneGeometry(350, 350),
        new THREE.MeshBasicMaterial({
            map: t,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
            opacity: 1.0,
            blending: THREE.AdditiveBlending
        })
    );
    galaxy.rotation.x = -Math.PI / 2;
    galaxy.rotation.z = -1.2;
    // galaxyPlane.position.y = -1;
    // galaxyPlane.position.z = 9;
    return galaxy;
}

function createCameraControls(aParams) {

    if (camOrbit) return;
    if (!aParams) aParams = {};
    let domElement = renderer.domElement;
    camOrbit = new OrbitControls(camera, domElement);
    if (!aParams.noTarget)
        camOrbit.target = new THREE.Vector3();
    camOrbit.enabled = !(aParams.isOrbitLock == true);
    camOrbit.rotateSpeed = .5;
    camOrbit.enableDamping = true;
    camOrbit.dampingFactor = 0.025;
    camOrbit.zoomSpeed = aParams.zoomSpeed || 1;
    camOrbit.enablePan = aParams.enablePan == true;
    // this.camOrbitCtrl.keys = {};
    camOrbit.minDistance = aParams.minDist || 1;
    camOrbit.maxDistance = aParams.maxDist || 100;
    camOrbit.minPolarAngle = MyMath.toRadian(aParams.stopAngleTop || 0); // Math.PI / 2.5;
    // camOrbit.maxPolarAngle = Math.PI - an;
    camOrbit.maxPolarAngle = MyMath.toRadian(aParams.stopAngleBot || 0);
    if (aParams.pos) {
        camOrbit.target.x = aParams.pos.x || 0;
        camOrbit.target.y = aParams.pos.y || 0;
        camOrbit.target.z = aParams.pos.z || 0;
    }
    camOrbit.update();
    camOrbit.addEventListener('change', () => {
    });
    camOrbit.addEventListener('end', () => {
    });

}

function updateFarStars(dt) {
    let aAngle = camOrbit.getAzimuthalAngle();
    let dtAzimut = aAngle - prevCamAzimutAngle;
    prevCamAzimutAngle = aAngle;

    let pAngle = camOrbit.getPolarAngle();
    let dtPolar = pAngle - prevCamPolarAngle;
    prevCamPolarAngle = pAngle;

    let azFactor = dtAzimut * 10;
    let polFactor = dtPolar * 10;

    farStars.material.uniforms.cameraMovmentPower.value = [azFactor, polFactor];
}

function render() {
    renderer.clear();
    renderer.render(sceneBg, camera);
    renderer.render(scene, camera);
}

function update(dt) {
    let dtMs = dt * 1000;
    
    updateFarStars(dt);

    let polarAngle = camOrbit.getPolarAngle();

    if (mainGalaxyPlane) {
        if (polarAngle < Math.PI / 2) {
            mainGalaxyPlane.material.opacity = 1 - (polarAngle / (Math.PI / 2));
        } else {
            mainGalaxyPlane.material.opacity = 1 - (Math.abs(polarAngle - Math.PI) / (Math.PI / 2));
        }
    }

    camOrbit.update();

    render(dt);
}

function animate() {
    let dt = clock.getDelta();
    update(dt);
    requestAnimationFrame(animate);
}
