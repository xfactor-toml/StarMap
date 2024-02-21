import * as THREE from 'three';
import { MyEventDispatcher } from "../basics/MyEventDispatcher";
import { GalaxyMng } from "../galaxy/GalaxyMng";
import { FrontEvents } from '../events/FrontEvents';
import { ServerStarData } from '../data/Types';
import { Settings } from '../data/Settings';
import { IUpdatable } from '../interfaces/IUpdatable';

export class GalaxyScene extends MyEventDispatcher implements IUpdatable {
    private _scene: THREE.Scene;
    private _camera: THREE.PerspectiveCamera;
    private _galaxyGroup: THREE.Group;
    private _galaxy: GalaxyMng;

    constructor(aParams: {
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera
    }) {
        super('GalaxyScene');
        this._scene = aParams.scene;
        this._camera = aParams.camera;

        this._galaxyGroup = new THREE.Group();
        // this._parent.visible = false;
        this._scene.add(this._galaxyGroup);

        this.initEvents();
    }

    private initEvents() {
        FrontEvents.onLeftPanelGalaxyClick.add(this.onLeftPanelGalaxyClick, this);
        FrontEvents.onBotPanelPhantomClick.add(this.onBotPanelPhantomClick, this);
        FrontEvents.onBotPanelRealClick.add(this.onBotPanelRealClick, this);
        FrontEvents.onStarCreated.add(this.onStarCreated, this);
        FrontEvents.onStarUpdated.add(this.onStarUpdated, this);
    }

    private onLeftPanelGalaxyClick() {
        this.logDebug(`onLeftPanelGalaxyClick...`);
        this._galaxy?.gotoGalaxy();
    }

    private onBotPanelPhantomClick() {
        this.logDebug(`onBotPanelPhantomClick...`);
        this._galaxy?.openPhantomMode();
    }

    private onBotPanelRealClick() {
        this.logDebug(`onBotPanelRealClick...`);
        this._galaxy?.openRealMode();
    }

    private onStarCreated(aStarData: ServerStarData) {
        this._galaxy?.onStarCreated(aStarData);
    }

    private onStarUpdated(aStarData: ServerStarData) {
        this._galaxy?.onStarUpdated(aStarData);
    }

    public get hided(): boolean {
        return !this._galaxyGroup.visible;
    }

    initGalaxy() {
        this._galaxy = new GalaxyMng({
            parent: this._galaxyGroup,
            camera: this._camera
        });
        this._galaxy.init();

        // DEBUG GUI
        if (Settings.isDebugMode && Settings.datGui) {
            this._galaxy.initDebugGui();
        }
    }

    show() {
        this._galaxyGroup.visible = true;
        this._galaxy.disabled = false;
    }

    hide() {
        this._galaxy.disabled = true;
        this._galaxyGroup.visible = false;
    }

    update(dt: number) {
        if (this.hided) return;
        this._galaxy.update(dt);
    }

}