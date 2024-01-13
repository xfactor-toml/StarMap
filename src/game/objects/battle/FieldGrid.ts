import * as THREE from 'three';
import { MyObject3D } from '~/game/basics/MyObject3D';

export class FieldGrid extends MyObject3D {

    constructor(rows: number, cols: number, hexWidth: number, hexHeight: number, color: number) {
        super(`FieldCell`);
        this.drawHexagonalField(this, rows, cols, hexWidth, hexHeight, color);
    }

    private drawHexagonalField(parent: THREE.Group, rows: number, cols: number, hexWidth: number, hexHeight: number, color: number): void {
        const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
        const vertices: Float32Array = new Float32Array(rows * cols * 7 * 3); // 7 вершин на гексагон

        let index = 0;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * hexWidth * 0.75;
                const y = row * hexHeight + (col % 2) * (hexHeight / 2);

                for (let i = 0; i < 7; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    const xVertex = x + hexWidth * Math.cos(angle);
                    const yVertex = y + hexHeight * Math.sin(angle);

                    vertices[index++] = xVertex;
                    vertices[index++] = yVertex;
                    vertices[index++] = 0;
                }
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const lines: THREE.Line = new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({ color })
        );

        parent.add(lines);
    }

}