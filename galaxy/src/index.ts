import { Config } from "./data/Config";
import { FrontEvents } from "./events/FrontEvents";
import { GameEvents } from "./events/GameEvents";
import { GlobalEvents } from "./events/GlobalEvents";
import { GameBoot } from "./scenes/GameBoot";
import { GameEngine } from "./scenes/GameEngine";

window.addEventListener('load', () => {

    const startButton = document.getElementById('startButton');
    const startButtonFull = document.getElementById('startButtonFull');

    // let isGameLoaded = false;
    // let isPlayClicked = false;

    function hideButtons() {
        const buttonBlock = document.getElementById('overlay');
        buttonBlock.remove();
    }

    let boot = new GameBoot();
    boot.init();

    // Button Events

    startButton.addEventListener('click', async () => {
        // isPlayClicked = true;
        hideButtons();
        // if (isGameLoaded) startGame();
        if (boot.isLoaded) FrontEvents.startGame.dispatch(false);
    });

    startButtonFull.addEventListener('click', async () => {
        // Config.FULL_SCREEN = true;
        // isPlayClicked = true;
        hideButtons();
        // if (isGameLoaded) startGame();
        if (boot.isLoaded) FrontEvents.startGame.dispatch(true);
    });

    // Global Events
    window.addEventListener('resize', () => {
        GlobalEvents.onWindowResizeSignal.dispatch();
    }, false);

}, false);
