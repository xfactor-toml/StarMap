import { GameBoot } from "./scenes/GameBoot";
import { FrontEvents } from "./events/FrontEvents";

window.addEventListener('load', () => {

    let boot = new GameBoot();
    boot.init();

    // Global Events
    window.addEventListener('resize', () => {
        FrontEvents.onWindowResizeSignal.dispatch();
    }, false);

}, false);
