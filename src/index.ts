import { GameBoot } from "./scenes/GameBoot";
import { FrontEvents } from "./events/FrontEvents";
import { createApp } from "vue";
import { Controller } from "./vue/controller";
import { GuiInterface } from "./vue/types";
import { default as App } from "./vue/App.vue";
import "./css/style.css";

window.addEventListener('load', () => {

    // Vue
    
    const app = createApp(App);
    Controller(app.mount("#gui") as GuiInterface);
    
    // threejs

    let boot = new GameBoot();
    boot.init();

    // Global Events
    window.addEventListener('resize', () => {
        FrontEvents.onWindowResizeSignal.dispatch();
    }, false);

}, false);
