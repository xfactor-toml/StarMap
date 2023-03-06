import { GuiEvent, GuiEventEmitterListener } from '../types';

const _listeners: Partial<Record<GuiEvent, GuiEventEmitterListener[]>> = {};

export const EventEmitterMixin = {
  methods: {
    on(eventName: GuiEvent, callback: GuiEventEmitterListener) {
      if (!_listeners[eventName]) {
        _listeners[eventName] = [];
      }

      _listeners[eventName]?.push(callback);
    },
    once(eventName: GuiEvent, callback: GuiEventEmitterListener) {
      const listener = (data?: any) => {
        callback(data);
        this.off(eventName, listener);
      };

      this.on(eventName, listener);
    },
    off(eventName: GuiEvent, callback: () => void) {
      _listeners[eventName] = callback
        ? _listeners[eventName]?.filter(
            (listener: GuiEventEmitterListener) => listener !== callback
          )
        : [];
    },
    emit(eventName: GuiEvent, data: any = null) {
      if (_listeners[eventName]) {
        _listeners[eventName]?.forEach((listener: GuiEventEmitterListener) => {
          if (typeof listener === 'function') {
            listener(data);
          }
        });
      }
    }
  }
};
