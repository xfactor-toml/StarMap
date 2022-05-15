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

import vsFarStars from '../shaders/farStars/vs.glsl';
import fsFarStars from '../shaders/farStars/fs.glsl';

let vsFarShader_OLD = `
    uniform float size;
    uniform float distanceSize;
    uniform float t;
    uniform float z;
    uniform float pixelRatio;
    uniform vec4 activeStars[GALAXY_ACTIVE_STARS_COUNT];
    uniform vec4 starsWithCustomColor[GALAXY_STARS_WITH_CUSTOM_COLOR_COUNT];
    uniform float cameraRotationPower;
    uniform float galaxyPower;
    
    varying vec3 vPosition;
    varying vec3 mPosition;//modified position
    varying float gas;
    varying float customStarColor;
  
    
    void main() {
    
      vPosition=position;
      mPosition=position;
      vec4 mvPosition=modelViewMatrix*vec4(mPosition,1.);
      gl_Position=mvPosition*projectionMatrix;
      float multiplier = 200000.;

      if(distance(position, vec3(0.5, 0.5, 0.5)) < 100000.){
        multiplier = 1000.;
      }

      if(distance(position, vec3(0.5, 0.5, 0.5)) < 2000.){
        multiplier = 100.;
      }

      gl_PointSize=50./(length(mvPosition.xyz) / multiplier);

      if(gl_PointSize < 15.){
        gl_PointSize = 15.;
      }

      if(gl_PointSize > 20.){
        gl_PointSize = 20.;
      }
    
    }
`;

let fsFarShader_OLD = `
    uniform float z;
        
    varying vec3 vPosition;
    varying vec3 mPosition;
    varying float gas;
    varying float customStarColor;
    uniform vec2 cameraMovmentPower;
    
    float line(vec2 uv, vec2 pt1, vec2 pt2, float pointSize, float tensionPower)
    {
        float clrFactor = 0.0;
        float tickness = pointSize;
        float r  = distance(uv, pt1) / distance(pt1, pt2);
        
        if (r <= tensionPower) {
            vec2 ptc = mix(pt1, pt2, r); 
            float dist = distance(ptc, uv);
            if (dist < tickness / 2.0) {
                clrFactor = 1.0;
            }
        }
        return clrFactor;
    }


    void main() {
      float tension = 4.9;
      float pointSize = 0.06;
      float tensionPower = 3.0;

      if (z > 0.) gl_FragColor *= cos(1.57 * z/322.) * (1. - .001 * length(mPosition));

      if (distance(gl_PointCoord, vec2(0.5, 0.5)) < 0.05) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }

      if (distance(vPosition, vec3(0.5, 0.5, 0.5)) < 10000.) {
        tension = 3.6;
        float pointSize = 0.06;
        // float tensionPower = 1.0;
      }

      if (distance(vPosition, vec3(0.5, 0.5, 0.5)) < 900.) {
        tension = 0.5;
        float pointSize = 0.06;
        // float tensionPower = 1.0;
      }

      if (abs(cameraMovmentPower.x) > 0.02 || abs(cameraMovmentPower.y) > 0.02) {
        float distanceToLine = line(gl_PointCoord.xy, (cameraMovmentPower.xy * tension) + .5, vec2(0.5, 0.5), pointSize, tensionPower) * 5.0;
        gl_FragColor = vec4(distanceToLine, distanceToLine, distanceToLine, distanceToLine);
      }

    }
`;

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

let verticalCameraMagnitude = 5.0;
let starsOutsideGalaxysPower = 2.0;
let rickMobileCount = 0;

const minCameraDistance = 50;
const maxCameraDistance = 250;

let camera;

let lastFreeCameraPosition = { x: 0, y: 0, z: 0 };

let raycaster;
let mouseNormal = { x: 0, y: 0 };

let objectHovered = false;
let selectedPlanet = false;

let backButton;
let playButton;
let comingSoonWindow;
let taskTable;
let readyButton;
let youWonWindow;
let wrongWindow;
let getAGiftButton;

let blinkStarsData;

let cameraRotationPower = 1.0;

let clouds;
let warpStars;
let mainGalaxyPlane;

let smallGalaxies = [];

let taskTableSlots = [
    {
        inUseBy: null,
        object: null,
        center: new THREE.Vector2(-0.975, 0.48)
    },
    {
        inUseBy: null,
        object: null,
        center: new THREE.Vector2(-0.32, 0.48)
    },
    {
        inUseBy: null,
        object: null,
        center: new THREE.Vector2(0.317, 0.48)
    },
    {
        inUseBy: null,
        object: null,
        center: new THREE.Vector2(0.950, 0.48)
    },

    {
        inUseBy: null,
        object: null,
        center: new THREE.Vector2(-0.975, -0.14)
    },
    {
        inUseBy: null,
        object: null,
        center: new THREE.Vector2(-0.32, -0.14)
    },
    {
        inUseBy: null,
        object: null,
        center: new THREE.Vector2(0.317, -0.14)
    },
    {
        inUseBy: null,
        object: null,
        center: new THREE.Vector2(0.950, -0.14)
    }
];

let taskTableImages = [
    {
        agreeWith: 1,
        spawnPosition: new THREE.Vector2(-1.2, -0.62),
        scale: new THREE.Vector3(1.0, 1.0, 1.0),
        object: null,
        currentSlot: null,
        texture: "./assets/dev_texture_256x256.jpg"
    },
    {
        agreeWith: 0,
        spawnPosition: new THREE.Vector2(-1.0, -0.52),
        scale: new THREE.Vector3(1.0, 1.0, 1.0),
        object: null,
        currentSlot: null,
        texture: "./assets/dev_texture_512x512_2.png"
    },
    {
        agreeWith: 3,
        spawnPosition: new THREE.Vector2(-0.8, -0.68),
        scale: new THREE.Vector3(1.0, 1.0, 1.0),
        object: null,
        currentSlot: null,
        texture: "./assets/dev_texture_512x512_2.png"
    },
    {
        agreeWith: 2,
        spawnPosition: new THREE.Vector2(-0.6, -0.58),
        scale: new THREE.Vector3(1.0, 1.0, 1.0),
        object: null,
        currentSlot: null,
        texture: "./assets/dev_texture_512x512_2.png"
    },
    {
        agreeWith: 5,
        spawnPosition: new THREE.Vector2(-0.4, -0.62),
        scale: new THREE.Vector3(1.0, 1.0, 1.0),
        object: null,
        currentSlot: null,
        texture: "./assets/dev_texture_512x512_2.png"
    },
    {
        agreeWith: 4,
        spawnPosition: new THREE.Vector2(-0.2, -0.58),
        scale: new THREE.Vector3(1.0, 1.0, 1.0),
        object: null,
        currentSlot: null,
        texture: "./assets/dev_texture_512x512_2.png"
    },
    {
        agreeWith: 7,
        spawnPosition: new THREE.Vector2(0.0, -0.68),
        scale: new THREE.Vector3(1.0, 1.0, 1.0),
        object: null,
        currentSlot: null,
        texture: "./assets/dev_texture_512x512_2.png"
    },
    {
        agreeWith: 6,
        spawnPosition: new THREE.Vector2(0.3, -0.58),
        scale: new THREE.Vector3(1.0, 1.0, 1.0),
        object: null,
        currentSlot: null,
        texture: "./assets/dev_texture_512x512_2.png"
    }
];

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

let rickmobilesPull = [];

let camOrbit;
let prevCamPolarAngle = 0;
let prevCamAzimutAngle = 0;

// let firstGalaxyStarsData: any[];
// let firstStarSprites = [];

let galaxyStarsData: any[];
let galaxyStarSprites = [];

// let thirdGalaxyStarsData: any[];
// let thirdStarSprites = [];

let blinkStars = [];

let outStars;
let stars;

let starsCountData = [];

let checkMousePointerTimer = 0;

export class GalaxyScene {
    private scene: THREE.Scene;
    private sceneBg: THREE.Scene;

    private sprGalaxyCenter: THREE.Sprite;
    private sprGalaxyCenter2: THREE.Sprite;


    constructor(aParams: any) {
        this.scene = aParams.scene;
        this.sceneBg = aParams.backScene;
        camera = aParams.camera;
    }

    init() {

        this.initStarsCount();
        this.setScene();

        // document.addEventListener('pointermove', onMouseMove);
        // document.addEventListener('click', onMouseClick);
        // document.addEventListener('keydown', onKeyPress);
        
        document.querySelector('canvas').addEventListener('touchstart', (event) => {
            (event as any).target.requestFullscreen();
        });

    }

    initStarsCount() {
        const iphoneStarsCount = [
            // center
            {
                active: 2,
                customColor: 2000
            },
            // second
            {
                active: 1000,
                customColor: 1000
            },
            // third
            {
                active: 400,
                customColor: 1000
            },
            {
                active: 30,
                customColor: 40
            },
            {
                active: 2,
                customColor: 110
            }
        ];
        const androidStarsCount = [
            // center
            {
                active: 2,
                customColor: 2000
            },
            // second
            {
                active: 1000,
                customColor: 1000
            },
            // third
            {
                active: 400,
                customColor: 1000
            },
            {
                active: 50,
                customColor: 70
            },
            {
                active: 2,
                customColor: 110
            }
        ];
        const desktopStarsCount = [
            // center
            {
                active: 2,
                customColor: 2000
            },
            // second
            {
                active: 1700,
                customColor: 1000
            },
            // third
            {
                active: 700,
                customColor: 1000
            },
            {
                active: 400,
                customColor: 1000
            },
            {
                active: 5,
                customColor: 2200
            }
        ];

        starsCountData = desktopStarsCount;

        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            starsCountData = iphoneStarsCount;
        }

        if (/Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            starsCountData = androidStarsCount;
        }

        // for (let i = 0; i < vShaders.length; i++) {
        //     let act = String(starsCountData[i].active);
        //     let clr = String(starsCountData[i].customColor);
        //     console.log('act, clr: ', act, clr);
        //     vShaders[i] = vShaders[i].replace('GALAXY_ACTIVE_STARS_COUNT', act);
        //     vShaders[i] = vShaders[i].replace('GALAXY_ACTIVE_STARS_COUNT', act);
        //     vShaders[i] = vShaders[i].replace('GALAXY_STARS_WITH_CUSTOM_COLOR_COUNT', clr);
        //     vShaders[i] = vShaders[i].replace('GALAXY_STARS_WITH_CUSTOM_COLOR_COUNT', clr);
        //     // console.log(`vShaders[${i}]:`, vShaders[i]);
        // }

        let act = String(starsCountData[4].active);
        let clr = String(starsCountData[4].customColor);
        console.log('act, clr: ', act, clr);
        vsFarShader_OLD = vsFarShader_OLD.replace('GALAXY_ACTIVE_STARS_COUNT', act);
        vsFarShader_OLD = vsFarShader_OLD.replace('GALAXY_ACTIVE_STARS_COUNT', act);
        vsFarShader_OLD = vsFarShader_OLD.replace('GALAXY_STARS_WITH_CUSTOM_COLOR_COUNT', clr);
        vsFarShader_OLD = vsFarShader_OLD.replace('GALAXY_STARS_WITH_CUSTOM_COLOR_COUNT', clr);
        // console.log(`vShaders[${i}]:`, vShaders[i]);

    }

    getDistanceBetweenTwoVectors(v1, v2) {
        var dx = v1.x - v2.x;
        var dy = v1.y - v2.y;
        var dz = v1.z - v2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    upStarActivity(starID, starX, starY, starZ, currentGalaxy) {
        let star = currentGalaxy.material.uniforms.activeStars.value[starID];
        if (star.w < 1.8) {
            currentGalaxy.material.uniforms.activeStars.value[starID].w += 0.01;
            setTimeout(this.upStarActivity, 1, starID, starX, starY, starZ, currentGalaxy);
        } else {
            setTimeout(this.downStarActivity, 1, starID, starX, starY, starZ, currentGalaxy);
        }
    }

    createStarSprite(aSpriteAlias: string, x: number, y: number, z: number, aScale: number, aGalColors): THREE.Sprite {
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

    downStarActivity(starID, starX, starY, starZ, currentGalaxy) {
        let star = currentGalaxy.material.uniforms.activeStars.value[starID];
        if (currentGalaxy == blinkStars) {
            var minStarActivity = 0.0;
        }
        else {
            var minStarActivity = 1.0;
        }

        if (star.w > minStarActivity) {
            currentGalaxy.material.uniforms.activeStars.value[starID].w -= 0.005;
            setTimeout(this.downStarActivity, 1, starID, starX, starY, starZ, currentGalaxy);
        }
        else {
            this.refrestStarsActivity(starID, starX, starY, starZ, currentGalaxy);
        }
    }

    refrestStarsActivity(starID, starX, starY, starZ, currentGalaxy) {
        if (currentGalaxy == blinkStars) {
            var star = blinkStarsData[Math.floor(Math.random() * blinkStarsData.length)];
            currentGalaxy.geometry.vertices[starID].set(star.x, star.y, star.z);
            currentGalaxy.geometry.verticesNeedUpdate = true;
            currentGalaxy.material.uniforms.activeStars.value[starID] = new THREE.Vector4(star.x, star.y, star.z, 0.0);
            setTimeout(this.upStarActivity, Math.random() * 3000, starID, star.x, star.y, star.z, currentGalaxy);
            return;
        }

        setTimeout(this.upStarActivity, Math.random() * 3000, starID, starX, starY, starZ, currentGalaxy);
    }

    MoveRickmobil(rickmobileID) {
        let currentRickmobile = rickmobilesPull[rickmobileID];

        if (!currentRickmobile) return;

        if (currentRickmobile.model.visible == false) {
            currentRickmobile.model.visible = true;
        }

        if (this.getDistanceBetweenTwoVectors(currentRickmobile.model.position, currentRickmobile.endPosition) >= (this.getDistanceBetweenTwoVectors(currentRickmobile.startPosition, currentRickmobile.endPosition) / 2)) {
            currentRickmobile.model.scale.x += 0.008 / (300 * currentRickmobile.speed);
            currentRickmobile.model.scale.y += 0.008 / (300 * currentRickmobile.speed);
            currentRickmobile.model.scale.z += 0.008 / (300 * currentRickmobile.speed);
        }
        else {
            currentRickmobile.model.scale.x -= 0.008 / (300 * currentRickmobile.speed);
            currentRickmobile.model.scale.y -= 0.008 / (300 * currentRickmobile.speed);
            currentRickmobile.model.scale.z -= 0.008 / (300 * currentRickmobile.speed);
        }

        currentRickmobile.model.lookAt(currentRickmobile.startPosition);
        currentRickmobile.model.position.x += (currentRickmobile.endPosition.x - currentRickmobile.startPosition.x) / (300 * currentRickmobile.speed);
        currentRickmobile.model.position.y += (currentRickmobile.endPosition.y - currentRickmobile.startPosition.y) / (300 * currentRickmobile.speed);
        currentRickmobile.model.position.z += (currentRickmobile.endPosition.z - currentRickmobile.startPosition.z) / (300 * currentRickmobile.speed);

        if (this.getDistanceBetweenTwoVectors(currentRickmobile.model.position, currentRickmobile.endPosition) <= (this.getDistanceBetweenTwoVectors(currentRickmobile.endPosition, currentRickmobile.startPosition) / (150 * currentRickmobile.speed))) {
            var newRickmobileStartPosition = planetsData[Math.floor(Math.random() * planetsData.length)].position;
            var newRickmobileEndPosition = planetsData[Math.floor(Math.random() * planetsData.length)].position;
            currentRickmobile.startPosition = newRickmobileStartPosition;
            currentRickmobile.endPosition = newRickmobileEndPosition;

            while (newRickmobileStartPosition == newRickmobileEndPosition) {
                newRickmobileEndPosition = planetsData[Math.floor(Math.random() * planetsData.length)].position;
            }

            currentRickmobile.model.position.set(currentRickmobile.startPosition.x, currentRickmobile.startPosition.y, currentRickmobile.startPosition.z);
            currentRickmobile.model.visible = false;
            currentRickmobile.model.scale.set(0, 0, 0);
            currentRickmobile.speed = Math.random() * 3;

            setTimeout(this.MoveRickmobil, Math.random() * 5000, rickmobileID);

            return;
        }

        setTimeout(this.MoveRickmobil, 8, rickmobileID);
    }

    moveCameraTo(camera, startX, startY, startZ, endX, endY, endZ, maxFrames, currentFrame, setCameraPosition) {
        camera.position.x += ((endX - startX) / maxFrames);
        camera.position.y += ((endY - startY) / maxFrames);
        camera.position.z += ((endZ - startZ) / maxFrames);

        if (currentFrame <= maxFrames) {
            setTimeout(this.moveCameraTo, Math.random(), camera, startX, startY, startZ, endX, endY, endZ, maxFrames, currentFrame + 1, setCameraPosition);
        }
        else {
            if (setCameraPosition) {
                camera.position.set(endX, endY, endZ);
            }
        }

    }

    newGalaxy(_n, xSize, zSize): any[] {
        let stars: any[] = [];
        const maxAngle = Math.PI * 1.15;
        const numArms = 5;
        const armDeltaAngle = 2 * Math.PI / numArms;

        for (let i = 0; i < _n; i++) {
            // choose an angle
            let angle = Math.pow(Math.random(), 2) * maxAngle;
            let k = 0.3;
            let r = k * angle;

            // set random galaxy arm
            let armId = MyMath.randomIntInRange(0, numArms - 1);
            let armAngle = angle + armId * armDeltaAngle;
            if (armId == 1) armAngle += .2;

            // convert polar coordinates to 2D
            let px = r * Math.cos(armAngle);
            let py = r * Math.sin(armAngle);

            // random offset
            let randomOffsetXY = 0.01 + (maxAngle - angle) * 0.03;
            let randomOffsetX = randomOffsetXY * MyMath.randomInRange(-1, 1);
            let randomOffsetY = randomOffsetXY * MyMath.randomInRange(-1, 1);

            px += randomOffsetX;
            py += randomOffsetY;

            // Now we can assign xy coords.
            stars[i] = {
                x: px * xSize,
                y: Math.random() * 2,
                z: py * zSize,
                w: 24
            };

        }

        // debugger;
        return stars;
    }

    newStarsOutsideGalaxys() {
        const starsCount = 1000;
        const systemRadius = 300;
        stars = [];
        for (var i = 0; i < starsCount; i++) {
            let layer = 0;
            let r = MyMath.randomIntInRange(0, 100);
            if (r < 10) layer = 0;
            else if (r < 30) layer = 1;
            else layer = 2;

            let radius = 0;

            switch (layer) {
                case 0:
                    radius = MyMath.randomInRange(systemRadius / 2, systemRadius);
                    break;
                case 1:
                    radius = MyMath.randomInRange(systemRadius, systemRadius * 2);
                    break;
                case 2:
                    radius = MyMath.randomInRange(systemRadius * 2, systemRadius * 8);
                    break;
            }

            let newStarPos = new THREE.Vector3(
                MyMath.randomInRange(-10, 10),
                MyMath.randomInRange(-10, 10),
                MyMath.randomInRange(-10, 10)
            );
            newStarPos.normalize().multiplyScalar(radius);
            stars.push(newStarPos);
        }
        return stars;
    }

    //threejs functions
    setScene() {

        camera.position.set(-90, 120, 180);
        
        // renderer = new THREE.WebGLRenderer();
        // renderer.autoClear = false;
        // renderer.setSize(innerWidth, innerHeight);
        // renderer.setClearColor(0x0000000);
        // document.body.appendChild(renderer.domElement);

        // axe helper
        // let ah = new THREE.AxesHelper(150);
        // ah.position.set(5, 0, 0);
        // scene.add(ah);

        this.createSkybox();

        this.createSmallGalaxies();

        this.createCameraControls({
            minDist: minCameraDistance,
            maxDist: maxCameraDistance,
            stopAngleTop: 10,
            stopAngleBot: 170,
            pos: { x: 5, y: 0, z: 0 }
        });

        clouds = new THREE.Group();
        this.scene.add(clouds);

        warpStars = new THREE.Group()
        this.scene.add(warpStars);

        // main galaxy sprite
        mainGalaxyPlane = this.createMainGalaxy();
        this.scene.add(mainGalaxyPlane);

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


        // FIRST STARS

        let starsCnt = starsCountData[0].active;// + starsCountData[0].customColor;
        // let starsCnt = 200;
        // firstGalaxyStarsData = newGalaxy(starsCnt, 20, 20, 0.7);


        // SECOND STARS

        // secondstars = new THREE.Geometry();
        // secondstars.vertices = newGalaxy(2200, 145, 145, 0.3, 2);

        // starsCnt = starsCountData[1].active + starsCountData[1].customColor;
        galaxyStarsData = this.newGalaxy(4000, 145, 145);


        // THIRD STARS

        // thirdGalaxyStarsData = newGalaxy(1000, 150, 150);


        // FOUTH STARS

        blinkStarsData = this.newGalaxy(550, 150, 150);


        // OUT STARS

        let outStarsGeometry = new THREE.Geometry();
        outStarsGeometry.vertices = this.newStarsOutsideGalaxys();

        let outStarsMaterial = new THREE.ShaderMaterial({
            vertexShader: vsFarShader_OLD, // vsFarStars,
            fragmentShader: fsFarShader_OLD, // fsFarStars,
            uniforms: {
                size: { value: 2.5 },
                distanceSize: { value: 1 },
                t: { value: 0 },
                z: { value: 0 },
                pixelRatio: { value: innerHeight },
                cameraRotationPower: { value: cameraRotationPower },
                galaxyPower: { value: starsOutsideGalaxysPower },
                cameraMovmentPower: { value: [0.0, 0.0] },
                derivatives: true
            } as any,
            // depthTest: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        outStars = new THREE.Points(outStarsGeometry, outStarsMaterial);
        outStars.rotation.set(0, 0, 0);

        this.scene.add(outStars);


        if (galaxyStarsData) {

            galaxyStarSprites = [];
            let len = galaxyStarsData.length;

            for (let i = 0; i < len - 1; i++) {
                let k = i;

                // let starData = secondGalaxyStarsData[MyMath.randomIntInRange(0, len - 1)];
                let starData = galaxyStarsData[k];
                const dPos = 3;
                let starPos = {
                    x: starData.x + MyMath.randomInRange(-dPos, dPos),
                    y: starData.y + MyMath.randomInRange(-dPos / 2, dPos / 2),
                    z: starData.z + MyMath.randomInRange(-dPos, dPos)
                };

                let starSprite = this.createStarSprite('star4', starPos.x, starPos.y, starPos.z, 4, STARS_2_COLORS);
                galaxyStarSprites.push(starSprite);
                this.scene.add(starSprite);
            }

            LogMng.debug(`secondStarSprites cnt: ${galaxyStarSprites.length}`);
        }

        // create blink stars
        blinkStars = [];
        let len = blinkStarsData.length;

        const blinkStar = (aStarSprite) => {
            gsap.to(aStarSprite.material, {
                opacity: 2.5,
                delay: MyMath.randomInRange(1, 10),
                duration: MyMath.randomInRange(1, 2),
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    blinkStar(aStarSprite);
                }
            });
        };

        for (let i = 0; i < 500; i++) {

            let k = i;
            while (k > len - 1) k -= len;

            let starData = blinkStarsData[i];
            const dPos = 1;
            let starPos = {
                x: starData.x + MyMath.randomInRange(-dPos, dPos),
                y: starData.y + MyMath.randomInRange(-dPos / 2, dPos / 2),
                z: starData.z + MyMath.randomInRange(-dPos, dPos)
            };

            let starSprite = this.createStarSprite('star4_512', starPos.x, starPos.y, starPos.z, MyMath.randomIntInRange(4, 8), STARS_2_COLORS);
            starSprite.material.opacity = 0;
            blinkStars.push(starSprite);
            this.scene.add(starSprite);
            blinkStar(starSprite);
        }

        // window.addEventListener('resize', function () {
        //     camera.aspect = innerWidth / innerHeight;
        //     renderer.setSize(innerWidth, innerHeight);
        //     camera.updateProjectionMatrix();
        //     renderer.render(scene, camera);
        // }, false);

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

        for (var rickmobile = 0; rickmobile < rickMobileCount; rickmobile++) {
            var newRickmobileStartPosition = planetsData[Math.floor(Math.random() * planetsData.length)].position;
            var newRickmobileEndPosition = planetsData[Math.floor(Math.random() * planetsData.length)].position;

            while (newRickmobileStartPosition == newRickmobileEndPosition) {
                newRickmobileEndPosition = planetsData[Math.floor(Math.random() * planetsData.length)].position;
            }

            rickmobilesPull[rickmobile] = {
                startPosition: newRickmobileStartPosition,
                endPosition: newRickmobileEndPosition,
                model: null,
                speed: Math.random() * 3
            };

            new MTLLoader().load("./assets/models/rickmobil/rickmobil.mtl", (materials) => {
                const currentRickmobile = rickmobile;
                materials.preload();

                var objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load("./assets/models/rickmobil/rickmobil.obj", (model) => {
                    model.position.set(rickmobilesPull[currentRickmobile].startPosition.x, rickmobilesPull[currentRickmobile].startPosition.y, rickmobilesPull[currentRickmobile].startPosition.z);
                    model.lookAt(rickmobilesPull[currentRickmobile].endPosition);
                    model.scale.set(0, 0, 0);
                    rickmobilesPull[currentRickmobile].model = model;
                    this.scene.add(model);
                    model.visible = false;
                    setTimeout(this.MoveRickmobil, Math.random() * 5000, currentRickmobile);
                });

            });

        }

        let backButtonTexture = new THREE.TextureLoader().load("./assets/interface/back.png");
        let backButtonMaterial = new THREE.SpriteMaterial({ map: backButtonTexture });

        backButton = new THREE.Sprite(backButtonMaterial);
        backButton.scale.set(1.2, 0.4, 0.4);
        backButton.position.z = -5;
        backButton.position.y = 2;
        backButton.position.x = -2.05;
        backButton.name = "backButton";

        let playButtonTexture = new THREE.TextureLoader().load("./assets/interface/play.png");
        let playButtonMaterial = new THREE.SpriteMaterial({ map: playButtonTexture });
        playButton = new THREE.Sprite(playButtonMaterial);

        playButton.scale.set(0.4, 0.4, 0.4);
        playButton.position.z = -4;
        playButton.position.y = 0;
        playButton.position.x = 1.2;
        playButton.name = "playButton";

        let comingSoonWindowTexture = new THREE.TextureLoader().load("./assets/interface/coming_soon.png");
        let comingSoonWindowMaterial = new THREE.SpriteMaterial({ map: comingSoonWindowTexture });
        comingSoonWindow = new THREE.Sprite(comingSoonWindowMaterial);
        comingSoonWindow.scale.set(1.2, 0.4, 0.4);
        comingSoonWindow.name = "comingSoonWindow";
        comingSoonWindow.position.z = -3;

        let taskTableTexture = new THREE.TextureLoader().load("./assets/interface/table.png");
        let taskTableMaterial = new THREE.SpriteMaterial({ map: taskTableTexture });
        taskTable = new THREE.Sprite(taskTableMaterial);
        taskTable.scale.set(3.2, 2, 2);
        taskTable.position.z = -3;

        taskTableSlots.forEach((slot, slotID) => {
            let newSlotMaterial = new THREE.SpriteMaterial({ color: "white", opacity: 0.5 });
            let newSlot = new THREE.Sprite(newSlotMaterial);

            newSlot.position.set(slot.center.x, slot.center.y, -2.9);
            newSlot.scale.set(0.539, 0.24, 0.5);
            newSlot.name = "tableSlot";
            newSlot['slotID'] = slotID;
            taskTableSlots[slotID].object = newSlot;
        });

        taskTableImages.forEach((image, imageID) => {
            let newImageTexture = new THREE.TextureLoader().load(image.texture);
            let newImageMaterial = new THREE.SpriteMaterial({ map: newImageTexture });
            let newImage = new THREE.Sprite(newImageMaterial);

            newImage.position.set(image.spawnPosition.x, image.spawnPosition.y, -2.9);
            newImage.scale.set(0.4 * image.scale.x, 0.4 * image.scale.y, 0.4 * image.scale.z);
            newImage.name = "tableImage";
            newImage['imageID'] = imageID;
            taskTableImages[imageID].object = newImage;
        });

        let readyButtonTexture = new THREE.TextureLoader().load("./assets/interface/ready.png");
        let readyButtonMaterial = new THREE.SpriteMaterial({ map: readyButtonTexture });
        readyButton = new THREE.Sprite(readyButtonMaterial);
        readyButton.scale.set(0.6, 0.2, 0.2);
        readyButton.position.set(1.0, -0.6, -2.9);

        readyButton.name = "readyButton";

        let youWonWindowTexture = new THREE.TextureLoader().load("./assets/interface/you_won.png");
        let youWonWindowMaterial = new THREE.SpriteMaterial({ map: youWonWindowTexture });

        youWonWindow = new THREE.Sprite(youWonWindowMaterial);

        youWonWindow.position.set(0.0, 0.0, -2.8);
        youWonWindow.scale.set(1.5, 0.75, 0.75);

        youWonWindow.name = "youWonWindow";

        let getAGiftButtonTexture = new THREE.TextureLoader().load("./assets/interface/get_a_gift.png");
        let getAGiftButtonMaterial = new THREE.SpriteMaterial({ map: getAGiftButtonTexture });

        getAGiftButton = new THREE.Sprite(getAGiftButtonMaterial);

        getAGiftButton.position.set(0.0, -0.2, -2.7);
        getAGiftButton.scale.set(0.6, 0.2, 0.2);

        getAGiftButton.name = "giftButton";

        let wrongWindowTexture = new THREE.TextureLoader().load("./assets/interface/wrong.png");
        let wrongWindowMaterial = new THREE.SpriteMaterial({ map: wrongWindowTexture });
        wrongWindow = new THREE.Sprite(wrongWindowMaterial);

        wrongWindow.position.set(0.0, 0.0, -2.6);
        wrongWindow.scale.set(0.8, 0.4, 0.4);

        wrongWindow.name = "wrongWindow";

        raycaster = new THREE.Raycaster();
        mouseNormal = new THREE.Vector2();

        // simple music
        // let music = new Audio('./assets/audio/vorpal-12.mp3');
        // music.play();

        // pixi music
        sound.add('music', './assets/audio/vorpal-12.mp3');
        sound.play('music');

        // tone music example
        // Tone.start();
        // console.log("audio is ready");
        // new Ambient();
        // const autoPanner = new Tone.AutoPanner(0.5).toDestination().start();
        // const fatOsc = new Tone.FatOscillator("Cb1", "sine3", 10).connect(autoPanner).start();
        // const autoFilter = new Tone.AutoFilter({ frequency: 0.05, baseFrequency: 220, octaves: 2 }).toDestination().start();
        // const noise = new Tone.Noise({ type: "brown", volume: -22 }).connect(autoFilter).start();

    }

    createSkybox() {
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
        this.sceneBg.add(skyBox);
    }

    createSmallGalaxies() {
        smallGalaxies = [];

        let galaxyCnt = MyMath.randomIntInRange(Math.min(3, Config.SMALL_GALAXIES_COUNT), Math.min(6, Config.SMALL_GALAXIES_COUNT));
        let ids = Array.from(Array(galaxyCnt).keys());
        // console.log('ids: ', ids);
        MyMath.shuffleArray(ids, 4);
        // console.log('shuff ids: ', ids);
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            // console.log('id: ', id);
            const galaxy = this.createSmallGalaxy(id);
            // console.log('galaxy created...');
            smallGalaxies.push(galaxy);
            this.sceneBg.add(galaxy);
            // scene.add(galaxy);
        }

    }

    // return THREE.Mesh
    createSmallGalaxy(aGalaxyId) {
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

            for (let i = 0; i < smallGalaxies.length; i++) {
                const g = smallGalaxies[i];
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

    createMainGalaxy() {
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

    createCameraControls(aParams) {

        if (camOrbit) return;
        if (!aParams) aParams = {};
        let domElement = Params.domCanvasParent;
        camOrbit = new OrbitControls(camera, domElement);
        if (!aParams.noTarget)
            camOrbit.target = new THREE.Vector3();
        camOrbit.enabled = !(aParams.isOrbitLock == true);
        camOrbit.rotateSpeed = .5;
        camOrbit.enableDamping = true;
        camOrbit.dampingFactor = 0.025;
        camOrbit.zoomSpeed = aParams.zoomSpeed || 1;
        camOrbit.enablePan = aParams.enablePan == true;
        // this.camOrbitCtrl.keys = {};
        camOrbit.minDistance = aParams.minDist || 1;
        camOrbit.maxDistance = aParams.maxDist || 100;
        camOrbit.minPolarAngle = MyMath.toRadian(aParams.stopAngleTop || 0); // Math.PI / 2.5;
        // camOrbit.maxPolarAngle = Math.PI - an;
        camOrbit.maxPolarAngle = MyMath.toRadian(aParams.stopAngleBot || 0);
        if (aParams.pos) {
            camOrbit.target.x = aParams.pos.x || 0;
            camOrbit.target.y = aParams.pos.y || 0;
            camOrbit.target.z = aParams.pos.z || 0;
        }
        camOrbit.update();
        camOrbit.addEventListener('change', () => {
        });
        camOrbit.addEventListener('end', () => {
        });

    }


    onMouseMove(event) {
        mouseNormal.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseNormal.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    onMouseClick(event) {

        mouseNormal.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseNormal.y = - (event.clientY / window.innerHeight) * 2 + 1;

        return;

        raycaster.setFromCamera(mouseNormal, camera);
        const intersects = raycaster.intersectObjects(this.scene.children, true);

    }

    onKeyPress(event) {

        if (event.key == "Escape") {
            if (selectedPlanet === false) {
                return;
            }

            camera.remove(youWonWindow);
            camera.remove(wrongWindow);
            camera.remove(getAGiftButton);
            camera.remove(backButton);
            camera.remove(playButton);
            camera.remove(comingSoonWindow);
            camera.remove(taskTable);
            camera.remove(readyButton);

            taskTableSlots.forEach(function (slot) {
                camera.remove(slot.object);
            });

            taskTableImages.forEach(function (image) {
                camera.remove(image.object);
            });

            camOrbit.enabled = true;
            camOrbit.target = new THREE.Vector3(0, 0, 0);

            selectedPlanet = false;

            camOrbit.minDistance = minCameraDistance;
            camOrbit.enableDamping = true;
            camera.position.set(-90, 120, 180);

            planetsData.forEach(function (planet) {
                this.scene.add(planet.previewObject);
                planet.physicalPlanet.forEach(function (layer) {
                    layer.children[0].material.visible = false;
                });
            });

            rickmobilesPull.forEach(function (rickmobile) {
                rickmobile.model.children[0].material.visible = true;
                rickmobile.model.children[1].material.visible = true;
            });

        }

    }

    checkMousePointer() {
        raycaster.setFromCamera(mouseNormal, camera);
        const intersects = raycaster.intersectObjects(this.scene.children, true);

        let isHover = false;

        intersects.forEach(function (object) {
            if (object.object.type == 'Sprite') {
                objectHovered = object.object;
                if (objectHovered['name'] == 'planetPreview') {
                    document.body.style.cursor = 'pointer';
                    isHover = true;
                }
            }
        });

        if (!isHover) {
            document.body.style.cursor = 'default';
        }

        // if (selectedPlanet !== false) {
        //     if (objectHovered !== false) {
        //         document.body.style.cursor = 'default';
        //         if (objectHovered.name !== "planetPreview") {
        //             document.body.style.cursor = "pointer";
        //         }
        //     }
        // }

        // if (objectHovered !== false) {
        //     objectHovered == false;
        //     document.body.style.cursor = 'default';
        // }
    }

    
    public set centerVisible(v: boolean) {
        this.sprGalaxyCenter.visible = v;
        this.sprGalaxyCenter2.visible = v;
    }
    

    update(dt: number) {
        let dtMs = dt * 1000;

        let aAngle = camOrbit.getAzimuthalAngle();
        let dtAzimut = aAngle - prevCamAzimutAngle;
        prevCamAzimutAngle = aAngle;

        let pAngle = camOrbit.getPolarAngle();
        let dtPolar = pAngle - prevCamPolarAngle;
        prevCamPolarAngle = pAngle;

        let azFactor = dtAzimut * 10;
        let polFactor = dtPolar * 10;

        outStars.material.uniforms.cameraMovmentPower.value = [azFactor, polFactor];

        // LogMng.debug(`azFactor: ${azFactor}; polFactor: ${polFactor};`);

        var polarAngle = camOrbit.getPolarAngle();
        var cameraRotationFactor = Math.abs(polarAngle - Math.PI / 2);

        if (cameraRotationFactor >= 0.75) {
            cameraRotationPower = verticalCameraMagnitude;
        }
        else {
            cameraRotationPower = 1.0 + ((verticalCameraMagnitude - 1.0) * (cameraRotationFactor / 0.75));
        }

        for (let i = 0; i < smallGalaxies.length; i++) {
            const g = smallGalaxies[i];
            if (g) g.rotateZ(g['rotSpeed'] * dt);
        }

        if (mainGalaxyPlane) {
            if (polarAngle < Math.PI / 2) {
                mainGalaxyPlane.material.opacity = 1 - (polarAngle / (Math.PI / 2));
            } else {
                mainGalaxyPlane.material.opacity = 1 - (Math.abs(polarAngle - Math.PI) / (Math.PI / 2));
            }
        }

        if (this.sprGalaxyCenter) {
            // debugger;
            // console.log(`polarAngle: ${polarAngle}`);
            const scMin = 0.1;
            let anFactor = scMin + (1 - scMin) * (1 - (polarAngle / (Math.PI / 2)));
            if (polarAngle > Math.PI / 2) {
                anFactor = scMin + (1 - scMin) * (1 - (Math.abs(polarAngle - Math.PI) / (Math.PI / 2)));
            }
            this.sprGalaxyCenter.scale.y = Config.SUN_SCALE * anFactor;
        }

        if (this.sprGalaxyCenter2) {
            // debugger;
            // console.log(`polarAngle: ${polarAngle}`);
            const scMin = 0.3;
            let anFactor = scMin + (1 - scMin) * (1 - (polarAngle / (Math.PI / 2)));
            if (polarAngle > Math.PI / 2) {
                anFactor = scMin + (1 - scMin) * (1 - (Math.abs(polarAngle - Math.PI) / (Math.PI / 2)));
            }
            this.sprGalaxyCenter2.scale.y = Config.SUN_SCALE_2 * anFactor;
        }

        camOrbit.update();

        checkMousePointerTimer -= dt;
        if (checkMousePointerTimer <= 0) {
            checkMousePointerTimer = 0.1;
            this.checkMousePointer();
        }

    }

}