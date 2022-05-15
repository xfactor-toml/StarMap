// import { initScene } from "./game.js";
import { GlobalEvents } from "./events/GlobalEvents";
import { GameBoot } from "./scenes/GameBoot";

window.addEventListener('load', () => {

    // Global events
    window.addEventListener('resize', () => {
        GlobalEvents.onWindowResizeSignal.dispatch();
    }, false);

    // Start
    const startButton = document.getElementById('startButton');

    startButton.addEventListener('click', async () => {
        const overlay = document.getElementById('overlay');
        overlay.remove();
        let boot = new GameBoot();
        boot.init();
    });

}, false);
