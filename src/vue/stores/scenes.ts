import { defineStore } from 'pinia';

import { GuiClientSceneView, GuiMode, GuiModeName, GuiScene } from '@/types';
import { SCENES } from '@/constants';
import { reactive } from 'vue';
import { logger } from '@/services';

export const useScenesStore = defineStore('scenes', () => {
  const current = reactive<{
    scene: GuiScene
    mode: GuiMode | null
    clientScene: GuiClientSceneView | null
  }>({
    scene: null,
    mode: null,
    clientScene: null,
  })

  const setClientScene = (clientSceneName: GuiClientSceneView['name']) => {
    logger.log({ clientSceneName });
    current.clientScene = current.mode?.clientScenes?.find(({ name }) => name === clientSceneName) || null
  }

  const setSceneMode = (modeName: GuiModeName) => {
    logger.log({ modeName });
    current.mode = [...current.scene.modes].find(({ name }) => name === modeName) || null
    current.clientScene = current.mode?.clientScenes?.find(({ enabled }) => enabled) || null
  }
  
  const setScene = (sceneName: GuiScene['name']) => {
    logger.log({ sceneName });
    current.scene = SCENES[sceneName]
    setSceneMode(current.scene.initialMode)
  }

  setScene('start')

  return {
    current,
    setClientScene,
    setSceneMode,
    setScene
  }
});
