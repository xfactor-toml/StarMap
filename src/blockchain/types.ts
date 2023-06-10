declare global {
    interface Window {
      ethereum: any
    }
  }

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

export type StarData = {
    id: number,
    owner: string,
    params: StarParams
}

export type StarList = StarData[]

export type account = string | null