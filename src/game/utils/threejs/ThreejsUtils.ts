import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';

export class ThreeUtils {

    public static toScreenPosition(renderer, obj, camera, devicePixelRatio: number) {
        var vector = new THREE.Vector3();

        var widthHalf = 0.5 * renderer.getContext().canvas.width;
        var heightHalf = 0.5 * renderer.getContext().canvas.height;

        obj.updateMatrixWorld();
        vector.setFromMatrixPosition(obj.matrixWorld);
        vector.project(camera);

        vector.x = (vector.x * widthHalf) + widthHalf;
        vector.y = - (vector.y * heightHalf) + heightHalf;

        return {
            x: vector.x / devicePixelRatio,
            y: vector.y / devicePixelRatio
        };

    }

    public static drawLineCircle(aParams: {
        radius: number,
        lineWidth: number,
        color: number,
        points?: number,
        transparent?: boolean,
        opacity?: number
    }): THREE.Line {
        const segments = aParams.points || 32;
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(segments * 3 * 2);
        const material = new THREE.LineBasicMaterial({
            color: aParams.color,
            linewidth: aParams.lineWidth,
            transparent: aParams.transparent,
            opacity: aParams.opacity
        });

        for (let i = 0; i < segments; i++) {
            const theta = (i / segments) * Math.PI * 2;

            const x1 = aParams.radius * Math.cos(theta);
            const y1 = aParams.radius * Math.sin(theta);

            const x2 = aParams.radius * Math.cos((i + 1) / segments * Math.PI * 2);
            const y2 = aParams.radius * Math.sin((i + 1) / segments * Math.PI * 2);

            // start point of line
            vertices[i * 6] = x1;
            vertices[i * 6 + 1] = y1;
            vertices[i * 6 + 2] = 0;

            // end point of line
            vertices[i * 6 + 3] = x2;
            vertices[i * 6 + 4] = y2;
            vertices[i * 6 + 5] = 0;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const circle = new THREE.Line(geometry, material);
        return circle;

    }

    public static drawLine2Circle(aParams: {
        radius: number,
        lineWidth: number,
        color: number,
        transparent?: boolean,
        opacity?: number
    }): Line2 {
        const segments = 20;
        const material = new LineMaterial({
            color: aParams.color,
            linewidth: aParams.lineWidth,
            transparent: aParams.transparent,
            opacity: aParams.opacity
        });

        let positions = [];

        for (let i = 0; i < segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            const x1 = aParams.radius * Math.cos(theta);
            const y1 = aParams.radius * Math.sin(theta);
            const x2 = aParams.radius * Math.cos((i + 1) / segments * Math.PI * 2);
            const y2 = aParams.radius * Math.sin((i + 1) / segments * Math.PI * 2);
            positions.push(x1, y1, 0);
        }

        const geometry = new LineGeometry();
        geometry.setPositions(positions);

        const circle = new Line2(geometry, material);
        circle.computeLineDistances();
        circle.scale.set(1, 1, 1);
        return circle;

    }

    public static randomNormalVector(): THREE.Vector3 {
        // Генерация случайных углов
        const phi = Math.random() * 2 * Math.PI; // Азимутальный угол в диапазоне [0, 2π]
        const theta = Math.acos(2 * Math.random() - 1); // Угол места в диапазоне [0, π]

        // Преобразование сферических координат в декартовы
        const x = Math.sin(theta) * Math.cos(phi);
        const y = Math.sin(theta) * Math.sin(phi);
        const z = Math.cos(theta);

        return new THREE.Vector3(x, y, z);
    }

    public static randomVector(aLength: number): THREE.Vector3 {
        return this.randomNormalVector().multiplyScalar(aLength);
    }

}