import { LogMng } from "../../../monax/LogMng";
import { ILogger } from "../interfaces/ILogger";
import { BasicScene } from "./BasicScene"

export class SceneMng implements ILogger {
    private _scenes: BasicScene[];
    private _currScene: BasicScene;

    constructor(aParams: {
        scenes: BasicScene[]
    }) {
        this._scenes = aParams.scenes;
        for (let i = 0; i < this._scenes.length; i++) {
            const scene = this._scenes[i];
            scene.onSceneStart.add(this.onSceneStart, this);
        }
    }

    logDebug(aMsg: string, aData?: any): void {
        LogMng.debug(`SceneMng: ${aMsg}`, aData);
    }
    logWarn(aMsg: string, aData?: any): void {
        LogMng.warn(`SceneMng: ${aMsg}`, aData);
    }
    logError(aMsg: string, aData?: any): void {
        LogMng.error(`SceneMng: ${aMsg}`, aData);
    }

    private onSceneStart(aSender: BasicScene, aSceneName, aData?: any) {
        if (aSender != this._currScene) {
            this.logDebug(`onSceneStart: aSender != this._currScene`);
            return;
        }
        if (this._currScene?.name == aSceneName) {
            this.logDebug(`onSceneStart: currScene.name == aSceneName (${aSceneName})`);
            return;
        }
        this.startScene(aSceneName, aData);
    }

    private getSceneByName(aName: string): BasicScene {
        for (let i = 0; i < this._scenes.length; i++) {
            const scene = this._scenes[i];
            if (scene.name == aName) {
                return scene;
            }
        }
        return null;
    }

    startScene(aName: string, aData?: any) {
        if (this._currScene?.name == aName) {
            this.logWarn(`Scene ${aName} already started`);
            return;
        }
        this._currScene?.free();
        let newScene = this.getSceneByName(aName);
        if (!newScene) {
            // scene not found
            this.logError(`Scene ${aName} not found!`);
            return;
        }
        this._currScene = newScene;
        newScene.init(aData);
    }

    onWindowResize() {
        this._currScene.onWindowResize();
    }

    update(dt: number) {
        this._currScene.update(dt);
    }

    render() {
        this._currScene.render();
    }


}