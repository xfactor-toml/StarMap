import { defineStore } from 'pinia';
import {
  PhantomStarPreviewEvent,
  ShowStarGuiEvent,
  ShowStarPreviewEvent,
  StarBoostPanelType
} from '@/types';
import { Star, StarPosition, StarScreenPosition } from '@/models';
import { useStarsStore } from '@/stores/stars';
import { ref } from 'vue';
import { useClient } from '@/services';
import { useUiOverlayStore } from '@/stores/ui-overlay';
import { useUiViewportStore } from '@/stores/ui-viewport';
import { useUiPanelsStore } from '@/stores/ui-panels';
import { useScreensStore } from '@/stores/screens';

type StarBoostPanel = {
  starId: number;
  type: StarBoostPanelType;
}

type StarPanel = {
  starId: number;
  scale: number;
}

type StarTooltip = {
  star: Star;
  scale: number;
  position: StarScreenPosition;
}

export const useUiStarStore = defineStore('uiStar', () => {
  const client = useClient()
  const screens = useScreensStore()
  const overlay = useUiOverlayStore()
  const panels = useUiPanelsStore()
  const viewport = useUiViewportStore()
  const newStarPosition = ref<StarPosition | null>(null)
  const starBoostPanel = ref<StarBoostPanel | null>(null)
  const starPanel = ref<StarPanel | null>(null)
  const starTooltip = ref<StarTooltip | null>(null)

  const hideStarTooltip = () => {
    newStarPosition.value = null;
    starTooltip.value = null;
    overlay.disable();
    client.onClick();
    client.closeStarPreview();
  }

  const hideStarPanel = () => {
    starPanel.value = null;
  }

  const hideStarBoostPanel = () => {
    overlay.disable();
    client.onClick();
    starBoostPanel.value = null;
  }

  const showStarTooltip = ({ starData, pos2d }: ShowStarPreviewEvent, aOverlayActionDelay: number) => {
    client.onClick();

    const starsStore = useStarsStore();
    const star = starsStore.getById(starData.id) || new Star(starData);

    overlay.enable(aOverlayActionDelay);
    starTooltip.value = {
      position: new StarScreenPosition(pos2d),
      scale: 1,
      star
    };

    if (viewport.isMobile) {
      panels.hideAll();
    }
  }

  const showStarPanel = ({ starData, scale }: ShowStarGuiEvent) => {
    const starsStore = useStarsStore();
    const star = starsStore.getById(starData.id) || new Star(starData);

    starPanel.value = {
      scale,
      starId: star.id
    };
  }

  const showPhantomStarTooltip = ({ pos2d, pos3d }: PhantomStarPreviewEvent, aOverlayActionDelay: number) => {
    client.onClick();
    overlay.enable(aOverlayActionDelay);
    newStarPosition.value = new StarPosition(pos2d, pos3d);

    if (viewport.isMobile) {
      panels.hideAll();
    }
  }

  const showStarBoostPanel = ({ starId, type }: StarBoostPanel) => {
    client.onClick();
    overlay.enable();
    starBoostPanel.value = {
      starId,
      type
    };
  }

  const diveIn = () => {
    client.onClick();
    client.diveIn(starTooltip.value.star.id);
    hideStarTooltip();
    screens.setClientView('star');
  }

  const returnToGalaxy = () => {
    hideStarPanel();
    client.flyFromStar();
  }

  return {
    newStarPosition,
    starBoostPanel,
    starPanel,
    starTooltip,
    hideStarBoostPanel,
    hideStarPanel,
    hideStarTooltip,
    showStarPanel,
    showStarTooltip,
    showPhantomStarTooltip,
    showStarBoostPanel,
    diveIn,
    returnToGalaxy,
  }
});
