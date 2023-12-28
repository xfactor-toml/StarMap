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

type SceneState = {
  scene: GuiScene
  mode: GuiMode | null
  clientScene: GuiClientSceneView | null
}

export const useScenesStore = defineStore('scenes', () => {
  const scenes = ref<GuiScenes>()

  const previous = reactive<SceneState>({
    scene: null,
    mode: null,
    clientScene: null,
  })

  const current = reactive<SceneState>({
    scene: null,
    mode: null,
    clientScene: null,
  })

  const setClientScene = (clientSceneName: GuiClientSceneName) => {
    previous.clientScene = current.clientScene
    current.clientScene = current.mode?.clientScenes?.find(({ name }) => name === clientSceneName) || null
    logger.log({ clientSceneName });
  }

  const setSceneMode = async (modeName: GuiModeName) => {
    previous.mode = current.mode
    current.mode = [...current.scene.modes].find(({ name }) => name === modeName) || null
    current.clientScene = current.mode?.clientScenes?.find(({ enabled }) => enabled) || null
    logger.log({ modeName });
  }
  
  const setScene = async <T extends SceneName = SceneName>(sceneName: T, {
    mode,
    clientScene,
  }: {
    mode?: GuiModeName<T>,
    clientScene?: GuiClientSceneName<T>
  } = {}) => {
    const scene = scenes.value[sceneName]

    if (!scene) {
      logger.error('Scene not found')
      return
    }

    previous.scene = current.scene
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
    previous,
    current,
    setScenes,
    setClientScene,
    setSceneMode,
    setScene,
  }
});
