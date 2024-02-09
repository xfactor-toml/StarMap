import * as THREE from 'three';
import { MyObject3D } from "~/game/basics/MyObject3D";
import { TextureAlias } from '~/game/data/TextureData';
import { MyMath } from '~/game/utils/MyMath';
import { ThreeLoader } from '~/game/utils/threejs/ThreeLoader';

export class FieldCell extends MyObject3D {
    protected _radius = 5;
    protected _mesh: THREE.Mesh;

    constructor(aRadius: number) {
        super(`FieldCell`);
        this._radius = aRadius;
        // this.initPlaneModel();
        this.drawHexagon(this._radius * 1.3, this._radius * 1.3, 0x00ffff);
    }

    private initTorusModel() {
        const geometry = new THREE.TorusGeometry(this._radius, .3, 2, 20);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: .2,
            depthWrite: false
        });
        const torus = new THREE.Mesh(geometry, material);
        torus.rotation.x = MyMath.toRadian(-90);
        this.add(torus);
    }

    private initPlaneModel() {
        const t = ThreeLoader.getInstance().getTexture(TextureAlias.fieldCell);
        const geometry = new THREE.PlaneGeometry(this._radius * 2.4, this._radius * 2.5);
        const material = new THREE.MeshBasicMaterial({
            map: t,
            transparent: true,
            depthWrite: false
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = MyMath.toRadian(-90);
        this.add(mesh);
    }

    drawHexagon(w: number, h: number, color: number): void {
        const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
        const vertices: Float32Array = new Float32Array(7 * 3); // 7 вершин (x, y, z)

        for (let i: number = 0; i < 7; i++) {
            const angle: number = (i / 6) * Math.PI * 2;
            const x: number = w * Math.cos(angle);
            const y: number = h * Math.sin(angle);

            vertices[i * 3] = x;
            vertices[i * 3 + 1] = y;
            vertices[i * 3 + 2] = 0;
        }

        vertices[6 * 3] = vertices[0];
        vertices[6 * 3 + 1] = vertices[1];
        vertices[6 * 3 + 2] = vertices[2];

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const lines: THREE.Line = new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.1
            })
        );

        lines.rotation.x = MyMath.toRadian(-90);
        lines.rotation.z = MyMath.toRadian(360 / 12);

        this.add(lines);
    }

    free() {
        this._mesh = null;
        super.free();
    }

}