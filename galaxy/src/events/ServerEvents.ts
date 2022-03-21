import { Signal } from "./Signal";

export const ServerEvents = {
    onGuiCameraZoom: new Signal(),
    onGuiCameraAutoRotation: new Signal(),
    onResetStarmapScene: new Signal(),
    onMoveToStar: new Signal(),
    onMoveToPlanet: new Signal(),
    onMoveToSector: new Signal(),
    onSetPlanetData: new Signal(),
    onMoveFromPlanetToSystem: new Signal(),
    onMoveFromSystem: new Signal(),
    onMoveFromSectorToPlanet: new Signal(),
    onPlanetSectorsVisibleChange: new Signal(),

    // fly

    // main moveTo method
    onMoveTo: new Signal(),
}
