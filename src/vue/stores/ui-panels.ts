import { LOCAL_STORAGE_KEYS } from '@/constants';
import { useUiViewportStore } from '@/stores/ui-viewport';
import { defineStore } from 'pinia';
import { ref } from 'vue';

type PanelType = 'levels' | 'modes' | 'views'

const getDefaultState = (mobileViewport = false) => {
  if (mobileViewport) {
    return {
      levels: false,
      modes: false,
      views: false,
    }
  }
  
  return {
    levels: true,
    modes: true,
    views: true,
  }
}

export const useUiPanelsStore = defineStore('uiPanels', () => {
  const viewport = useUiViewportStore()

  const restoreState = (): Record<PanelType, boolean> => {
    if (viewport.isMobile) {
      return getDefaultState(true)
    }

    try {
      return Object.assign(getDefaultState(), JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.panels)))
    } catch (error) {
      return getDefaultState()
    }
  }

  const visibility = ref<Record<PanelType, boolean>>(restoreState())

  const saveState = () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.panels, JSON.stringify(visibility.value))
  }

  const setPanelState = (type: PanelType, state: boolean) => {
    visibility.value[type] = state;

    if (viewport.isMobile) {
      if (type === 'modes' && state) {
        setPanelState('levels', false)
        setPanelState('views', false)
      }

      if (type === 'views' && state) {
        setPanelState('levels', false)
        setPanelState('modes', false)
      }

      if (type === 'levels' && state) {
        setPanelState('views', false)
        setPanelState('modes', false)
      }
    }

    saveState()
  }

  const togglePanel = (type: PanelType) => {
    setPanelState(type, !visibility.value[type])
  }

  const hideAll = () => {
    visibility.value = {
      levels: false,
      modes: false,
      views: false,
    }
  }

  return {
    visibility,
    setPanelState,
    togglePanel,
    hideAll,
  };
});
