import { GameBoot } from './scenes/GameBoot';
import { FrontEvents } from './events/FrontEvents';
import { createApp, markRaw } from 'vue';
import { createPinia } from 'pinia';
import { Controller } from './vue/controller';
import { GuiInterface } from './vue/types';
import { default as App } from './vue/App.vue';
import './css/style.css';

window.addEventListener('DOMContentLoaded', () => {
  const app = createApp(App);
  const store = createPinia();

  store.use(() => ({
    client: markRaw(FrontEvents)
  }));

  app.use(store);

  Controller(app.mount('#gui') as GuiInterface);

  // threejs
  let boot = new GameBoot();
  boot.init();
});
