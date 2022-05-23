import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { ThreeLoader } from '../loaders/ThreeLoader';
import { MyMath } from '../utils/MyMath';
import { LogMng } from '../utils/LogMng';
import { sound } from '@pixi/sound';
import gsap from 'gsap';
import { Params } from '../data/Params';
import { Config } from '../data/Config';
import { FarStars } from '../objects/FarStars';
import { GalaxyStars } from '../objects/GalaxyStars';
import { GlobalEvents } from '../events/GlobalEvents';
import { DeviceInfo } from '../utils/DeviceInfo';

const STARS_COLORS_1 = [
    [0.505, 0.39, 0.3],
    [0.258, 0.282, 0.145],
    [0.694, 0.301, 0.282],
    [0.745, 0.635, 0.360],
    [0.431, 0.831, 0.819],
    [1.0, 0.901, 0.890]
];

const STARS_COLORS_2 = [
    [0.505, 0.39, 0.3],
    [0.258, 0.282, 0.145],
    [0.694, 0.301, 0.282],
    [0.745, 0.635, 0.360],
    [0.431, 0.831, 0.819],
    [1.0, 0.901, 0.890]
];

const STARS_COLORS_3 = [
    // orange
    // [0.505 * 255, 0.39 * 255, 0.3 * 255],

    // green
    // [0.258 * 255, 0.282 * 255, 0.145 * 255],

    // red
    // [0.694 * 255, 0.301 * 255, 0.282 * 255],

    // yellow
    // [0.745 * 255, 0.635 * 255, 0.360 * 255],

    // teal
    [0.431, 0.831, 0.819],
    [0.431, 0.831, 0.819],

    // violet
    [0xb3 / 255, 0x8d / 255, 0xf9 / 255],
    [0xb3 / 255, 0x8d / 255, 0xf9 / 255],
    [0xb3 / 255, 0x8d / 255, 0xf9 / 255],
    [0xb3 / 255, 0x8d / 255, 0xf9 / 255],
];

let layersNames = {
    1: 'first',
    2: 'second',
    3: 'third'
};

let planetsData = [
    // {
    //     preview: './assets/Star.svg',
    //     previewObject: null,
    //     physicalPlanet: [],
    //     modelsFolder: './assets/models/gasorpasorp/',
    //     layersCount: 3,
    //     planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
    //     position: new THREE.Vector3(70, 0, 0),
    //     name: "gasorpasorp",

    //     layersPerFrameTransformation: {
    //         1: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0125,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         2: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0125,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         3: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.003125,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         }
    //     },

    //     layersDefaultTransformation: {
    //         1: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         2: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.1,
    //                 y: 0.1,
    //                 z: 0.1
    //             }
    //         },
    //         3: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.2,
    //                 y: 0.2,
    //                 z: 0.2
    //             }
    //         }
    //     }
    // },
    // {
    //     preview: './assets/Star.svg',
    //     previewObject: null,
    //     physicalPlanet: [],
    //     modelsFolder: './assets/models/planeta_skwoth/',
    //     layersCount: 3,
    //     planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
    //     position: new THREE.Vector3(-70, 0, 35),
    //     name: "skwoth",

    //     layersPerFrameTransformation: {
    //         1: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0015,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         2: {
    //             rotation: {
    //                 x: 0.0015,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         3: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0015
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         }
    //     },

    //     layersDefaultTransformation: {
    //         1: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         2: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         3: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         }
    //     }
    // },
    // {
    //     preview: './assets/Star.svg',
    //     previewObject: null,
    //     physicalPlanet: [],
    //     modelsFolder: './assets/models/moon/',
    //     layersCount: 1,
    //     planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
    //     position: new THREE.Vector3(-25, 0, -75),
    //     name: "moon",

    //     layersPerFrameTransformation: {
    //         1: {
    //             rotation: {
    //                 x: 0.001,
    //                 y: 0.0015,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         2: {
    //             rotation: {
    //                 x: 0.003,
    //                 y: 0.002,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         3: {
    //             rotation: {
    //                 x: 0.0015,
    //                 y: 0.0013,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         }
    //     },

    //     layersDefaultTransformation: {
    //         1: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         2: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         3: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         }
    //     }
    // },
    // {
    //     preview: './assets/Star.svg',
    //     previewObject: null,
    //     physicalPlanet: [],
    //     modelsFolder: './assets/models/planetEarth/',
    //     layersCount: 1,
    //     planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
    //     position: new THREE.Vector3(30, 0, 65),
    //     name: "earth",

    //     layersPerFrameTransformation: {
    //         1: {
    //             rotation: {
    //                 x: 0.001,
    //                 y: 0.0015,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         2: {
    //             rotation: {
    //                 x: 0.003,
    //                 y: 0.002,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         3: {
    //             rotation: {
    //                 x: 0.0015,
    //                 y: 0.0013,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         }
    //     },

    //     layersDefaultTransformation: {
    //         1: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         2: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         3: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         }
    //     }
    // },
    // {
    //     preview: './assets/Star.svg',
    //     previewObject: null,
    //     physicalPlanet: [],
    //     modelsFolder: './assets/models/moon/',
    //     layersCount: 1,
    //     planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
    //     position: new THREE.Vector3(-75, 0, 1),
    //     name: "earth",

    //     layersPerFrameTransformation: {
    //         1: {
    //             rotation: {
    //                 x: 0.001,
    //                 y: 0.0015,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         2: {
    //             rotation: {
    //                 x: 0.003,
    //                 y: 0.002,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         3: {
    //             rotation: {
    //                 x: 0.0015,
    //                 y: 0.0013,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         }
    //     },

    //     layersDefaultTransformation: {
    //         1: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         2: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         3: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         }
    //     }
    // },
    // {
    //     preview: './assets/Star.svg',
    //     previewObject: null,
    //     physicalPlanet: [],
    //     modelsFolder: './assets/models/moon/',
    //     layersCount: 1,
    //     planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
    //     position: new THREE.Vector3(25, 0, -90),
    //     name: "earth",

    //     layersPerFrameTransformation: {
    //         1: {
    //             rotation: {
    //                 x: 0.001,
    //                 y: 0.0015,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         2: {
    //             rotation: {
    //                 x: 0.003,
    //                 y: 0.002,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         3: {
    //             rotation: {
    //                 x: 0.0015,
    //                 y: 0.0013,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         }
    //     },

    //     layersDefaultTransformation: {
    //         1: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         2: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         3: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         }
    //     }
    // },
    // {
    //     preview: './assets/Star.svg',
    //     previewObject: null,
    //     physicalPlanet: [],
    //     modelsFolder: './assets/models/moon/',
    //     layersCount: 1,
    //     planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
    //     position: new THREE.Vector3(45, 0, 110),
    //     name: "earth",

    //     layersPerFrameTransformation: {
    //         1: {
    //             rotation: {
    //                 x: 0.001,
    //                 y: 0.0015,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         2: {
    //             rotation: {
    //                 x: 0.003,
    //                 y: 0.002,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         3: {
    //             rotation: {
    //                 x: 0.0015,
    //                 y: 0.0013,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         }
    //     },

    //     layersDefaultTransformation: {
    //         1: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         2: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         3: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         }
    //     }
    // },
    // {
    //     preview: './assets/Star.svg',
    //     previewObject: null,
    //     physicalPlanet: [],
    //     modelsFolder: './assets/models/moon/',
    //     layersCount: 1,
    //     planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
    //     position: new THREE.Vector3(85, 0, -80),
    //     name: "earth",

    //     layersPerFrameTransformation: {
    //         1: {
    //             rotation: {
    //                 x: 0.001,
    //                 y: 0.0015,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         2: {
    //             rotation: {
    //                 x: 0.003,
    //                 y: 0.002,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         3: {
    //             rotation: {
    //                 x: 0.0015,
    //                 y: 0.0013,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         }
    //     },

    //     layersDefaultTransformation: {
    //         1: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         2: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         3: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         }
    //     }
    // },
    // {
    //     preview: './assets/Star.svg',
    //     previewObject: null,
    //     physicalPlanet: [],
    //     modelsFolder: './assets/models/planet_x/',
    //     layersCount: 3,
    //     planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
    //     position: new THREE.Vector3(120, 0, 80),
    //     name: "planet_x",

    //     layersPerFrameTransformation: {
    //         1: {
    //             rotation: {
    //                 x: 0.001,
    //                 y: 0.0015,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         2: {
    //             rotation: {
    //                 x: 0.003,
    //                 y: 0.002,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         3: {
    //             rotation: {
    //                 x: 0.0015,
    //                 y: 0.0013,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         }
    //     },

    //     layersDefaultTransformation: {
    //         1: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         2: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         },
    //         3: {
    //             rotation: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             },
    //             scale: {
    //                 x: 0.0,
    //                 y: 0.0,
    //                 z: 0.0
    //             }
    //         }
    //     }
    // }
];

let checkMousePointerTimer = 0;

type GalaxyParams = {
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

export type GalaxyStarParams = {

    pos: {
        x: number;
        y: number;
        z: number;
    },

    // normalized RGBA
    color: {
        r: number;
        g: number;
        b: number;
        a: number;
    },

    scale: number;

    blink?: {
        isFade: boolean;
        duration: number;
        progressTime: number;
        tweenFunction: Function;
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

let debugObjects = {
    farStarsSphereMin: null,
    farStarsSphereMax: null,
}

export class Galaxy {
    private scene: THREE.Scene;
    // private sceneBg: THREE.Scene;
    private camera: THREE.PerspectiveCamera;

    private galaxyPlane: THREE.Mesh;
    private sprGalaxyCenter: THREE.Sprite;
    private sprGalaxyCenter2: THREE.Sprite;

    private galaxyStarsData: GalaxyStarParams[];
    private galaxyStarSprites: THREE.Sprite[];

    private starsParticles: GalaxyStars;
    private blinkStarsParticles: GalaxyStars;

    private blinkStarsData: GalaxyStarParams[];
    private blinkStars: THREE.Sprite[];

    private farStars: FarStars;

    private farGalaxiesData: FarGalaxyParams[];
    private smallGalaxies: THREE.Mesh[];

    private camOrbit: OrbitControls;

    private raycaster: THREE.Raycaster;

    constructor(aParams: any) {
        this.scene = aParams.scene;
        // this.sceneBg = aParams.backScene;
        this.camera = aParams.camera;
    }

    init() {

        this.camera.position.set(-90, 120, 180);

        this.createSkybox2();

        this.createSmallGalaxies(true);

        // main galaxy sprite
        this.galaxyPlane = this.createGalaxyPlane();
        this.scene.add(this.galaxyPlane);

        // galaxy center sprite
        this.sprGalaxyCenter = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: ThreeLoader.getInstance().getTexture('sun_01'),
                color: 0xFFCCCC,
                transparent: true,
                opacity: 1,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            })
        );
        this.sprGalaxyCenter.scale.set(Config.GALAXY_CENTER_SCALE, Config.GALAXY_CENTER_SCALE, Config.GALAXY_CENTER_SCALE);
        this.sprGalaxyCenter.renderOrder = 999;
        this.scene.add(this.sprGalaxyCenter);

        this.sprGalaxyCenter2 = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: ThreeLoader.getInstance().getTexture('sun_romb'),
                color: 0xFFCCCC,
                transparent: true,
                opacity: 1,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            })
        );
        this.sprGalaxyCenter2.scale.set(Config.GALAXY_CENTER_SCALE_2, Config.GALAXY_CENTER_SCALE_2, Config.GALAXY_CENTER_SCALE_2);
        this.sprGalaxyCenter2.renderOrder = 999;
        this.scene.add(this.sprGalaxyCenter2);


        this.createGalaxyStars(true);

        // OUT STARS
        this.createFarStars();

        // PLANETS

        planetsData.forEach((planet, planetIndex) => {

            var previewTexture = new THREE.TextureLoader().load(planet.preview);
            var previewMaterial = new THREE.SpriteMaterial({
                map: previewTexture,
                depthWrite: false
            });
            var newPlanetPreview = new THREE.Sprite(previewMaterial);

            newPlanetPreview.scale.set(12, 12, 12);
            newPlanetPreview.position.set(planet.position.x, planet.position.y, planet.position.z);

            newPlanetPreview.name = "planetPreview";

            newPlanetPreview.renderOrder = 1;

            this.scene.add(newPlanetPreview);

            for (let layer = 1; layer < planet.layersCount + 1; layer++) {

                new MTLLoader().load(planet.modelsFolder + layersNames[layer] + "_layer.mtl", (materials) => {
                    const currentLayer = layer;

                    materials.preload();

                    var objLoader = new OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load(planet.modelsFolder + layersNames[currentLayer] + "_layer.obj", (model) => {

                        model.scale.set(planet.planetScale.x, planet.planetScale.y, planet.planetScale.z);
                        planetsData[planetIndex].physicalPlanet[currentLayer] = model;

                        if (currentLayer == 1) {
                            (model.children[0] as any).material.transparent = false;
                        }

                        model.scale.x += planetsData[planetIndex].layersDefaultTransformation[currentLayer].scale.x;
                        model.scale.y += planetsData[planetIndex].layersDefaultTransformation[currentLayer].scale.y;
                        model.scale.z += planetsData[planetIndex].layersDefaultTransformation[currentLayer].scale.z;

                        model.rotation.x = planetsData[planetIndex].layersDefaultTransformation[currentLayer].rotation.x;
                        model.rotation.y = planetsData[planetIndex].layersDefaultTransformation[currentLayer].rotation.y;
                        model.rotation.z = planetsData[planetIndex].layersDefaultTransformation[currentLayer].rotation.z;

                        model.position.set(planet.position.x, planet.position.y, planet.position.z);
                        (model.children[0] as any).material.visible = false;
                        this.scene.add(model);

                        model.name = planetsData[planetIndex].name;

                    });

                });

            }

            planetsData[planetIndex].previewObject = newPlanetPreview;
        });

        let minCameraDistance = 50;
        let maxCameraDistance = 500;
        if (!DeviceInfo.getInstance().desktop) maxCameraDistance = 1000;
        this.createCameraControls({
            minDist: minCameraDistance,
            maxDist: maxCameraDistance,
            stopAngleTop: 10,
            stopAngleBot: 170,
            pos: { x: 5, y: 0, z: 0 }
        });

        this.raycaster = new THREE.Raycaster();

        // pixi music
        sound.add('music', './assets/audio/vorpal-12.mp3');
        sound.play('music');

        // document.addEventListener('pointermove', onMouseMove);
        // document.addEventListener('click', onMouseClick);
        // document.addEventListener('keydown', onKeyPress);

    }

    initDebugGui() {
        const DEBUG_PARAMS = {
            'center visible': true,
            'recreate': () => {
                this.createGalaxyStars();
            },
            'recreateSmallGalaxies': () => {
                this.createSmallGalaxies();
            },
            'saveState': () => {
                this.saveState();
            },
            showSpheres: false,
            axiesHelper: false
        };

        const gui = Params.datGui;

        let galaxyFolder = gui.addFolder('Galaxy');

        galaxyFolder.add(Params.galaxyData, 'starsCount', 0, 10000, 100).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'blinkStarsCount', 0, 5000, 100).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'blinkDurMin', 0.1, 10, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'blinkDurMax', 1, 20, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'startAngle', 0, 2, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'endAngle', 0, Math.PI * 2, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'startOffsetXY', 0, 3, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'endOffsetXY', 0, 3, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'startOffsetH', 0, 10, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'endOffsetH', 0, 10, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'alphaMin', 0, 1, 0.02).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'alphaMax', 0, 1, 0.02).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'scaleMin', 0.5, 4, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'scaleMax', 0.5, 4, 0.1).onChange(() => { this.createGalaxyStars(); });
        //galaxyFolder.add(Params.galaxyData, 'k', 0, 1, 0.02).onChange(() => { this.createGalaxyStars(); });
        // galaxyFolder.add(Params.galaxyData, 'isNewMethod').onChange(() => { this.createGalaxyStars(); });

        galaxyFolder.add(DEBUG_PARAMS, 'center visible', true).onChange((value) => {
            this.centerVisible = value;
        });

        galaxyFolder.add(DEBUG_PARAMS, 'recreate');

        let skyFolder = gui.addFolder('Sky');

        skyFolder.add(Params.skyData, 'starsCount', 0, 2000, 10).onChange(() => { this.createFarStars(); });
        skyFolder.add(Params.skyData, 'radiusMin', 0, 500, 5).onChange(() => {
            this.createFarStars();
            if (DEBUG_PARAMS.showSpheres === true) this.createFarStarsMinSphere();
        });
        skyFolder.add(Params.skyData, 'radiusMax', 10, 2000, 10).onChange(() => {
            this.createFarStars();
            if (DEBUG_PARAMS.showSpheres === true) this.createFarStarsMaxSphere();
        });
        skyFolder.add(DEBUG_PARAMS, 'showSpheres').onChange((v: boolean) => {
            if (v) {
                this.createFarStarsMinSphere();
                this.createFarStarsMaxSphere();
            }
            else {
                if (debugObjects.farStarsSphereMin) debugObjects.farStarsSphereMin.visible = false;
                if (debugObjects.farStarsSphereMax) debugObjects.farStarsSphereMax.visible = false;
            }
        });
        skyFolder.add(Params.skyData, 'scaleMin', 0.1, 10, 0.1).onChange(() => { if (this.farStars) this.farStars.updateUniformValues(); });
        skyFolder.add(Params.skyData, 'scaleMax', 1, 50, 1).onChange(() => { if (this.farStars) this.farStars.updateUniformValues(); });
        skyFolder.add(Params.skyData, 'starSize', 0.1, 10, 0.1).onChange(() => { if (this.farStars) this.farStars.updateUniformValues(); });
        skyFolder.add(Params.skyData, 'starAlpha', 0, 1, 0.1).onChange(() => { if (this.farStars) this.farStars.updateUniformValues(); });
        skyFolder.add(Params.skyData, 'galaxiesCount', 0, 100, 1).onChange(() => { this.createSmallGalaxies(); });
        skyFolder.add(Params.skyData, 'galaxiesSizeMin', 100, 5000, 10).onChange(() => { this.createSmallGalaxies(); });
        skyFolder.add(Params.skyData, 'galaxiesSizeMax', 100, 8000, 10).onChange(() => { this.createSmallGalaxies(); });
        skyFolder.add(DEBUG_PARAMS, 'recreateSmallGalaxies');

        gui.add(DEBUG_PARAMS, 'saveState');

        // galaxyFolder.open();
    }

    private createGalaxyPlane(): THREE.Mesh {
        let t = ThreeLoader.getInstance().getTexture('galaxySprite');
        let galaxy = new THREE.Mesh(
            new THREE.PlaneGeometry(350, 350),
            new THREE.MeshBasicMaterial({
                map: t,
                side: THREE.DoubleSide,
                transparent: true,
                depthWrite: false,
                opacity: 1.0,
                blending: THREE.AdditiveBlending
            })
        );
        galaxy.rotation.x = -Math.PI / 2;
        galaxy.rotation.z = -1.2;
        // galaxyPlane.position.y = -1;
        // galaxyPlane.position.z = 9;
        return galaxy;
    }

    private createGalaxyStars(aLoadFromFile = false) {

        this.destroyGalaxyStars();

        let aGalaxyStarsData: any;
        let aGalaxyBlinkStarsData: any;
        if (aLoadFromFile) {
            let loader = ThreeLoader.getInstance();
            let loadData = loader.getJSON('galaxyState');
            if (loadData) {
                aGalaxyStarsData = loadData.galaxyStarsData;
                aGalaxyBlinkStarsData = loadData.blinkStarsData;
            }
        }

        // galaxy static stars data generate
        if (aGalaxyStarsData) {
            this.galaxyStarsData = aGalaxyStarsData;
        }
        else {
            this.galaxyStarsData = this.generateGalaxyStars({
                starsCount: Params.galaxyData.starsCount,
                startAngle: Params.galaxyData.startAngle,
                endAngle: Params.galaxyData.endAngle,
                startOffsetXY: Params.galaxyData.startOffsetXY,
                endOffsetXY: Params.galaxyData.endOffsetXY,
                startOffsetH: Params.galaxyData.startOffsetH,
                endOffsetH: Params.galaxyData.endOffsetH,
                k: Params.galaxyData.k,
                alphaMin: Params.galaxyData.alphaMin,
                alphaMax: Params.galaxyData.alphaMax,
                scaleMin: Params.galaxyData.scaleMin,
                scaleMax: Params.galaxyData.scaleMax
            }, 145, 145, STARS_COLORS_2);
        }

        // blink stars data generate
        if (aGalaxyBlinkStarsData) {
            this.blinkStarsData = aGalaxyBlinkStarsData;
        }
        else {
            this.blinkStarsData = this.generateGalaxyStars({
                starsCount: Params.galaxyData.blinkStarsCount,
                startAngle: Params.galaxyData.startAngle,
                endAngle: Params.galaxyData.endAngle,
                startOffsetXY: Params.galaxyData.startOffsetXY,
                endOffsetXY: Params.galaxyData.endOffsetXY,
                startOffsetH: Params.galaxyData.startOffsetH,
                endOffsetH: Params.galaxyData.endOffsetH,
                k: Params.galaxyData.k,
                alphaMin: Params.galaxyData.alphaMin,
                alphaMax: Params.galaxyData.alphaMax,
                scaleMin: Params.galaxyData.scaleMin,
                scaleMax: Params.galaxyData.scaleMax,
            },
                145, 145,
                STARS_COLORS_2,
                {
                    durationMin: Params.galaxyData.blinkDurMin,
                    durationMax: Params.galaxyData.blinkDurMax
                }
            );
        }

        // particle stars
        let t = ThreeLoader.getInstance().getTexture('star4');
        this.starsParticles = new GalaxyStars({
            starsData: this.galaxyStarsData,
            texture: t,
            onWindowResizeSignal: GlobalEvents.onWindowResizeSignal
        });

        this.scene.add(this.starsParticles);

        // blink particle stars
        this.blinkStarsParticles = new GalaxyStars({
            starsData: this.blinkStarsData,
            texture: t,
            onWindowResizeSignal: GlobalEvents.onWindowResizeSignal
        });

        this.scene.add(this.blinkStarsParticles);

    }

    private generateGalaxyStars(aParams: GalaxyParams, xScale: number, zScale: number, aColorSet: any[], aBlinkData?: any): GalaxyStarParams[] {

        if (!aParams.startAngle) aParams.startAngle = 0;
        if (!aParams.endAngle) aParams.endAngle = Math.PI;
        if (!aParams.startOffsetXY) aParams.startOffsetXY = 0;
        if (!aParams.endOffsetXY) aParams.endOffsetXY = 0;
        if (!aParams.startOffsetH) aParams.startOffsetH = 0;
        if (!aParams.endOffsetH) aParams.endOffsetH = 0;
        if (!aParams.k) aParams.k = 0.3;
        if (!aParams.alphaMin) aParams.alphaMin = 1;
        if (!aParams.alphaMax) aParams.alphaMax = 1;
        if (!aParams.scaleMin) aParams.scaleMin = 1;
        if (!aParams.scaleMax) aParams.scaleMax = 1;

        let resData: GalaxyStarParams[] = [];
        const numArms = 5;
        const armDeltaAngle = 2 * Math.PI / numArms;

        // check
        if (aParams.startAngle > aParams.endAngle) aParams.startAngle = aParams.endAngle;

        for (let i = 0; i < aParams.starsCount; i++) {
            // choose an angle
            // let angle = Math.pow(Math.random(), 2) * maxAngle;
            // let angle = Math.pow(MyMath.randomInRange(minAngleFactor, 1), 2) * maxAngle;
            let dtAngle = aParams.endAngle - aParams.startAngle;
            let anglePercent = Math.pow(Math.random(), 2);
            let angle = aParams.startAngle + anglePercent * dtAngle;
            let r = aParams.k * angle;

            // set random galaxy arm
            let armId = MyMath.randomIntInRange(0, numArms - 1);
            let armAngle = angle + armId * armDeltaAngle;
            if (armId == 1) armAngle += .2;

            // convert polar coordinates to 2D
            let px = r * Math.cos(armAngle);
            let py = r * Math.sin(armAngle);

            // offset xy
            let offsetXY = aParams.startOffsetXY + anglePercent * (aParams.endOffsetXY - aParams.startOffsetXY);
            offsetXY *= 0.05;
            // let randomOffsetXY = 0.01 + (maxAngle - angle) * 0.03;
            let randomOffsetX = offsetXY * MyMath.randomInRange(-1, 1);
            let randomOffsetY = offsetXY * MyMath.randomInRange(-1, 1);

            px += randomOffsetX;
            py += randomOffsetY;

            // offset h
            let offsetH = aParams.startOffsetH + anglePercent * (aParams.endOffsetH - aParams.startOffsetH);
            offsetH = offsetH * MyMath.randomInRange(-1, 1);

            let clr = new THREE.Color(1, 1, 1);

            let customStarColor = aColorSet[MyMath.randomIntInRange(0, aColorSet.length - 1)];
            clr.r = customStarColor[0];
            clr.g = customStarColor[1];
            clr.b = customStarColor[2];

            // make result
            resData[i] = {
                pos: {
                    x: px * xScale,
                    y: offsetH,
                    z: py * zScale
                },
                color: {
                    r: clr.r,
                    g: clr.g,
                    b: clr.b,
                    a: MyMath.randomInRange(aParams.alphaMin, aParams.alphaMax)
                },
                scale: MyMath.randomInRange(aParams.scaleMin, aParams.scaleMax)
            };

            if (aBlinkData) {
                let dur = MyMath.randomInRange(aBlinkData.durationMin, aBlinkData.durationMax);
                resData[i].blink = {
                    isFade: Math.random() > 0.5,
                    duration: dur,
                    progressTime: MyMath.randomInRange(0, dur),
                    tweenFunction: MyMath.easeInOutSine
                }
            }
            
        }

        return resData;
    }

    private createStarSprite(aSpriteAlias: string, aStarData: GalaxyStarParams): THREE.Sprite {
        let t = ThreeLoader.getInstance().getTexture(aSpriteAlias);

        let mat = new THREE.SpriteMaterial({
            map: t,
            color: new THREE.Color(aStarData.color.r, aStarData.color.g, aStarData.color.b),
            transparent: true,
            opacity: aStarData.color.a,
            depthWrite: false,
            depthTest: true,
            blending: THREE.AdditiveBlending
        });
        let sprite = new THREE.Sprite(mat);
        sprite.scale.set(aStarData.scale, aStarData.scale, aStarData.scale);
        sprite.position.set(aStarData.pos.x, aStarData.pos.y, aStarData.pos.z);
        return sprite;
    }

    private destroyGalaxyStars() {
        if (this.galaxyStarSprites)
            for (let i = this.galaxyStarSprites.length - 1; i >= 0; i--) {
                this.scene.remove(this.galaxyStarSprites[i]);
            }
        this.galaxyStarSprites = [];

        if (this.blinkStars)
            for (let i = this.blinkStars.length - 1; i >= 0; i--) {
                let spr = this.blinkStars[i];
                spr['stopBlinkAnimation'] = true;
                this.scene.remove(spr);
            }
        this.blinkStars = [];

        if (this.starsParticles) {
            this.starsParticles.free();
            this.starsParticles = null;
        }

        if (this.blinkStarsParticles) {
            this.blinkStarsParticles.free();
            this.blinkStarsParticles = null;
        }
    }

    private createFarStars() {

        if (this.farStars) {
            this.scene.remove(this.farStars);
            this.farStars.free();
            this.farStars = null;
        }

        this.farStars = new FarStars({
            starsCount: Params.skyData.starsCount,
            // radiusMin: Params.skyData.radiusMin,
            // radiusMax: Params.skyData.radiusMax
        });

        this.scene.add(this.farStars);

    }

    private createFarStarsMinSphere() {
        if (debugObjects.farStarsSphereMin) {
            this.scene.remove(debugObjects.farStarsSphereMin);
        }
        let geom = new THREE.SphereGeometry(Params.skyData.radiusMin, 10, 10);
        let mat = new THREE.MeshNormalMaterial({
            wireframe: true
        });
        debugObjects.farStarsSphereMin = new THREE.Mesh(geom, mat);
        this.scene.add(debugObjects.farStarsSphereMin);
    }

    private createFarStarsMaxSphere() {
        if (debugObjects.farStarsSphereMax) {
            this.scene.remove(debugObjects.farStarsSphereMax);
        }
        let geom = new THREE.SphereGeometry(Params.skyData.radiusMax, 20, 20);
        let mat = new THREE.MeshNormalMaterial({
            wireframe: true
        });
        debugObjects.farStarsSphereMax = new THREE.Mesh(geom, mat);
        this.scene.add(debugObjects.farStarsSphereMax);
    }

    // private createSkybox(aScene: THREE.Scene) {
    //     let loader = ThreeLoader.getInstance();
    //     let imagePrefix = "skybox1-";
    //     let directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    //     let materialArray = [];
    //     for (let i = 0; i < directions.length; i++)
    //         materialArray.push(new THREE.MeshBasicMaterial({
    //             map: loader.getTexture(imagePrefix + directions[i]),
    //             side: THREE.BackSide,
    //             // depthTest: false,
    //             // depthWrite: false,
    //             // transparent: true,
    //             // opacity: 1.,
    //             // wireframe: true
    //         }));

    //     let imgArray = [];
    //     for (let i = 0; i < directions.length; i++)
    //         imgArray.push(loader.getTexture(imagePrefix + directions[i]).image);

    //     let size = Config.SKY_BOX_SIZE;
    //     let skyGeometry = new THREE.BoxBufferGeometry(size, size, size);
    //     let skyBox = new THREE.Mesh(skyGeometry, materialArray);
    //     skyBox.position.set(0, 0, 0);
    //     skyBox.renderOrder = -100;
    //     aScene.add(skyBox);
    // }

    private createSkybox2() {
        let loader = ThreeLoader.getInstance();
        this.scene.background = loader.getCubeTexture('skybox');
    }

    
    // SMALL GALAXIES

    private createSmallGalaxies(aLoadFromFile = false) {

        this.destroySmallGalaxies();

        let loadData: FarGalaxyParams[];
        if (aLoadFromFile) {
            let loader = ThreeLoader.getInstance();
            let fileData = loader.getJSON('galaxyState');
            if (fileData && fileData.farGalaxiesData) {
                loadData = fileData.farGalaxiesData;
            }
        }

        if (loadData) {
            this.farGalaxiesData = loadData;
        }
        else {
            this.farGalaxiesData = this.generateFarGalaxiesData();
        }

        this.smallGalaxies = [];
        for (let i = 0; i < this.farGalaxiesData.length; i++) {
            const galaxy = this.createSmallGalaxy(this.farGalaxiesData[i]);
            this.smallGalaxies.push(galaxy);
            this.scene.add(galaxy);
        }

    }

    private destroySmallGalaxies() {
        if (this.smallGalaxies)
            for (let i = this.smallGalaxies.length - 1; i >= 0; i--) {
                this.scene.remove(this.smallGalaxies[i]);
            }
        this.smallGalaxies = [];
        this.farGalaxiesData = [];
    }

    private generateFarGalaxiesData(): FarGalaxyParams[] {

        const radius = MyMath.randomInRange(Config.FAR_GALAXIES_RADIUS_MIN, Config.FAR_GALAXIES_RADIUS_MAX);

        let res = [];
        let positions: THREE.Vector3[] = [];

        let ids = Array.from(Array(Config.SMALL_GALAXIES_SPRITE_COUNT - 1).keys());
        MyMath.shuffleArray(ids, 4);

        let galaxyCnt = Params.skyData.galaxiesCount;
        let k = 0;

        for (let i = 0; i < galaxyCnt; i++) {

            if (k >= ids.length) k = 0;
            let tNum = ids[k] + 1;
            k++;
            let tName = `galaxy_${tNum.toString().padStart(2, '0')}`;
            let size = MyMath.randomInRange(Params.skyData.galaxiesSizeMin, Params.skyData.galaxiesSizeMax);
            let alpha = MyMath.randomInRange(0.5, 0.6);

            let pos = new THREE.Vector3();
            let posDone = false;
            let limitTries = 1000;

            while (!posDone) {
                posDone = true;
                pos.set(
                    MyMath.randomInRange(-10, 10),
                    MyMath.randomInRange(-10, 10),
                    MyMath.randomInRange(-10, 10)).
                    normalize().
                    multiplyScalar(radius);
                for (let i = 0; i < positions.length; i++) {
                    const g = positions[i];
                    if (g.distanceTo(pos) <= radius) {
                        posDone = false;
                    }
                }
                limitTries--;
                if (limitTries <= 0) posDone = true;
            }

            positions.push(pos);

            let dir = new THREE.Vector3(
                MyMath.randomInRange(-10, 10),
                MyMath.randomInRange(-10, 10),
                MyMath.randomInRange(-10, 10)).
                normalize().
                multiplyScalar(radius / 2);

            let rotationSpeed = MyMath.randomInRange(0.01, 0.03);



            const galaxyData = {
                textureName: tName,
                pos: {
                    x: pos.x,
                    y: pos.y,
                    z: pos.z
                },
                size: size,
                alpha: alpha,
                dir: {
                    x: dir.x,
                    y: dir.y,
                    z: dir.z
                },
                rotationSpeed: rotationSpeed
            };

            res.push(galaxyData);

        }

        return res;
    }

    private createSmallGalaxy(aGalaxyParams: FarGalaxyParams): THREE.Mesh {

        let tName = aGalaxyParams.textureName;
        // let size = MyMath.randomInRange(Params.skyData.galaxiesSizeMin, Params.skyData.galaxiesSizeMax);
        let size = aGalaxyParams.size;

        let loader = ThreeLoader.getInstance();
        
        let t = loader.getTexture(tName);
        let mat = new THREE.MeshBasicMaterial({
            map: t,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: aGalaxyParams.alpha,
            // depthTest: false,
            depthWrite: false,
            // blending: THREE.AdditiveBlending
        });

        let geom = new THREE.PlaneGeometry(size, size, 1, 1);

        let galaxy = new THREE.Mesh(geom, mat);
        galaxy.renderOrder = -90;

        galaxy.position.set(
            aGalaxyParams.pos.x,
            aGalaxyParams.pos.y,
            aGalaxyParams.pos.z
        );

        let dir = new THREE.Vector3(
            aGalaxyParams.dir.x,
            aGalaxyParams.dir.y,
            aGalaxyParams.dir.z
        );
        galaxy.lookAt(dir);
        galaxy['rotSpeed'] = aGalaxyParams.rotationSpeed;
        return galaxy;
    }



    private createCameraControls(aParams?: any) {

        if (this.camOrbit) return;
        if (!aParams) aParams = {};
        let domElement = Params.domCanvasParent;
        this.camOrbit = new OrbitControls(this.camera, domElement);
        if (!aParams.noTarget)
            this.camOrbit.target = new THREE.Vector3();
        this.camOrbit.enabled = !(aParams.isOrbitLock == true);
        this.camOrbit.rotateSpeed = .5;
        this.camOrbit.enableDamping = true;
        this.camOrbit.dampingFactor = 0.025;
        this.camOrbit.zoomSpeed = aParams.zoomSpeed || 1;
        this.camOrbit.enablePan = aParams.enablePan == true;
        // this.camOrbitCtrl.keys = {};
        this.camOrbit.minDistance = aParams.minDist || 1;
        this.camOrbit.maxDistance = aParams.maxDist || 100;
        this.camOrbit.minPolarAngle = MyMath.toRadian(aParams.stopAngleTop || 0); // Math.PI / 2.5;
        // camOrbit.maxPolarAngle = Math.PI - an;
        this.camOrbit.maxPolarAngle = MyMath.toRadian(aParams.stopAngleBot || 0);
        if (aParams.pos) {
            this.camOrbit.target.x = aParams.pos.x || 0;
            this.camOrbit.target.y = aParams.pos.y || 0;
            this.camOrbit.target.z = aParams.pos.z || 0;
        }
        this.camOrbit.update();
        this.camOrbit.addEventListener('change', () => {
        });
        this.camOrbit.addEventListener('end', () => {
        });

    }

    private checkMousePointer() {

        // this.raycaster.setFromCamera(mouseNormal, this.camera);
        // const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        // let isHover = false;

        // intersects.forEach((object) => {
        //     if (object.object.type == 'Sprite') {
        //         objectHovered = object.object;
        //         if (objectHovered['name'] == 'planetPreview') {
        //             document.body.style.cursor = 'pointer';
        //             isHover = true;
        //         }
        //     }
        // });

        // if (!isHover) {
        //     document.body.style.cursor = 'default';
        // }

    }
    
    public set centerVisible(v: boolean) {
        this.sprGalaxyCenter.visible = v;
        this.sprGalaxyCenter2.visible = v;
    }
    
    private saveState() {
        function download(content, fileName, contentType) {
            var a = document.createElement("a");
            var file = new Blob([content], { type: contentType });
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
        }
        
        let saveData = {
            galaxyStarsData: this.galaxyStarsData,
            galaxyBlinkStarsData: this.blinkStarsData,
            farGalaxiesData: this.farGalaxiesData

        };

        let jsonData = JSON.stringify(saveData);
        
        // var fs = require('fs');
        // fs.writeFile("test.json", jsonData, (err) => {
        //     if (err) {
        //         console.log(err);
        //     }
        // });

        download(jsonData, 'galaxyState.json', 'text/plain');
    }

    private updateGalaxyCenter() {
        let cameraPolarAngle = this.camOrbit.getPolarAngle();

        if (this.sprGalaxyCenter) {
            // debugger;
            // console.log(`polarAngle: ${polarAngle}`);
            const scMin = 0.1;
            let anFactor = scMin + (1 - scMin) * (1 - (cameraPolarAngle / (Math.PI / 2)));
            if (cameraPolarAngle > Math.PI / 2) {
                anFactor = scMin + (1 - scMin) * (1 - (Math.abs(cameraPolarAngle - Math.PI) / (Math.PI / 2)));
            }
            this.sprGalaxyCenter.scale.y = Config.GALAXY_CENTER_SCALE * anFactor;
        }

        if (this.sprGalaxyCenter2) {
            // debugger;
            // console.log(`polarAngle: ${polarAngle}`);
            const scMin = 0.3;
            let anFactor = scMin + (1 - scMin) * (1 - (cameraPolarAngle / (Math.PI / 2)));
            if (cameraPolarAngle > Math.PI / 2) {
                anFactor = scMin + (1 - scMin) * (1 - (Math.abs(cameraPolarAngle - Math.PI) / (Math.PI / 2)));
            }
            this.sprGalaxyCenter2.scale.y = Config.GALAXY_CENTER_SCALE_2 * anFactor;
        }
    }

    update(dt: number) {

        // let dtMs = dt * 1000;

        let cameraAzimutAngle = this.camOrbit.getAzimuthalAngle();
        let cameraPolarAngle = this.camOrbit.getPolarAngle();

        if (this.blinkStarsParticles) this.blinkStarsParticles.update(dt);

        // far stars
        this.farStars.azimutAngle = cameraAzimutAngle;
        this.farStars.polarAngle = cameraPolarAngle;
        this.farStars.update(dt);
        
        // let cameraRotationFactor = Math.abs(cameraPolarAngle - Math.PI / 2);

        // rotate small galaxies

        for (let i = 0; i < this.smallGalaxies.length; i++) {
            const g = this.smallGalaxies[i];
            if (g) g.rotateZ(g['rotSpeed'] * dt);
        }

        // opacity of the main galaxy plane

        if (this.galaxyPlane) {
            if (cameraPolarAngle < Math.PI / 2) {
                this.galaxyPlane.material['opacity'] = 0.1 + (1 - (cameraPolarAngle / (Math.PI / 2))) * 0.9;
            } else {
                this.galaxyPlane.material['opacity'] = 0.1 + (1 - (Math.abs(cameraPolarAngle - Math.PI) / (Math.PI / 2))) * 0.9;
            }
        }

        this.updateGalaxyCenter();

        this.camOrbit.update();

        checkMousePointerTimer -= dt;
        if (checkMousePointerTimer <= 0) {
            checkMousePointerTimer = 0.1;
            this.checkMousePointer();
        }

    }

}