import * as THREE from "three";
import { MyMath } from "@/utils";
import { ParticleData, ParticleSystem } from "./ParticleSystem";

export class ExplosionParticleSystem extends ParticleSystem {
    private _expVelocity = {
        min: 6,
        max: 17
    };

    private addExpParticles(aPos: THREE.Vector3, count: number) {

        for (let i = 0; i < count; i++) {

            let velocity = this._params.velocity.clone();
            let an = MyMath.randomInRange(0, Math.PI * 2);
            const force = MyMath.randomInRange(this._expVelocity.min, this._expVelocity.max);
            let dv = {
                x: Math.cos(an) * force,
                y: 0,
                z: Math.sin(an) * force
            };
            velocity.x += dv.x;
            velocity.y += dv.y;
            velocity.z += dv.z;

            let pos = aPos.clone();
            let dp = this._params.deltaPosition;
            if (dp.x) pos.x += MyMath.randomInRange(dp.x.min, dp.x.max);
            if (dp.y) pos.y += MyMath.randomInRange(dp.y.min, dp.y.max);
            if (dp.z) pos.z += MyMath.randomInRange(dp.z.min, dp.z.max);

            let clr: THREE.Color;
            if (this._params.color == 'random') {
                clr = new THREE.Color(Math.random(), Math.random(), Math.random());
            }
            else {
                clr = new THREE.Color(this._params.color);
            }

            let size = MyMath.randomInRange(this._params.size.min, this._params.size.max);

            let pData: ParticleData = {
                position: pos,
                startSize: size,
                size: size * this._startScale,
                color: clr,
                alpha: this._startAlpha,
                lifeTime: this._params.lifeTime,
                lifeProgress: 0,
                rotation: 0,
                velocity: velocity
            };
            this._particles.push(pData);

        }

    }

    explosion(aPos: THREE.Vector3) {
        this.addExpParticles(aPos, 200);
    }

}