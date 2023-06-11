import { GameBoot } from './scenes/GameBoot';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { default as App } from '@/App.vue';
import { Client3DService, WalletService } from '@/services';

import './css/style.css';

window.addEventListener('DOMContentLoaded', () => {
  const app = createApp(App);
  const store = createPinia();

  store.use(Client3DService.StorePlugin);
  store.use(WalletService.StorePlugin);

  app.use(Client3DService.VuePlugin)
  app.use(WalletService.VuePlugin)
  app.use(store);

  app.mount('#gui')

  // threejs
  let boot = new GameBoot();
  boot.init();
});
