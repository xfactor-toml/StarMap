import { initScene } from "./game.js";
// import { initScene } from "./gameTs";
// import { initScene } from "./TestStars.js";

window.addEventListener('load', () => {
    initScene();
    // let gameStarter2 = new GameStarter();
    // let event = new CustomEvent('gameStarterCreated', {
    //     detail: {
    //         gameStarter: gameStarter,
    //         //gameStarter2: gameStarter2
    //     }
    // });
    // window.dispatchEvent(event);
}, false);
