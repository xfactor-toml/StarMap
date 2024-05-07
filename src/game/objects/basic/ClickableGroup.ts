import * as THREE from "three";
import { Signal } from "~/game/utils/events/Signal";
import { ClickableMesh } from "./ClickableMesh";

export class ClickableGroup extends THREE.Group {
    private _mesh: ClickableMesh;
    onClick = new Signal();

    initPlane(aSize: { w: number, h: number }) {
        let g = new THREE.PlaneGeometry(aSize.w, aSize.h);
        let m = new THREE.MeshBasicMaterial({
            color: 0x00ff00
        });
        this._mesh = new ClickableMesh(g, m);
        this._mesh.visible = false;
        this.add(this._mesh);

        this._mesh.onClick.add(() => {
            this.onClick.dispatch();
        }, this);
    }

    free() {
        if (this._mesh) {
            this._mesh.free();
        }
        this._mesh = null;
        this.onClick.removeAll();
        this.onClick = null;
    }

}