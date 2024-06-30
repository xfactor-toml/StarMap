import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { default as App } from '@/App.vue';
import { ClientService, WalletService } from '@/services';

import { default as toastify, type ToastContainerOptions } from 'vue3-toastify';
import { default as anime } from 'animejs';
import { GlobalParams } from './game/data/GlobalParams';
import { LogMng } from './monax/LogMng';
import { GameEngine } from './game/core/GameEngine';
import { BootScene } from './game/scenes/BootScene';
import { PreloaderScene } from './game/scenes/PreloaderScene';
import { GalaxyScene } from './game/scenes/GalaxyScene';
import { BattleScene } from './game/scenes/BattleScene';

import './css/style.css';
import 'vue3-toastify/dist/index.css';

// @ts-ignore
anime.suspendWhenDocumentHidden = false;

function initLogMng() {
    // init debug mode
    GlobalParams.isDebugMode = window.location.hash === '#debug';
    // LogMng settings
    if (!GlobalParams.isDebugMode) LogMng.setMode(LogMng.MODE_RELEASE);
    LogMng.system('log mode: ' + LogMng.getMode());
}

function initGameEngine() {
    GlobalParams.domRenderer = document.getElementById('game');
    new GameEngine({
        inputDomElement: GlobalParams.domRenderer,
        scenes: [
            new BootScene(),
            new PreloaderScene(),
            new GalaxyScene(),
            new BattleScene()
        ]
    });
}

window.addEventListener('DOMContentLoaded', () => {

    initLogMng();

    const app = createApp(App);
    const store = createPinia();

    store.use(ClientService.StorePlugin);
    store.use(WalletService.StorePlugin);

    app.use(ClientService.VuePlugin)
    app.use(WalletService.VuePlugin)
    app.use(store);
    app.use(toastify, {
        theme: 'dark',
        hideProgressBar: true,
    } as ToastContainerOptions);

    app.mount('#gui')

    initGameEngine();

});
