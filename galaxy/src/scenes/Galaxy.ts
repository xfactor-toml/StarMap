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

const STARS_1_COLORS = [
    [0.505 * 255, 0.39 * 255, 0.3 * 255],
    [0.258 * 255, 0.282 * 255, 0.145 * 255],
    [0.694 * 255, 0.301 * 255, 0.282 * 255],
    [0.745 * 255, 0.635 * 255, 0.360 * 255],
    [0.431 * 255, 0.831 * 255, 0.819 * 255],
    [1.0 * 255, 0.901 * 255, 0.890 * 255]
];

const STARS_2_COLORS = [
    [0.505 * 255, 0.39 * 255, 0.3 * 255],
    [0.258 * 255, 0.282 * 255, 0.145 * 255],
    [0.694 * 255, 0.301 * 255, 0.282 * 255],
    [0.745 * 255, 0.635 * 255, 0.360 * 255],
    [0.431 * 255, 0.831 * 255, 0.819 * 255],
    [1.0 * 255, 0.901 * 255, 0.890 * 255]
];

const STARS_3_COLORS = [
    // orange
    // [0.505 * 255, 0.39 * 255, 0.3 * 255],

    // green
    // [0.258 * 255, 0.282 * 255, 0.145 * 255],

    // red
    // [0.694 * 255, 0.301 * 255, 0.282 * 255],

    // yellow
    // [0.745 * 255, 0.635 * 255, 0.360 * 255],

    // teal
    [0.431 * 255, 0.831 * 255, 0.819 * 255],
    [0.431 * 255, 0.831 * 255, 0.819 * 255],

    // violet
    [0xb3, 0x8d, 0xf9],
    [0xb3, 0x8d, 0xf9],
    [0xb3, 0x8d, 0xf9],
    [0xb3, 0x8d, 0xf9],
];

const minCameraDistance = 50;
const maxCameraDistance = 300;

let layersNames = {
    1: 'first',
    2: 'second',
    3: 'third'
};

let planetsData = [
    {
        preview: './assets/Star.svg',
        previewObject: null,
        physicalPlanet: [],
        modelsFolder: './assets/models/gasorpasorp/',
        layersCount: 3,
        planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
        position: new THREE.Vector3(70, 0, 0),
        name: "gasorpasorp",

        layersPerFrameTransformation: {
            1: {
                rotation: {
                    x: 0.0,
                    y: 0.0125,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            2: {
                rotation: {
                    x: 0.0,
                    y: 0.0125,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            3: {
                rotation: {
                    x: 0.0,
                    y: 0.003125,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            }
        },

        layersDefaultTransformation: {
            1: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            2: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.1,
                    y: 0.1,
                    z: 0.1
                }
            },
            3: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.2,
                    y: 0.2,
                    z: 0.2
                }
            }
        }
    },
    {
        preview: './assets/Star.svg',
        previewObject: null,
        physicalPlanet: [],
        modelsFolder: './assets/models/planeta_skwoth/',
        layersCount: 3,
        planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
        position: new THREE.Vector3(-70, 0, 35),
        name: "skwoth",

        layersPerFrameTransformation: {
            1: {
                rotation: {
                    x: 0.0,
                    y: 0.0015,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            2: {
                rotation: {
                    x: 0.0015,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            3: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0015
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            }
        },

        layersDefaultTransformation: {
            1: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            2: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            3: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            }
        }
    },
    {
        preview: './assets/Star.svg',
        previewObject: null,
        physicalPlanet: [],
        modelsFolder: './assets/models/moon/',
        layersCount: 1,
        planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
        position: new THREE.Vector3(-25, 0, -75),
        name: "moon",

        layersPerFrameTransformation: {
            1: {
                rotation: {
                    x: 0.001,
                    y: 0.0015,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            2: {
                rotation: {
                    x: 0.003,
                    y: 0.002,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            3: {
                rotation: {
                    x: 0.0015,
                    y: 0.0013,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            }
        },

        layersDefaultTransformation: {
            1: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            2: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            3: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            }
        }
    },
    {
        preview: './assets/Star.svg',
        previewObject: null,
        physicalPlanet: [],
        modelsFolder: './assets/models/planetEarth/',
        layersCount: 1,
        planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
        position: new THREE.Vector3(30, 0, 65),
        name: "earth",

        layersPerFrameTransformation: {
            1: {
                rotation: {
                    x: 0.001,
                    y: 0.0015,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            2: {
                rotation: {
                    x: 0.003,
                    y: 0.002,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            3: {
                rotation: {
                    x: 0.0015,
                    y: 0.0013,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            }
        },

        layersDefaultTransformation: {
            1: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            2: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            3: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            }
        }
    },
    {
        preview: './assets/Star.svg',
        previewObject: null,
        physicalPlanet: [],
        modelsFolder: './assets/models/moon/',
        layersCount: 1,
        planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
        position: new THREE.Vector3(-75, 0, 1),
        name: "earth",

        layersPerFrameTransformation: {
            1: {
                rotation: {
                    x: 0.001,
                    y: 0.0015,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            2: {
                rotation: {
                    x: 0.003,
                    y: 0.002,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            3: {
                rotation: {
                    x: 0.0015,
                    y: 0.0013,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            }
        },

        layersDefaultTransformation: {
            1: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            2: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            3: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            }
        }
    },
    {
        preview: './assets/Star.svg',
        previewObject: null,
        physicalPlanet: [],
        modelsFolder: './assets/models/moon/',
        layersCount: 1,
        planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
        position: new THREE.Vector3(25, 0, -90),
        name: "earth",

        layersPerFrameTransformation: {
            1: {
                rotation: {
                    x: 0.001,
                    y: 0.0015,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            2: {
                rotation: {
                    x: 0.003,
                    y: 0.002,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            3: {
                rotation: {
                    x: 0.0015,
                    y: 0.0013,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            }
        },

        layersDefaultTransformation: {
            1: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            2: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            3: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            }
        }
    },
    {
        preview: './assets/Star.svg',
        previewObject: null,
        physicalPlanet: [],
        modelsFolder: './assets/models/moon/',
        layersCount: 1,
        planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
        position: new THREE.Vector3(45, 0, 110),
        name: "earth",

        layersPerFrameTransformation: {
            1: {
                rotation: {
                    x: 0.001,
                    y: 0.0015,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            2: {
                rotation: {
                    x: 0.003,
                    y: 0.002,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            3: {
                rotation: {
                    x: 0.0015,
                    y: 0.0013,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            }
        },

        layersDefaultTransformation: {
            1: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            2: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            3: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            }
        }
    },
    {
        preview: './assets/Star.svg',
        previewObject: null,
        physicalPlanet: [],
        modelsFolder: './assets/models/moon/',
        layersCount: 1,
        planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
        position: new THREE.Vector3(85, 0, -80),
        name: "earth",

        layersPerFrameTransformation: {
            1: {
                rotation: {
                    x: 0.001,
                    y: 0.0015,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            2: {
                rotation: {
                    x: 0.003,
                    y: 0.002,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            3: {
                rotation: {
                    x: 0.0015,
                    y: 0.0013,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            }
        },

        layersDefaultTransformation: {
            1: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            2: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            3: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            }
        }
    },
    {
        preview: './assets/Star.svg',
        previewObject: null,
        physicalPlanet: [],
        modelsFolder: './assets/models/planet_x/',
        layersCount: 3,
        planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
        position: new THREE.Vector3(120, 0, 80),
        name: "planet_x",

        layersPerFrameTransformation: {
            1: {
                rotation: {
                    x: 0.001,
                    y: 0.0015,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            2: {
                rotation: {
                    x: 0.003,
                    y: 0.002,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            3: {
                rotation: {
                    x: 0.0015,
                    y: 0.0013,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            }
        },

        layersDefaultTransformation: {
            1: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            2: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            },
            3: {
                rotation: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                scale: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                }
            }
        }
    }
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
};

let debugObjects = {
    farStarsSphereMin: null,
    farStarsSphereMax: null,
}

export class Galaxy {
    private scene: THREE.Scene;
    private sceneBg: THREE.Scene;
    private camera: THREE.PerspectiveCamera;

    private galaxyPlane: THREE.Mesh;
    private sprGalaxyCenter: THREE.Sprite;
    private sprGalaxyCenter2: THREE.Sprite;

    private galaxyStarsData: any[];
    private galaxyStarSprites: THREE.Sprite[];

    private blinkStarsData: any[];
    private blinkStars: THREE.Sprite[];

    private farStars: FarStars;

    private smallGalaxies: THREE.Mesh[];

    private camOrbit: OrbitControls;

    private raycaster: THREE.Raycaster;

    constructor(aParams: any) {
        this.scene = aParams.scene;
        this.sceneBg = aParams.backScene;
        this.camera = aParams.camera;
    }

    init() {

        this.camera.position.set(-90, 120, 180);

        this.createSkybox(this.sceneBg);

        this.createSmallGalaxies(this.sceneBg);

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
        this.sprGalaxyCenter.scale.set(Config.SUN_SCALE, Config.SUN_SCALE, Config.SUN_SCALE);
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
        this.sprGalaxyCenter2.scale.set(Config.SUN_SCALE_2, Config.SUN_SCALE_2, Config.SUN_SCALE_2);
        this.sprGalaxyCenter2.renderOrder = 999;
        this.scene.add(this.sprGalaxyCenter2);


        this.createGalaxyStars();

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

        document.querySelector('canvas').addEventListener('touchstart', (event) => {
            (event as any).target.requestFullscreen();
        });

    }

    initDebugGui() {
        const DEBUG_PARAMS = {
            'center visible': true,
            'recreate': () => {
                this.createGalaxyStars();
            },
            'recreateSmallGalaxy': () => {
                this.createSmallGalaxies(this.sceneBg);
            },
            showSpheres: false,
            axiesHelper: false
        };

        const gui = Params.datGui;

        let galaxyFolder = gui.addFolder('Galaxy');

        galaxyFolder.add(Params.galaxyData, 'starsCount', 0, 10000, 100).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'blinkStarsCount', 0, 5000, 100).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'startAngle', 0, 2, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'endAngle', 0, Math.PI * 2, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'startOffsetXY', 0, 3, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'endOffsetXY', 0, 3, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'startOffsetH', 0, 10, 0.1).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'endOffsetH', 0, 10, 0.1).onChange(() => { this.createGalaxyStars(); });
        //galaxyFolder.add(Params.galaxyData, 'k', 0, 1, 0.02).onChange(() => { this.createGalaxyStars(); });
        galaxyFolder.add(Params.galaxyData, 'isNewMethod').onChange(() => { this.createGalaxyStars(); });

        galaxyFolder.add(DEBUG_PARAMS, 'center visible', true).onChange((value) => {
            this.centerVisible = value;
        });

        galaxyFolder.add(DEBUG_PARAMS, 'recreate');

        let skyFolder = gui.addFolder('Sky');

        skyFolder.add(Params.skyData, 'starsCount', 0, 2000, 10).onChange(() => { this.createFarStars(); });
        // skyFolder.add(Params.skyData, 'radius', 5, 400, 5).onChange(() => { this.createFarStars(); });
        skyFolder.add(Params.skyData, 'radiusMin', 0, 500, 5).onChange(() => {
            this.createFarStars();
            if (DEBUG_PARAMS.showSpheres === true) this.createFarStarsMinSphere();
        });
        skyFolder.add(Params.skyData, 'radiusMax', 10, 2000, 10).onChange(() => {
            this.createFarStars();
            if (DEBUG_PARAMS.showSpheres === true) this.createFarStarsMaxSphere();
        });
        skyFolder.add(DEBUG_PARAMS, 'showSpheres').onChange((v: boolean) => {
            // if (this.farStars) this.farStars.updateUniformValues();
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
        skyFolder.add(Params.skyData, 'starSize', 1, 20, 1).onChange(() => { if (this.farStars) this.farStars.updateUniformValues(); });
        skyFolder.add(Params.skyData, 'starAlpha', 0, 1, 0.1).onChange(() => { if (this.farStars) this.farStars.updateUniformValues(); });
        skyFolder.add(DEBUG_PARAMS, 'recreateSmallGalaxy');

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

    private createGalaxyStars() {

        this.destroyGalaxyStars();

        // stars
        this.galaxyStarsData = this.getGalaxyStarsData({
            starsCount: Params.galaxyData.starsCount,
            startAngle: Params.galaxyData.startAngle,
            endAngle: Params.galaxyData.endAngle,
            startOffsetXY: Params.galaxyData.startOffsetXY,
            endOffsetXY: Params.galaxyData.endOffsetXY,
            startOffsetH: Params.galaxyData.startOffsetH,
            endOffsetH: Params.galaxyData.endOffsetH,
            k: Params.galaxyData.k
        }, 145, 145);

        this.galaxyStarSprites = [];
        
        for (let i = 0; i < this.galaxyStarsData.length; i++) {
            let starData = this.galaxyStarsData[i];
            const dPos = 3;
            let starPos = {
                x: starData.x + MyMath.randomInRange(-dPos, dPos),
                y: starData.y + MyMath.randomInRange(-dPos / 2, dPos / 2),
                z: starData.z + MyMath.randomInRange(-dPos, dPos)
            };

            let starSprite = this.createStarSprite('star4', starPos.x, starPos.y, starPos.z, 4, STARS_2_COLORS);
            this.galaxyStarSprites.push(starSprite);
            this.scene.add(starSprite);
        }

        // blink stars
        this.blinkStarsData = this.getGalaxyStarsData({
            starsCount: Params.galaxyData.blinkStarsCount,
            startAngle: Params.galaxyData.startAngle,
            endAngle: Params.galaxyData.endAngle,
            startOffsetXY: Params.galaxyData.startOffsetXY,
            endOffsetXY: Params.galaxyData.endOffsetXY,
            startOffsetH: Params.galaxyData.startOffsetH,
            endOffsetH: Params.galaxyData.endOffsetH,
            k: Params.galaxyData.k
        }, 150, 150);

        this.blinkStars = [];

        const blinkStar = (aStarSprite) => {
            gsap.to(aStarSprite.material, {
                opacity: 2.5,
                delay: MyMath.randomInRange(1, 10),
                duration: MyMath.randomInRange(1, 2),
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    if (!aStarSprite['stopBlinkAnimation']) blinkStar(aStarSprite);
                }
            });
        };

        for (let i = 0; i < this.blinkStarsData.length; i++) {
            let starData = this.blinkStarsData[i];
            const dPos = 1;
            let starPos = {
                x: starData.x + MyMath.randomInRange(-dPos, dPos),
                y: starData.y + MyMath.randomInRange(-dPos / 2, dPos / 2),
                z: starData.z + MyMath.randomInRange(-dPos, dPos)
            };

            let starSprite = this.createStarSprite('star4_512', starPos.x, starPos.y, starPos.z, MyMath.randomIntInRange(4, 8), STARS_2_COLORS);
            starSprite.material.opacity = 0;
            this.blinkStars.push(starSprite);
            this.scene.add(starSprite);
            blinkStar(starSprite);
        }
    }

    private getGalaxyStarsData(aParams: GalaxyParams, xScale: number, zScale: number): any[] {

        if (!aParams.startAngle) aParams.startAngle = 0;
        if (!aParams.endAngle) aParams.endAngle = Math.PI;
        if (!aParams.startOffsetXY) aParams.startOffsetXY = 0;
        if (!aParams.endOffsetXY) aParams.endOffsetXY = 0;
        if (!aParams.startOffsetH) aParams.startOffsetH = 0;
        if (!aParams.endOffsetH) aParams.endOffsetH = 0;
        if (!aParams.k) aParams.k = 0.3;

        let stars: any[] = [];
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

            // Now we can assign xy coords.
            stars[i] = {
                x: px * xScale,
                y: offsetH,
                z: py * zScale
            };

        }

        return stars;
    }

    private createStarSprite(aSpriteAlias: string, x: number, y: number, z: number, aScale: number, aGalColors): THREE.Sprite {
        let t = ThreeLoader.getInstance().getTexture(aSpriteAlias);
        let opacity = MyMath.randomInRange(0.8, 1.0);

        let clr = 0xFFFFFF;

        let customStarColor = MyMath.randomIntInRange(0, 10);
        if (customStarColor == 0.0) {
            clr = MyMath.rgbToHex(aGalColors[0][0], aGalColors[0][1], aGalColors[0][2]);
        }
        else if (customStarColor <= 2.0) {
            clr = MyMath.rgbToHex(aGalColors[1][0], aGalColors[1][1], aGalColors[1][2]);
        }
        else if (customStarColor <= 4.0) {
            clr = MyMath.rgbToHex(aGalColors[2][0], aGalColors[2][1], aGalColors[2][2]);
        }
        else if (customStarColor <= 6.0) {
            clr = MyMath.rgbToHex(aGalColors[3][0], aGalColors[3][1], aGalColors[3][2]);
        }
        else if (customStarColor <= 8.0) {
            clr = MyMath.rgbToHex(aGalColors[4][0], aGalColors[4][1], aGalColors[4][2]);
        }
        else if (customStarColor <= 10.0) {
            clr = MyMath.rgbToHex(aGalColors[5][0], aGalColors[5][1], aGalColors[5][2]);
        }

        let mat = new THREE.SpriteMaterial({
            map: t,
            color: clr,
            transparent: true,
            opacity: opacity,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        let sprite = new THREE.Sprite(mat);
        sprite.scale.set(aScale, aScale, aScale);
        sprite.position.set(x, y, z);
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

    private createSkybox(aScene: THREE.Scene) {
        let loader = ThreeLoader.getInstance();
        let imagePrefix = "skybox1-";
        let directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
        let materialArray = [];
        for (let i = 0; i < directions.length; i++)
            materialArray.push(new THREE.MeshBasicMaterial({
                map: loader.getTexture(imagePrefix + directions[i]),
                side: THREE.BackSide,
                depthWrite: false,
                // transparent: true,
                // opacity: 1.,
            }));

        let imgArray = [];
        for (let i = 0; i < directions.length; i++)
            imgArray.push(loader.getTexture(imagePrefix + directions[i]).image);

        let size = Config.SKY_BOX_SIZE;
        let skyGeometry = new THREE.BoxBufferGeometry(size, size, size);
        let skyBox = new THREE.Mesh(skyGeometry, materialArray);
        skyBox.position.set(0, 0, 0);
        aScene.add(skyBox);
    }

    private createSmallGalaxy(aGalaxyId: number): THREE.Mesh {
        let loader = ThreeLoader.getInstance();
        const systemRadius = 1500;
        let tNum = MyMath.randomIntInRange(1, Config.SMALL_GALAXIES_COUNT);
        if (aGalaxyId != undefined) tNum = aGalaxyId + 1;
        let tName = `galaxy_${tNum.toString().padStart(2, '0')}`;
        let t = loader.getTexture(tName);
        let alpha = MyMath.randomInRange(0.5, 0.8);
        let mat = new THREE.MeshBasicMaterial({
            map: t,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: alpha,
            depthWrite: false,
            // depthTest: true
            // blending: THREE.AdditiveBlending
        });

        let size = MyMath.randomInRange(400, 800);
        let geom = new THREE.PlaneGeometry(size, size, 1, 1);

        let galaxy = new THREE.Mesh(geom, mat);

        const distFactor = MyMath.randomInRange(1.5, 2);
        let posDone = false;
        let pos = new THREE.Vector3();
        while (!posDone) {
            pos.set(
                MyMath.randomInRange(-10, 10),
                MyMath.randomInRange(-10, 10),
                MyMath.randomInRange(-10, 10)).
                normalize().
                multiplyScalar(systemRadius * distFactor);

            posDone = true;

            for (let i = 0; i < this.smallGalaxies.length; i++) {
                const g = this.smallGalaxies[i];
                if (g.position.distanceTo(pos) <= systemRadius * 1.5) {
                    posDone = false;
                }
            }
        }

        galaxy.position.copy(pos);
        // galaxy.rotation.set(
        //     MyMath.randomInRange(-Math.PI, Math.PI),
        //     MyMath.randomInRange(-Math.PI, Math.PI),
        //     MyMath.randomInRange(-Math.PI, Math.PI)
        // );
        let dir = new THREE.Vector3(
            MyMath.randomInRange(-10, 10),
            MyMath.randomInRange(-10, 10),
            MyMath.randomInRange(-10, 10)).
            normalize().
            multiplyScalar(systemRadius * 1.5);
        galaxy.lookAt(dir);
        galaxy['rotSpeed'] = MyMath.randomInRange(0.01, 0.03);
        return galaxy;
    }

    private createSmallGalaxies(aScene: THREE.Scene) {

        this.destroySmallGalaxies();

        this.smallGalaxies = [];
        let galaxyCnt = MyMath.randomIntInRange(Math.min(3, Config.SMALL_GALAXIES_COUNT), Math.min(6, Config.SMALL_GALAXIES_COUNT));
        let ids = Array.from(Array(galaxyCnt).keys());
        MyMath.shuffleArray(ids, 4);
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const galaxy = this.createSmallGalaxy(id);
            this.smallGalaxies.push(galaxy);
            aScene.add(galaxy);
        }

    }

    private destroySmallGalaxies() {
        if (this.smallGalaxies)
            for (let i = this.smallGalaxies.length - 1; i >= 0; i--) {
                this.sceneBg.remove(this.smallGalaxies[i]);
            }
        this.smallGalaxies = [];
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
            this.sprGalaxyCenter.scale.y = Config.SUN_SCALE * anFactor;
        }

        if (this.sprGalaxyCenter2) {
            // debugger;
            // console.log(`polarAngle: ${polarAngle}`);
            const scMin = 0.3;
            let anFactor = scMin + (1 - scMin) * (1 - (cameraPolarAngle / (Math.PI / 2)));
            if (cameraPolarAngle > Math.PI / 2) {
                anFactor = scMin + (1 - scMin) * (1 - (Math.abs(cameraPolarAngle - Math.PI) / (Math.PI / 2)));
            }
            this.sprGalaxyCenter2.scale.y = Config.SUN_SCALE_2 * anFactor;
        }
    }

    update(dt: number) {

        // let dtMs = dt * 1000;

        let cameraAzimutAngle = this.camOrbit.getAzimuthalAngle();
        let cameraPolarAngle = this.camOrbit.getPolarAngle();

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
                this.galaxyPlane.material['opacity'] = 1 - (cameraPolarAngle / (Math.PI / 2));
            } else {
                this.galaxyPlane.material['opacity'] = 1 - (Math.abs(cameraPolarAngle - Math.PI) / (Math.PI / 2));
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