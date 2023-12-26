import { defineStore } from 'pinia';

import {
  GuiClientSceneName,
  GuiClientSceneView,
  GuiMode,
  GuiModeName,
  GuiScene,
  GuiScenes,
  SceneName
} from '@/types';
import { reactive, ref } from 'vue';
import { logger } from '@/services';
import { wait } from '@/utils';

export const useScenesStore = defineStore('scenes', () => {
  const scenes = ref<GuiScenes>()

  const current = reactive<{
    scene: GuiScene
    mode: GuiMode | null
    clientScene: GuiClientSceneView | null
  }>({
    scene: null,
    mode: null,
    clientScene: null,
  })

  const modeActivated = ref(false)

  const setClientScene = (clientSceneName: GuiClientSceneName) => {
    logger.log({ clientSceneName });
    current.clientScene = current.mode?.clientScenes?.find(({ name }) => name === clientSceneName) || null
  }

  const setSceneMode = async (modeName: GuiModeName) => {
    modeActivated.value = false
    
    if (current.mode?.beforeLeave) {
      await current.mode.beforeLeave()
    }
    
    current.mode = [...current.scene.modes].find(({ name }) => name === modeName) || null
    current.clientScene = current.mode?.clientScenes?.find(({ enabled }) => enabled) || null
    logger.log({ modeName });

    await wait(100)

    modeActivated.value = true
  }
  
  const setScene = async <T extends SceneName = SceneName>(sceneName: T, { mode, clientScene }: {
    mode?: GuiModeName<T>,
    clientScene?: GuiClientSceneName<T>
  } = {}) => {
    const scene = scenes.value[sceneName]

    current.scene = scene
    logger.log({ sceneName });

    await setSceneMode(mode || scene.initialMode)

    if (clientScene) {
      setClientScene(clientScene)
    }
  }

  const setScenes = (value: GuiScenes, initalScene: SceneName) => {
    scenes.value = value
    setScene(initalScene)
  }

  return {
    current,
    modeActivated,
    setScenes,
    setClientScene,
    setSceneMode,
    setScene,
  }
});
