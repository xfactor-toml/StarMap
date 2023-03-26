<template>
  <Preloader v-if="elements.preloader.visible" />
  <StartScreen
    v-if="elements.startScreen.visible"
    @run="(state) => emit('run', state)"
    @runButtonHover="emit('buttonHover', 'run')"
    @agreement="emit('agreement')"
    @agreementClick="emit('buttonClick', 'agreement')"
    @agreementHover="emit('buttonHover', 'agreement')"
  />
  <Interface
    v-if="elements.interface.visible"
    :fullscreen="fullscreen"
    :musicVolume="musicVolume"
    :sfxVolume="sfxVolume"
    @setMusicVolume="(volume) => _handleVolumeChange('music', volume)"
    @setSfxVolume="(volume) => _handleVolumeChange('sfx', volume)"
    @toggleFullscreen="emit('toggleFullscreen')"
    @settingsToggleClick="emit('buttonClick', 'settings')"
    @settingsToggleHover="emit('buttonHover', 'settings')"
    @volumeButtonClick="emit('buttonClick', 'volume')"
    @volumeButtonHover="emit('buttonHover', 'volume')"
    @fullscreenToggleClick="emit('buttonClick', 'fullscreen')"
    @fullscreenToggleHover="emit('buttonHover', 'fullscreen')"
  />
  <transition name="fade">
    <div
      v-if="elements.overlay.visible"
      class="gui-overlay"
      @click="emit('overlayClick')"
    />
  </transition>
  <transition name="fade">
    <StarPanel
      v-if="elements.starPanel.visible"
      :name="elements.starPanel.data.name"
      :description="elements.starPanel.data.description"
      :level="elements.starPanel.data.level"
      :race="elements.starPanel.data.race"
      :planetSlots="elements.starPanel.data.planetSlots"
      :energy="elements.starPanel.data.energy"
      :life="elements.starPanel.data.life"
      :scale="elements.starPanel.data.scale"
      :raceImageUrl="_getRaceImage(elements.starPanel.data.race, 'star-panel')"
      @hide="emit('buttonClick', 'starPanelHide')"
      @hideButtonHover="emit('buttonHover', 'starPanelHide')"
      @play="emit('buttonClick', 'starPanelPlay')"
      @playButtonHover="emit('buttonHover', 'starPanelPlay')"
    />
  </transition>
  <transition name="fade">
    <Tooltip
      v-if="elements.tooltip.visible"
      :name="elements.tooltip.data.name"
      :description="elements.tooltip.data.description"
      :textAutofit="elements.tooltip.data.textAutofit"
      :level="elements.tooltip.data.level"
      :race="elements.tooltip.data.race"
      :position="elements.tooltip.data.pos2d"
      :scale="elements.tooltip.data.scale"
      :raceImageUrl="_getRaceImage(elements.tooltip.data.race, 'tooltip')"
      @hide="emit('buttonClick', 'tooltipHide')"
      @hideButtonHover="emit('buttonHover', 'tooltipHide')"
      @diveIn="emit('buttonClick', 'tooltipDiveIn')"
      @diveInButtonHover="emit('buttonHover', 'tooltipDiveIn')"
    />
  </transition>
</template>

<script lang="ts">
import {
  Interface,
  Preloader,
  StarPanel,
  StartScreen,
  Tooltip
} from "./components";
import { EventEmitterMixin } from "./mixins/event-emitter";
import { RaceType, GuiElement } from "./types";

export default {
  name: "App",
  components: {
    Interface,
    Preloader,
    StarPanel,
    StartScreen,
    Tooltip
  },
  mixins: [EventEmitterMixin],
  data: () => ({
    elements: {
      interface: { visible: false },
      overlay: { visible: false },
      preloader: { visible: false },
      starPanel: { visible: false, data: null },
      startScreen: { visible: false },
      tooltip: { visible: false, data: null }
    } as Record<
      GuiElement,
      {
        visible: boolean;
        data?: any;
      }
    >,
    fullscreen: false,
    musicVolume: 50,
    sfxVolume: 50
  }),
  methods: {
    _getRaceId(raceName: RaceType) {
      return (
        {
          Humans: "human",
          Simbionts: "simbionts",
          Lizards: "lizards",
          Insects: "insects",
          Robots: "robots"
        }[raceName] || ""
      );
    },
    _getRaceImage(race: RaceType, folder: "tooltip" | "star-panel") {
      return `./gui/images/${folder}/race-${this._getRaceId(race)}.png`;
    },
    _handleVolumeChange(type: "sfx" | "music", volume: number) {
      const eventName = {
        music: "setMusicVolume",
        sfx: "setSfxVolume"
      };

      this[`${type}Volume`] = volume;
      this.emit(eventName[type], volume / 100);
    },
    showElement({
      element,
      overlay,
      data
    }: {
      element: GuiElement;
      overlay: boolean;
      data: any;
    }) {
      const target = this.elements[element];

      if (target) {
        if (target.data && target.data.name === data?.name) {
          this.hideElement({
            element,
            overlay
          });
        } else {
          target.data = data;
          target.visible = true;

          if (overlay) {
            this.showElement({ element: "overlay" });
          }
        }
      }
    },
    hideElement({ element, overlay }) {
      const target = this.elements[element];

      if (target?.visible) {
        target.data = null;
        target.visible = false;

        if (overlay) {
          this.hideElement({ element: "overlay" });
        }
      }
    },
    showTooltip(data) {
      this.showElement({
        element: "tooltip",
        overlay: true,
        data
      });
    },
    hideTooltip() {
      this.hideElement({
        element: "tooltip",
        overlay: true
      });
    },
    showStarPanel(data) {
      this.showElement({
        element: "starPanel",
        data
      });
    },
    hideStarPanel() {
      this.hideElement({
        element: "starPanel"
      });
    },
    showPreloader() {
      this.showElement({ element: "preloader" });
    },
    hidePreloader() {
      this.hideElement({ element: "preloader" });
    },
    showStartScreen() {
      this.showElement({ element: "startScreen" });
    },
    hideStartScreen() {
      this.hideElement({ element: "startScreen" });
    },
    showInterface() {
      this.showElement({ element: "interface" });
    },
    hideInterface() {
      this.hideElement({ element: "interface" });
    }
  },
  mounted() {
    // INFO: saved by client
    if (localStorage.getItem("musicVolume")) {
      this.musicVolume = Number(localStorage.getItem("musicVolume")) * 100;
      this._handleVolumeChange("music", this.musicVolume);
    }

    if (localStorage.getItem("sfxVolume")) {
      this.sfxVolume = Number(localStorage.getItem("sfxVolume")) * 100;
      this._handleVolumeChange("sfx", this.sfxVolume);
    }

    // INFO: client didnt send event when press escape
    document.body.addEventListener("fullscreenchange", () => {
      this.fullscreen = !this.fullscreen;
    });
  }
};
</script>
