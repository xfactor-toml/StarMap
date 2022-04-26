import { initScene } from "./game.js";
// import { initScene } from "./gameTs";
// import { initScene } from "./TestStars.js";

window.addEventListener('load', () => {
    // let gameStarter2 = new GameStarter();
    // let event = new CustomEvent('gameStarterCreated', {
    //     detail: {
    //         gameStarter: gameStarter,
    //         //gameStarter2: gameStarter2
    //     }
    // });
    // window.dispatchEvent(event);

    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', async () => {
        const overlay = document.getElementById('overlay');
        overlay.remove();
        initScene();
        // await Tone.start();
        // console.log("audio is ready");
        // new Ambient();
        // init();
    });
}, false);
