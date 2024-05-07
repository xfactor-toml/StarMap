import * as THREE from "three";
import { Signal } from "~/game/utils/events/Signal";

export class ClickableMesh extends THREE.Mesh {
    onClick = new Signal();

    generateClickEvent() {
        this.onClick.dispatch(this);
    }

    free() {
        this.onClick.removeAll();
        this.onClick = null;
    }

}