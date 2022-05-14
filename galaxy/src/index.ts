// import { initScene } from "./game.js";
import { initScene } from "./gameTs";
// import { initScene } from "./TestStars.js";

window.addEventListener('load', () => {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', async () => {
        const overlay = document.getElementById('overlay');
        overlay.remove();
        initScene();
    });
}, false);
