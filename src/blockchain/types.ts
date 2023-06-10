export type StarParams = {
    name: string,
    isLive: boolean,
    creation: number,  // timestamp
    updated: number,
    level: number,
    fuel: number,
    levelUpFuel: number,
    fuelSpendings: number, // per hour
    habitableZoneMin: number,
    habitableZoneMax: number,
    planetSlots: number,
}