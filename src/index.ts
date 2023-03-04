import { GameBoot } from "./scenes/GameBoot";
import { FrontEvents } from "./events/FrontEvents";
import "./_vue/style.css";

window.addEventListener('load', () => {

    // threejs

    let boot = new GameBoot();
    boot.init();

    // Global Events
    window.addEventListener('resize', () => {
        FrontEvents.onWindowResizeSignal.dispatch();
    }, false);

}, false);
