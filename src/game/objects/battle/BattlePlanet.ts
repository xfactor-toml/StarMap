import * as THREE from 'three';
import { BattleObject, BattleObjectData } from './BattleObject';
import { ThreeLoader } from '~/game/utils/threejs/ThreeLoader';
import { TextureAlias } from '~/game/data/TextureData';
import { MyMath } from '@/utils';
import { ThreeUtils } from '~/game/utils/threejs/ThreejsUtils';
import { PlanetAimLine } from './PlanetAimLine';

export class BattlePlanet extends BattleObject {
    protected _mesh: THREE.Mesh;
    protected _settelite: THREE.Mesh;
    protected _setteliteOrbitRadius: number;
    protected _setteliteRadius: number;
    protected _localRotateSpd = 0;
    protected _aimLine: PlanetAimLine;

    constructor(aParams: BattleObjectData) {
        super(aParams, 'BattlePlanet');

        this._setteliteOrbitRadius = this.radius * 2;
        this._setteliteRadius = this.radius / 2;

        this._localRotateSpd = MyMath.randomInRange(-2, 4);

        this.initPlanet();
        this.initSetteliteOrbitLine(this, this._setteliteOrbitRadius, 1, 0x00ffff);
        this.initSettelite(this._setteliteRadius, this._setteliteOrbitRadius);
        this.initDirrectionArea(this._setteliteOrbitRadius, this._setteliteRadius);
        
    }

    private initPlanet() {
        let g = new THREE.SphereGeometry(this.radius);
        let t = ThreeLoader.getInstance().getTexture(TextureAlias.planet0_256);
        let m = new THREE.MeshStandardMaterial({
            map: t
        });
        this._mesh = new THREE.Mesh(g, m);
        this.add(this._mesh);
    }

    private initSettelite(aRadius: number, aOrbitRadius: number) {
        let g = new THREE.SphereGeometry(aRadius);
        let m = new THREE.MeshBasicMaterial({
            color: 0x00ffff
        });
        this._settelite = new THREE.Mesh(g, m);
        this._settelite.position.z = aOrbitRadius;
        this.add(this._settelite);

        this._aimLine = new PlanetAimLine(this, new THREE.Vector3(), new THREE.Vector3(0, 0, 90));

    }

    private initSetteliteOrbitLine(aParent: THREE.Group, aOrbitRadius: number, aLineWidth: number, aColor: number): void {
        let orbitLine = ThreeUtils.drawLineCircle({
            radius: aOrbitRadius,
            lineWidth: aLineWidth,
            color: aColor
        });
        orbitLine.rotation.x = MyMath.toRadian(-90);
        aParent.add(orbitLine);
    }

    private initDirrectionArea(aSetteliteOrbitRadius: number, aSetteliteRadius: number) {
        const areaSize = 20;
        const t = ThreeLoader.getInstance().getTexture(TextureAlias.planetDirrectionArea);
        const geometry = new THREE.PlaneGeometry(areaSize, areaSize);
        const material = new THREE.MeshBasicMaterial({
            map: t,
            transparent: true,
            depthWrite: false
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = MyMath.toRadian(-90);
        mesh.rotation.z = MyMath.toRadian(-90);
        mesh.position.z = areaSize / 2 + aSetteliteOrbitRadius;// + aSetteliteRadius;
        this.add(mesh);
    }

    private updateMeshRotate(dt: number) {
        this._mesh.rotation.y -= dt * this._localRotateSpd;
    }

    showSniperAim() {
        this._aimLine.show();
    }

    hideSniperAim() {
        this._aimLine.hide();
    }

    update(dt: number) {
        super.update(dt);
        this.updateMeshRotate(dt);
    }

    free() {
        if (this._mesh) ThreeUtils.removeAndDispose(this._mesh);
        this._mesh = null;

        if (this._settelite) ThreeUtils.removeAndDispose(this._settelite);
        this._settelite = null;

        if (this._aimLine) ThreeUtils.removeAndDispose(this._aimLine);
        this._aimLine = null;

        super.free();
    }

}