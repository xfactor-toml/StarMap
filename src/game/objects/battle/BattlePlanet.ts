import * as THREE from 'three';
import { BattleObject } from './BattleObject';
import { ObjectCreateData } from '~/game/battle/Types';
import { ThreeLoader } from '~/game/utils/threejs/ThreeLoader';
import { TextureAlias } from '~/game/data/TextureData';
import { MyMath } from '@/utils';
import { ThreeUtils } from '~/game/utils/threejs/ThreejsUtils';

export class BattlePlanet extends BattleObject {
    protected _mesh: THREE.Mesh;
    protected _settelite: THREE.Mesh;
    protected _setteliteOrbitRadius: number;
    protected _setteliteRadius: number;

    constructor(aParams: ObjectCreateData) {
        super(aParams, 'BattlePlanet');

        this._setteliteOrbitRadius = this.radius * 2;
        this._setteliteRadius = this.radius / 2;

        this.initPlanet();
        this.initSetteliteOrbitLine(this, this._setteliteOrbitRadius, 1, 0x00ffff);
        this.initSettelite(this._setteliteRadius, this._setteliteOrbitRadius);
        this.initDirrectionArea(this._setteliteOrbitRadius, this._setteliteRadius);
        let l = this.drawPartialCircle(this, this._setteliteOrbitRadius * 2, 1, 0x00ffff, 0, 1);
        l.rotation.x = MyMath.toRadian(-90);
        
    }

    private initPlanet() {
        let g = new THREE.SphereGeometry(this.radius);
        let m = new THREE.MeshBasicMaterial({
            color: 0xaaaaaa
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

    drawPartialCircle(aParent: THREE.Group, aRadius: number, aLineWidth: number, aColor: number, aStartAngle: number, aEndAngle: number): THREE.Line {
        const segments = 64; // Количество сегментов в круге

        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array((segments + 2) * 3 * 2); // Умножаем на 2, так как у нас будет по две координаты для каждой вершины (начало и конец линии)

        const material = new THREE.LineBasicMaterial({ color: aColor, linewidth: aLineWidth });

        // Начальная точка круга
        vertices[0] = 0;
        vertices[1] = 0;
        vertices[2] = 0;

        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * (aEndAngle - aStartAngle) + aStartAngle;

            const x = aRadius * Math.cos(theta);
            const y = aRadius * Math.sin(theta);

            // Начальная точка линии
            vertices[i * 6 + 3] = 0;
            vertices[i * 6 + 4] = 0;
            vertices[i * 6 + 5] = 0;

            // Конечная точка линии
            vertices[i * 6 + 6] = x;
            vertices[i * 6 + 7] = y;
            vertices[i * 6 + 8] = 0;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const partialCircle = new THREE.Line(geometry, material);
        aParent.add(partialCircle);

        return partialCircle;
    }

    free() {
        if (this._mesh) {
            this.remove(this._mesh);
            this._mesh = null;
        }
        super.free();
    }

    update(dt: number) {
        super.update(dt);
    }

}