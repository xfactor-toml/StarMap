
export type GalaxyParams = {
    starsCount: number;
    startAngle?: number;
    endAngle?: number;
    startOffsetXY?: number;
    endOffsetXY?: number;
    startOffsetH?: number;
    endOffsetH?: number;
    k?: number;
    alphaMin?: number;
    alphaMax?: number;
    scaleMin?: number;
    scaleMax?: number;
};

export type GalaxyCircleParams = {
    starsCount: number;
    minRadius?: number;
    maxRadius: number;
    alphaMin?: number;
    alphaMax?: number;
    scaleMin?: number;
    scaleMax?: number;
};

export type GalaxyStarParams = {

    id?: number;

    pos: {
        x: number;
        y: number;
        z: number;
    }

    // normalized RGBA
    color: {
        r: number;
        g: number;
        b: number;
        a: number;
    }

    scale: number;

    blink?: {
        isFade: boolean;
        duration: number;
        progressTime: number;
        tweenFunction: Function;
    }

    // new data
    starInfo?: {
        name: string;
        description: string;
        level: number;
        raceId: number;
        planetSlots: number;
        energy: number;
        life: number;
        bigStar: {
            starSize: number;
            color: {
                main: { r: number; g: number; b: number; },
                corona: { r: number; g: number; b: number; }
            }
        }
    }

};

export type FarGalaxyParams = {
    textureName: string;
    pos: {
        x: number;
        y: number;
        z: number;
    },
    size: number;
    alpha: number;
    dir: {
        x: number;
        y: number;
        z: number;
    },
    rotationSpeed: number;
};

export type ServerStarParams = {
    name: string,
    isLive: boolean,
    creation: number,
    updated: number,
    level: number,
    fuel: number,
    levelUpFuel: number,
    fuelSpendings: number,
    habitableZoneMin: number,
    habitableZoneMax: number,
    planetSlots: number,
    mass: number,
    race: string,
    coords: {
        X: number,
        Y: number,
        Z: number
    }
}

export type ServerStarData = {
    id: number,
    owner: string,
    params: ServerStarParams
}

