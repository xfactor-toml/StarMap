import { GuiInterface, ClientData, GuiButton } from "./types";

export function Controller(GUI: GuiInterface) {
  // @ts-ignore
  let frontEvents;
  let currentStarId = -1;

  GUI.showPreloader();

  GUI.on("agreement", () => {
    frontEvents.playInitScreenSfx.dispatch();
  });

  GUI.on("run", (fullscreen) => {
    frontEvents.onClick.dispatch();
    frontEvents.startGame.dispatch(fullscreen);
    GUI.showInterface();
  });

  GUI.on("buttonClick", (buttonName: GuiButton) => {
    frontEvents.onClick.dispatch();

    switch (buttonName) {
      case "starPanelHide": {
        GUI.hideStarPanel();
        frontEvents.flyFromStar.dispatch();
        break;
      }

      case "starPanelPlay": {
        console.log("star panel play");
        break;
      }

      case "tooltipHide": {
        GUI.hideTooltip();
        frontEvents.starPreviewClose.dispatch();
        break;
      }

      case "tooltipDiveIn": {
        GUI.hideTooltip();
        frontEvents.diveIn.dispatch({
          starId: currentStarId
        });
        break;
      }
    }
  });

  GUI.on("buttonHover", (buttonName: GuiButton) => {
    frontEvents.onHover.dispatch();
  });

  GUI.on("overlayClick", () => {
    GUI.emit("buttonClick", "tooltipHide");
  });

  GUI.on("setMusicVolume", (volume: number) => {
    frontEvents.setMusicVolume.dispatch({ v: volume });
  });

  GUI.on("setSfxVolume", (volume: number) => {
    frontEvents.setSFXVolume.dispatch({ v: volume });
  });

  GUI.on("toggleFullscreen", () => {
    frontEvents.toggleFullscreen.dispatch();
  });

  window.addEventListener("gameEvent", (e: Event & { detail: ClientData }) => {
    const data = e.detail;

    switch (data.eventName) {
      case "GAME_LOADING":
        break;

      case "GAME_LOADED":
        // @ts-ignore
        frontEvents = e.detail.frontEvents;

        GUI.hidePreloader();
        GUI.showStartScreen();

        break;

      case "GAME_CREATED":
        GUI.hideStartScreen();

        break;

      case "GAME_FULLSCREEN":
        break;

      case "SHOW_STAR_PREVIEW":
        currentStarId = data.starId;
        GUI.showTooltip({ ...data, textAutofit: true });
        break;

      case "HIDE_STAR_PREVIEW":
        GUI.hideTooltip();
        break;

      case "SHOW_STAR_GUI":
        GUI.showStarPanel(data);
        break;
    }
  });

  return GUI;
}
