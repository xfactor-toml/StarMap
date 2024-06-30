import { LogMng } from "../../monax/LogMng";

interface IState {
    name: string;
    context?: any;
    userData?: any;
    onEnter?: Function;
    onUpdate?: Function;
    onExit?: Function;
};

type stateQueueItem = {
    name: string;
    userData: any;
};

export class FSM {

    private stateList = new Map<string, IState>(); // : { [id: string]: StateItem };
    private changeStateQueue: stateQueueItem[] = [];
    private isChangingState = false;
    private currState?: IState;

    addState(aName: string, aContext?: any, aEnter?: Function, aUpdate?: Function, aExit?: Function): FSM {

        if (this.stateList.has(aName)) {
            LogMng.warn('StackFSM: Trying to add an already existing state ' + aName);
            return;
        }

        this.stateList.set(aName, {
            name: aName,
            context: aContext,
            onEnter: aEnter,
            onUpdate: aUpdate,
            onExit: aExit
        });

        return this;

    }

    startState(aName: string, aUserData: any = null) {

        if (!this.stateList.has(aName)) {
            LogMng.warn(`FSM: Tried to start an uninitialized state ${aName}`);
            return;
        }

        if (this.isCurrentState(aName)) {
            return;
        }

        if (this.isChangingState) {
            this.changeStateQueue.push({
                name: aName,
                userData: aUserData
            });
            return;
        }

        this.isChangingState = true;

        if (this.currState && this.currState.onExit) {
            this.currState.onExit.call(this.currState.context);
        }

        this.currState = this.stateList.get(aName);
        this.currState.userData = aUserData;
        if (this.currState.onEnter) this.currState.onEnter.call(this.currState.context, aUserData);

        this.isChangingState = false;
    }

    isCurrentState(aName: string): boolean {
        return this.currState && this.currState.name == aName;
    }

    getCurrentState(): IState {
        return this.currState;
    }

    free() {
        this.currState = null;
        this.stateList = null;
    }

    update(dt: number): void {

        if (this.changeStateQueue.length > 0) {
            let data = this.changeStateQueue.shift()!;
            this.startState(data.name, data.userData);
            return;
        }

        if (this.currState && this.currState.onUpdate) {
            this.currState.onUpdate.call(this.currState.context, dt, this.currState.userData);
        }
    }

}