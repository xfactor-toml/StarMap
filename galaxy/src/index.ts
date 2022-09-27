import { Config } from "./data/Config";
import { FrontEvents } from "./events/FrontEvents";
import { GameEvents } from "./events/GameEvents";
import { GameBoot } from "./scenes/GameBoot";
import { GameEngine } from "./scenes/GameEngine";

window.addEventListener('load', () => {

    let boot = new GameBoot();
    boot.init();

    // Global Events
    window.addEventListener('resize', () => {
        FrontEvents.onWindowResizeSignal.dispatch();
    }, false);

}, false);
