import { Signal } from "./Signal";

export const GameEvents = {
    onShipModuleTypeChange: new Signal(),
    onShipSlotChanged: new Signal(),
    onShipSlotTextureChanged: new Signal(),
    onShipSlotColorChanged: new Signal(),
    onShipSlotHueChanged: new Signal(),
    onAllShipSlotsColorUpdate: new Signal(),

    onStarHover: new Signal(),
    onStarOut: new Signal(),
    onStarArrival: new Signal(),
    onStarLeave: new Signal(),
    onStarClick: new Signal(),

    onPlanetHover: new Signal(),
    onPlanetOut: new Signal(),

    onPlanetArrival: new Signal(),
    onPlanetLeave: new Signal(),
    onPlanetPick: new Signal(),
    onCurrentPlanetMissClick: new Signal(),

    onPlanetSectorSelected: new Signal(),
    onPlanetSectorUnselected: new Signal(),
    onPlanetSectorHover: new Signal(),
    onPlanetSectorOut: new Signal(),
    onPlanetSectorLeave: new Signal(),
    onPlanetSectorOpen: new Signal(),
    onPlanetSectorPick: new Signal(),
    
    onShipModuleLockHover: new Signal(),
    onShipModuleLockOut: new Signal(),

    onShipInputHover: new Signal(),
    onShipInputOut: new Signal(),

    onShipArrivedToCenter: new Signal(),
    onHangarCameraMovedByUser: new Signal(),

    // debug
    onDebugAxeHelperVisibleChange: new Signal(),
    onStationParamsChanged: new Signal()

}

