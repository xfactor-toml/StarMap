import { MyLogger } from "./MyLogger";

type ListenerRecord = {
    func: Function,
    ctx?: any,
    once?: boolean
}

export class MyEventDispatcher extends MyLogger {
    protected _className: string;
    private _listeners: { [index: string]: ListenerRecord[] };

    constructor(aClassName?: string) {
        super(aClassName || 'MyEventDispatcher');
        this._listeners = {};
    }

    on(aEventName: string, aFunc: Function, aCtx: any) {
        if (!this._listeners[aEventName]) this._listeners[aEventName] = [];
        this._listeners[aEventName].push({
            func: aFunc,
            ctx: aCtx
        })
    }

    once(aEventName: string, aFunc: Function, aCtx: any) {
        if (!this._listeners[aEventName]) this._listeners[aEventName] = [];
        this._listeners[aEventName].push({
            func: aFunc,
            ctx: aCtx,
            once: true
        })
    }

    remove(aEventName: string, aFunc: Function) {
        let list = this._listeners[aEventName];
        if (!list) return;
        for (let i = list.length - 1; i >= 0; i--) {
            const rec = list[i];
            if (rec.func == aFunc) list.splice(i, 1);
        }
    }

    removeAll(aEventName: string) {
        this._listeners[aEventName] = [];
    }

    emit(aEventName: string, ...argArray: any[]) {
        let list = this._listeners[aEventName];
        if (!list) return;
        for (let i = list.length - 1; i >= 0; i--) {
            const rec = list[i];
            rec.func.call(rec.ctx, ...argArray);
            if (rec.once) list.splice(i, 1);
        }
    }

}