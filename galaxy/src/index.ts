import { Config } from "./data/Config";
import { GlobalEvents } from "./events/GlobalEvents";
import { GameBoot } from "./scenes/GameBoot";

window.addEventListener('load', () => {
    const startButton = document.getElementById('startButton');
    const startButtonFull = document.getElementById('startButtonFull');

    function startGame(aIsFullScreen = false) {
        const buttonBlock = document.getElementById('overlay');
        // startButton.remove();
        // startButtonFull.remove();
        buttonBlock.remove();
        
        Config.FULL_SCREEN = aIsFullScreen;
        let boot = new GameBoot();
        boot.init();
    }

    // Global events
    window.addEventListener('resize', () => {
        GlobalEvents.onWindowResizeSignal.dispatch();
    }, false);

    startButton.addEventListener('click', async () => {
        startGame();
    });

    startButtonFull.addEventListener('click', async () => {
        startGame(true);
    });

}, false);
