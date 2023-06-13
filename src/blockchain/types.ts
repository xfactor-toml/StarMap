declare global {
    interface Window {
      ethereum: any
    }
  }

export type Coords = {
    X: number,
    Y: number,
    Z: number
}

export type Race = "Waters" | "Humans" | "Insects" | "Lizards"

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
    mass: number,
    race: Race,
    coords: Coords
}

export type StarData = {
    id: number,
    owner: string,
    params: StarParams
}

export type connectRpc = {
    keepAlive: boolean,
    withCredentials: boolean,
    timeout: number, // ms
    headers: [
        {
            name: string,
            value: string
        }
    ]
  }

export type StarList = StarData[]

export type fuelTarget = "existence" | "levelup"

export type account = string | null