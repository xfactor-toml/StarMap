import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { ThreeLoader } from './loaders/ThreeLoader';
import { LogMng } from './utils/LogMng';
import { MyMath } from './utils/MyMath';


const SKY_BOX_SIZE = 4000;

let vShaders = [
    `
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
    
    float a, b = 0.;
    
    void main() {

      vPosition = position;
      float scaleSize = 0.2;

      for (int starIndex = 0; starIndex < GALAXY_ACTIVE_STARS_COUNT; starIndex++) {
        if (activeStars[starIndex].x == position.x && activeStars[starIndex].y == position.y && activeStars[starIndex].z == position.z){
          scaleSize = activeStars[starIndex][3];
        }
      }

      customStarColor = 0.0;

      for (int starIndex = 0; starIndex < GALAXY_STARS_WITH_CUSTOM_COLOR_COUNT; starIndex++) {
        if (starsWithCustomColor[starIndex].x == position.x && starsWithCustomColor[starIndex].y == position.y && starsWithCustomColor[starIndex].z == position.z){
          customStarColor = starsWithCustomColor[starIndex][3];
        }
      }

      a=length(position);
      if(t > 0.) b = max(0.,(cos(a/20.-t*.02)-.99)*3./a);
      if(z > 0.) b = max(0.,cos(a/40.-z*.01+2.));
      mPosition = position*(1.+b*4.) * distanceSize;
      vec4 mvPosition = modelViewMatrix * vec4(mPosition,1.);
      gl_Position = mvPosition * projectionMatrix;
      
      gas = max(.0, sin(-a/1.));
      gl_PointSize = (pixelRatio * 28.0 * (1.+gas*2.)/length(mvPosition.xyz) * scaleSize * galaxyPower) * cameraRotationPower;
    }
`,
    `
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
    
    float a,b=0.;
    
    void main() {
    
      vPosition=position;
      float scaleSize = 1.0;

      for(int starIndex = 0; starIndex < GALAXY_ACTIVE_STARS_COUNT; starIndex++){
        if(activeStars[starIndex].x == position.x && activeStars[starIndex].y == position.y && activeStars[starIndex].z == position.z){
          scaleSize = activeStars[starIndex][3];
        }
      }

      customStarColor = 0.0;

      for(int starIndex = 0; starIndex < GALAXY_STARS_WITH_CUSTOM_COLOR_COUNT; starIndex++){
        if(starsWithCustomColor[starIndex].x == position.x && starsWithCustomColor[starIndex].y == position.y && starsWithCustomColor[starIndex].z == position.z){
          customStarColor = starsWithCustomColor[starIndex][3];
        }
      }

      a=length(position);
      if(t>0.)b=max(0.,(cos(a/20.-t*.02)-.99)*3./a);
      if(z>0.)b=max(0.,cos(a/40.-z*.01+2.));
      mPosition=position*(1.+b*4.) * distanceSize;
      vec4 mvPosition=modelViewMatrix*vec4(mPosition,1.);
      gl_Position=mvPosition*projectionMatrix;
      
      gas=max(.0,sin(-a/1.));
      gl_PointSize=(pixelRatio*size*(1.+gas*2.)/length(mvPosition.xyz) * scaleSize * galaxyPower) * cameraRotationPower;
    }
`,
    `
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
    
    float a,b=0.;
    
    void main(){
    
      vPosition=position;
      float scaleSize = 1.0;

      for(int starIndex = 0; starIndex < GALAXY_ACTIVE_STARS_COUNT; starIndex++){
        if(activeStars[starIndex].x == position.x && activeStars[starIndex].y == position.y && activeStars[starIndex].z == position.z){
          scaleSize = activeStars[starIndex][3];
        }
      }

      customStarColor = 0.0;

      for(int starIndex = 0; starIndex < GALAXY_STARS_WITH_CUSTOM_COLOR_COUNT; starIndex++){
        if(starsWithCustomColor[starIndex].x == position.x && starsWithCustomColor[starIndex].y == position.y && starsWithCustomColor[starIndex].z == position.z){
          customStarColor = starsWithCustomColor[starIndex][3];
        }
      }

      a=length(position);
      if(t>0.)b=max(0.,(cos(a/20.-t*.02)-.99)*3./a);
      if(z>0.)b=max(0.,cos(a/40.-z*.01+2.));
      mPosition=position*(1.+b*4.) * distanceSize;
      vec4 mvPosition=modelViewMatrix*vec4(mPosition,1.);
      gl_Position=mvPosition*projectionMatrix;
      
      gas=max(.0,sin(-a/1.));
      gl_PointSize=(pixelRatio*size*(1.+gas*2.)/length(mvPosition.xyz) * scaleSize * galaxyPower) * cameraRotationPower;
    }
`,
    `
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
    
    float a,b=0.;
    
    void main() {
      vPosition=position;
      float scaleSize = 1.0;

      for(int starIndex = 0; starIndex < GALAXY_ACTIVE_STARS_COUNT; starIndex++){
        if(activeStars[starIndex].x == position.x && activeStars[starIndex].y == position.y && activeStars[starIndex].z == position.z){
          scaleSize = activeStars[starIndex][3];
        }
      }

      customStarColor = 0.0;

      for(int starIndex = 0; starIndex < GALAXY_STARS_WITH_CUSTOM_COLOR_COUNT; starIndex++){
        if(starsWithCustomColor[starIndex].x == position.x && starsWithCustomColor[starIndex].y == position.y && starsWithCustomColor[starIndex].z == position.z){
          customStarColor = starsWithCustomColor[starIndex][3];
        }
      }

      a=1.0;
      if(t>0.)b=max(0.,(cos(a/20.-t*.02)-.99)*3./a);
      if(z>0.)b=max(0.,cos(a/40.-z*.01+2.));
      mPosition=position*(1.+b*4.) * distanceSize;
      vec4 mvPosition=modelViewMatrix*vec4(mPosition,1.);
      gl_Position=mvPosition*projectionMatrix;
      
      gas=max(.0,sin(-a/1.));
      gl_PointSize=(pixelRatio*size*(1.+gas*2.)/length(mvPosition.xyz) * scaleSize * galaxyPower) * 1.0;
    }
`,
    `
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
  
    
    void main(){
    
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
`
];

let fShaders = [
    `
    uniform float z;
        
    varying vec3 vPosition;
    varying vec3 mPosition;
    varying float gas;
    varying float customStarColor;
        
    void main() {

      float a=distance(mPosition,vPosition);
      if(a>0.)a=1.;
      
      float b=max(0.3,.0105*length(vPosition));

      float c=distance(gl_PointCoord,vec2(.5));
      float starlook=-(c-.5)*1.2; 
      float gaslook=(1.)/(c*50.);
      float texture=(starlook * 5.0)+(gaslook * 1.7);
      
      if(customStarColor == 0.0){
        gl_FragColor=vec4(0.505, 0.39, b, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 2.0){
        gl_FragColor=vec4(0.258, 0.282, 0.145, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 4.0){
        gl_FragColor=vec4(0.694, 0.301, 0.282, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 6.0){
        gl_FragColor=vec4(0.745, 0.635, 0.360, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 8.0){
        gl_FragColor=vec4(0.431, 0.831, 0.819, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 10.0){
        gl_FragColor=vec4(1.0, 0.901, 0.890, 1.)*texture*(0.13-a*.35);
      }

      if(z>0.)gl_FragColor*=cos(1.57*z/322.)*(1.-.001*length(mPosition));
    }
    `,
    `
uniform float z;
        
    varying vec3 vPosition;
    varying vec3 mPosition;
    varying float gas;
    varying float customStarColor;
        
    void main(){
 

      float a=distance(mPosition,vPosition);
      if(a>0.)a=1.;
      
      float b=max(0.3,.0105*length(vPosition));

      float c=distance(gl_PointCoord,vec2(.5));
      float starlook=-(c-.5)*1.2; 
      float gaslook=(1.)/(c*50.);
      float texture=(starlook * 5.0)+(gaslook * 1.7);
      
     if(customStarColor == 0.0){
        gl_FragColor=vec4(0.505, 0.39, b, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 2.0){
        gl_FragColor=vec4(0.258, 0.282, 0.145, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 4.0){
        gl_FragColor=vec4(0.694, 0.301, 0.282, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 6.0){
        gl_FragColor=vec4(0.745, 0.635, 0.360, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 8.0){
        gl_FragColor=vec4(0.431, 0.831, 0.819, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 10.0){
        gl_FragColor=vec4(1.0, 0.901, 0.890, 1.)*texture*(0.13-a*.35);
      }

      if(z>0.)gl_FragColor*=cos(1.57*z/322.)*(1.-.001*length(mPosition));
    }
`,
    `
uniform float z;
        
    varying vec3 vPosition;
    varying vec3 mPosition;
    varying float gas;
    varying float customStarColor;
        
    void main(){

      float a=distance(mPosition,vPosition);
      if(a>0.)a=1.;
      
      float b=max(0.3,.0105*length(vPosition));

      float c=distance(gl_PointCoord,vec2(.5));
      float starlook=-(c-.5)*1.2; 
      float gaslook=(1.)/(c*50.);
      float texture=(starlook * 5.0)+(gaslook * 1.7);
      
      if(customStarColor == 0.0){
        gl_FragColor=vec4(0.505, 0.39, b, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 2.0){
        gl_FragColor=vec4(0.258, 0.282, 0.145, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 4.0){
        gl_FragColor=vec4(0.694, 0.301, 0.282, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 6.0){
        gl_FragColor=vec4(0.745, 0.635, 0.060, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 8.0){
        gl_FragColor=vec4(0.431, 0.831, 0.119, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 10.0){
        gl_FragColor=vec4(1.0, 0.901, 0.190, 1.)*texture*(0.13-a*.35);
      }

      if(z>0.)gl_FragColor*=cos(1.57*z/322.)*(1.-.001*length(mPosition));
    }
`,
    `
    uniform float z;
        
    varying vec3 vPosition;
    varying vec3 mPosition;
    varying float gas;
    varying float customStarColor;
        
    void main(){

      float a=distance(mPosition,vPosition);
      if(a>0.)a=1.;
      
      float b=max(0.3,.0105*length(vPosition));

      float c=distance(gl_PointCoord,vec2(.5));
      float starlook=-(c-.5)*1.2; 
      float gaslook=(1.)/(c*50.);
      float texture=(starlook * 5.0)+(gaslook * 1.7);
      
      if(customStarColor == 0.0){
        gl_FragColor=vec4(0.505, 0.39, 0.445, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 2.0){
        gl_FragColor=vec4(0.258, 0.282, 0.245, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 4.0){
        gl_FragColor=vec4(0.894, 0.201, 0.282, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 6.0){
        gl_FragColor=vec4(0.745, 0.735, 0.460, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 8.0){
        gl_FragColor=vec4(0.631, 0.831, 0.019, 1.)*texture*(0.13-a*.35);
      }
      else if(customStarColor <= 10.0){
        gl_FragColor=vec4(1.0, 0.901, 0.290, 1.)*texture*(0.13-a*.35);
      }

      if(z>0.)gl_FragColor*=cos(1.57*z/322.)*(1.-.001*length(mPosition));
    }
`,
    `
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
        
        if(r <= tensionPower)
        {
            vec2 ptc = mix(pt1, pt2, r); 
            float dist = distance(ptc, uv);
            if(dist < tickness / 2.0)
            {
                clrFactor = 1.0;
            }
        }
        return clrFactor;
    }


    void main(){
      float tension = 4.9;
      float pointSize = 0.06;
      float tensionPower = 1.0;

      if(z>0.)gl_FragColor*=cos(1.57*z/322.)*(1.-.001*length(mPosition));

      if(distance(gl_PointCoord, vec2(0.5, 0.5)) < 0.05){
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }

      if(distance(vPosition, vec3(0.5, 0.5, 0.5)) < 10000.){
        tension = 3.6;
        float pointSize = 0.06;
        float tensionPower = 1.0;
      }

      if(distance(vPosition, vec3(0.5, 0.5, 0.5)) < 900.){
        tension = 0.5;
        float pointSize = 0.06;
        float tensionPower = 1.0;
      }

      if(abs(cameraMovmentPower.x) > 0.02 || abs(cameraMovmentPower.y) > 0.02){
        float distanceToLine = line(gl_PointCoord.xy, (cameraMovmentPower.xy * tension) + .5, vec2(0.5, 0.5), pointSize, tensionPower) * 5.0;
        gl_FragColor = vec4(distanceToLine, distanceToLine, distanceToLine, distanceToLine);
      }

    }
`
];

var verticalCameraMagnitude = 5.0;

var firstGalaxyPower = 0.4;
var secondGalaxyPower = 3.2;
var thirdGalaxyPower = 1.2;
var fouthGalaxyPower = 0.9;

var starsOutsideGalaxysPower = 2.0;

var rickMobileCount = 0;

var minCameraDistance = 150;
var maxCameraDistance = 200;

var controlls;

var camera;

var lastFreeCameraPosition = {
    x: null,
    y: null,
    z: null
};

var galaxy;

var raycaster;
var mouse;
var scene;

var objectHovered = false;
var selectedPlanet = -1;

var selectedImage = null;
var currentObjectIsFounded = false;

var backButton;
var playButton;
var comingSoonWindow;
var taskTable;
var readyButton;
var youWonWindow;
var wrongWindow;
var getAGiftButton;

var giftURL = "https://google.com";

var dynamicStars;
var starsOutsideGalaxy;

var allStars = [];

var firstGalaxyActiveStarsPull = [];
var secondGalaxyActiveStarsPull = [];
var thirdGalaxyActiveStarsPull = [];
var fouthGalaxyActiveStarsPull = [];
var fifthGalaxyActiveStarsPull = [];

var cameraRotationPower = 1.0;

let clouds;
let fouthGalaxyClouds = {};
let warpStars;
let galaxyPlane;

var smallGalaxys = [
    {
        mtlFile: './assets/models/smallGalaxy/minigalaxy020.mtl',
        objFile: './assets/models/smallGalaxy/minigalaxy.obj',
        position: new THREE.Vector3(200.0, 0.0, -1000.0),
        scale: new THREE.Vector3(2000.0, 2000.0, 2000.0),
        defaultRotation: new THREE.Vector3(55, 45, 0),
        rotationPower: 0.2
    },
    {
        mtlFile: './assets/models/smallGalaxy/minigalaxy520.mtl',
        objFile: './assets/models/smallGalaxy/minigalaxy.obj',
        position: new THREE.Vector3(700, 250, -800.0),
        scale: new THREE.Vector3(2000.0, 2000.0, 2000.0),
        defaultRotation: new THREE.Vector3(65, 0, 25),
        rotationPower: 0.2
    },
    {
        mtlFile: './assets/models/smallGalaxy/minigalaxy020.mtl',
        objFile: './assets/models/smallGalaxy/minigalaxy.obj',
        position: new THREE.Vector3(1300, 400, 100.0),
        scale: new THREE.Vector3(2000.0, 2000.0, 2000.0),
        defaultRotation: new THREE.Vector3(20, 0, 55),
        rotationPower: 0.2
    },
    {
        mtlFile: './assets/models/smallGalaxy/minigalaxy320.mtl',
        objFile: './assets/models/smallGalaxy/minigalaxy.obj',
        position: new THREE.Vector3(1300.0, -500, 0.0),
        scale: new THREE.Vector3(2000.0, 2000.0, 2000.0),
        defaultRotation: new THREE.Vector3(45, 90, 0),
        rotationPower: 0.3
    },
    {
        mtlFile: './assets/models/smallGalaxy/minigalaxy620.mtl',
        objFile: './assets/models/smallGalaxy/minigalaxy.obj',
        position: new THREE.Vector3(-0.0, 0.0, 1100.0),
        scale: new THREE.Vector3(2000.0, 2000.0, 2000.0),
        defaultRotation: new THREE.Vector3(-95, 45, 9),
        rotationPower: 0.2
    },
    {
        mtlFile: './assets/models/smallGalaxy/minigalaxy420.mtl',
        objFile: './assets/models/smallGalaxy/minigalaxy.obj',
        position: new THREE.Vector3(-1300.0, 150.0, -0.0),
        scale: new THREE.Vector3(2000.0, 2000.0, 2000.0),
        defaultRotation: new THREE.Vector3(90, 90, 0),
        rotationPower: 0.1
    }
];

var smallGalaxysObjectsArray = [];

var taskTableSlots = [
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

var taskTableImages = [
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

var layersNames = {
    1: 'first',
    2: 'second',
    3: 'third'
};

var planets = [
    {
        preview: './assets/Star.svg',
        previewObject: null,
        physicalPlanet: [],
        modelsFolder: './assets/models/gasorpasorp/',
        layersCount: 3,
        planetScale: new THREE.Vector3(1.0, 1.0, 1.0),
        position: new THREE.Vector3(70, 3.5, 0),
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
        position: new THREE.Vector3(-70, 3.5, 35),
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
        position: new THREE.Vector3(-25, 3.5, -75),
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
        position: new THREE.Vector3(30, 3.5, 65),
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
        position: new THREE.Vector3(-75, 3.5, 1),
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
        position: new THREE.Vector3(25, 3.5, -90),
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
        position: new THREE.Vector3(45, 3.5, 110),
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
        position: new THREE.Vector3(85, 3.5, -80),
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
        position: new THREE.Vector3(120, 3.5, 80),
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

var rickmobilesPull = [];

// var sceneForSmallGalaxys;
var controls;
var renderer;
var renderTarget;
let firststars: THREE.Geometry;
let firstgalaxy: THREE.Points;
var secondstars;
var secondgalaxy;
var thirdgalaxy;
var fouthgalaxy;
var fifthgalaxy;
var stars;

let loader: ThreeLoader;

export function initScene() {
    preload(() => {
        // LogMng.debug('initStarsCount');
        initStarsCount();
        // LogMng.debug('setScene');
        setScene();

        document.addEventListener('pointermove', onMouseMove);
        document.addEventListener('click', onMouseClick);
        document.addEventListener('keydown', onKeyPress);

        animate();
    });
}

function preload(cb) {
    let sb_format = '.jpg';
    let sb_path = './assets/' + 'skybox/blue/1024/';

    loader = ThreeLoader.getInstance();
    loader.onLoadCompleteSignal.addOnce(cb);

    loader.texture('skybox1-xpos', sb_path + 'right' + sb_format);
    loader.texture('skybox1-xneg', sb_path + 'left' + sb_format);
    loader.texture('skybox1-ypos', sb_path + 'top' + sb_format);
    loader.texture('skybox1-yneg', sb_path + 'bot' + sb_format);
    loader.texture('skybox1-zpos', sb_path + 'front' + sb_format);
    loader.texture('skybox1-zneg', sb_path + 'back' + sb_format);

    loader.start();
}

function initStarsCount() {
    const iphoneStarsCount = [
        {
            active: 25,
            customColor: 90
        },
        {
            active: 55,
            customColor: 40
        },
        {
            active: 20,
            customColor: 50
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
        {
            active: 45,
            customColor: 90
        },
        {
            active: 35,
            customColor: 50
        },
        {
            active: 20,
            customColor: 50
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
        {
            active: 900,
            customColor: 2000
        },
        {
            active: 700,
            customColor: 1000
        },
        {
            active: 400,
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

    let starsArr = desktopStarsCount;

    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        starsArr = iphoneStarsCount;
    }

    if (/Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        starsArr = androidStarsCount;
    }

    for (let i = 0; i < vShaders.length; i++) {
        let act: string = String(starsArr[i].active);
        let clr: string = String(starsArr[i].customColor);
        console.log('act, clr: ', act, clr);
        vShaders[i] = vShaders[i].replace('GALAXY_ACTIVE_STARS_COUNT', act);
        vShaders[i] = vShaders[i].replace('GALAXY_ACTIVE_STARS_COUNT', act);
        vShaders[i] = vShaders[i].replace('GALAXY_STARS_WITH_CUSTOM_COLOR_COUNT', clr);
        vShaders[i] = vShaders[i].replace('GALAXY_STARS_WITH_CUSTOM_COLOR_COUNT', clr);
        // console.log(`vShaders[${i}]:`, vShaders[i]);
    }
}

//threejs functions
function setScene() {
    let domParent = document.getElementById('game');

    scene = new THREE.Scene();
    // sceneForSmallGalaxys = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.5, 1000000);
    camera.position.set(-90, 120, 180);

    renderTarget = new THREE.WebGLRenderTarget(innerWidth, innerHeight);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(innerWidth, innerHeight);

    renderer.context.getExtension('OES_standard_derivatives');

    renderer.setClearColor(0x0000000);
    domParent.appendChild(renderer.domElement);

    createSkybox();

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.035;
    controls.enablePan = false;
    controls.minDistance = minCameraDistance;
    controls.maxDistance = maxCameraDistance;

    firststars = new THREE.Geometry();
    clouds = new THREE.Group();
    warpStars = new THREE.Group()
    scene.add(clouds);
    scene.add(warpStars);

    var HTTPRequest = new XMLHttpRequest();

    HTTPRequest.open("GET", "./assets/galaxyStructure.json", false);

    HTTPRequest.onload = function () {
        firststars.vertices = newGalaxy(40, 20, 20, 0.7);
    }

    HTTPRequest.send();

    new THREE.TextureLoader().load('./assets/BC10.webp',
        function (texture) {
            galaxyPlane = new THREE.Mesh(
                new THREE.PlaneGeometry(350, 350),
                new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                    transparent: true,
                    depthWrite: false,
                    opacity: 1.0
                }));
            galaxyPlane.rotation.x = -Math.PI / 2;
            galaxyPlane.rotation.z = -1.2;
            galaxyPlane.position.y = -1;
            galaxyPlane.position.z = 9;
            scene.add(galaxyPlane);
        },
        undefined,
        function (err) {
            console.error('An error happened.');
        }
    );

    var customColorStars = [];

    var uf: any = {
        size: { type: 'f', value: 2.5 },
        distanceSize: { type: 'f', value: 1 },
        t: { type: "f", value: 0 },
        z: { type: "f", value: 0 },
        pixelRatio: { type: "f", value: innerHeight },
        activeStars: { value: firstGalaxyActiveStarsPull },
        starsWithCustomColor: { value: customColorStars },
        cameraRotationPower: { value: cameraRotationPower },
        galaxyPower: { value: firstGalaxyPower },
        derivatives: true
    };

    var firstgalaxyMaterial = new THREE.ShaderMaterial({
        vertexShader: vShaders[0],
        fragmentShader: fShaders[0],
        uniforms: uf,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    // firstgalaxyMaterial.renderOrder = 999;

    firstgalaxy = new THREE.Points(firststars, firstgalaxyMaterial);
    firstgalaxy.renderOrder = 999;

    firstgalaxy.rotation.set(0, Math.PI / 1.5, 0);
    firstgalaxy.position.x = 5;
    firstgalaxy.position.z = 12;

    scene.add(firstgalaxy);

    secondstars = new THREE.Geometry();
    secondstars.vertices = newGalaxy(2200, 145, 145, 0.3, 2);

    uf = {
        size: { type: 'f', value: 0.2 },
        distanceSize: { type: 'f', value: 1 },
        t: { type: "f", value: 0 },
        z: { type: "f", value: 0 },
        pixelRatio: { type: "f", value: innerHeight },
        activeStars: { value: secondGalaxyActiveStarsPull },
        starsWithCustomColor: { value: customColorStars },
        cameraRotationPower: { value: cameraRotationPower },
        galaxyPower: { value: secondGalaxyPower },
        derivatives: true
    };
        
    var secondgalaxyMaterial = new THREE.ShaderMaterial({
        vertexShader: vShaders[1],
        fragmentShader: fShaders[1],
        uniforms: uf,
        // depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    secondgalaxy = new THREE.Points(secondstars, secondgalaxyMaterial);
    secondgalaxy.rotation.set(0, 0, 0);

    scene.add(secondgalaxy);


    var thirdstars = new THREE.Geometry();
    thirdstars.vertices = newGalaxy(600, 150, 150, 0.4, 3);

    uf = {
        size: { type: 'f', value: 0.5 },
        distanceSize: { type: 'f', value: 1 },
        t: { type: "f", value: 0 },
        z: { type: "f", value: 0 },
        pixelRatio: { type: "f", value: innerHeight },
        activeStars: { value: thirdGalaxyActiveStarsPull },
        starsWithCustomColor: { value: customColorStars },
        cameraRotationPower: { value: cameraRotationPower },
        galaxyPower: { value: thirdGalaxyPower },
        derivatives: true
    };

    var thirdgalaxyMaterial = new THREE.ShaderMaterial({
        vertexShader: vShaders[2],
        fragmentShader: fShaders[2],
        uniforms: uf,
        // depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    thirdgalaxy = new THREE.Points(thirdstars, thirdgalaxyMaterial);
    thirdgalaxy.rotation.set(0, 0, 0);

    scene.add(thirdgalaxy);


    dynamicStars = newGalaxy(550, 150, 150, 0.2, 4);

    var fouthstars = new THREE.Geometry();

    uf = {
        size: { type: 'f', value: 4.0 },
        distanceSize: { type: 'f', value: 1 },
        t: { type: "f", value: 0 },
        z: { type: "f", value: 0 },
        pixelRatio: { type: "f", value: innerHeight },
        activeStars: { value: fouthGalaxyActiveStarsPull },
        starsWithCustomColor: { value: customColorStars },
        cameraRotationPower: { value: cameraRotationPower },
        galaxyPower: { value: fouthGalaxyPower },
        derivatives: true
    };

    var fouthgalaxyMaterial = new THREE.ShaderMaterial({
        vertexShader: vShaders[3],
        fragmentShader: fShaders[3],
        uniforms: uf,
        // depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    fouthgalaxy = new THREE.Points(fouthstars, fouthgalaxyMaterial);
    fouthgalaxy.rotation.set(0, 0, 0);
    fouthgalaxy.position.y = 3;
    scene.add(fouthgalaxy);


    var fifthstars = new THREE.Geometry();
    fifthstars.vertices = newStarsOutsideGalaxys(4000);

    uf = {
        size: { type: 'f', value: 2.5 },
        distanceSize: { type: 'f', value: 1 },
        t: { type: "f", value: 0 },
        z: { type: "f", value: 0 },
        pixelRatio: { type: "f", value: innerHeight },
        cameraRotationPower: { value: cameraRotationPower },
        galaxyPower: { value: starsOutsideGalaxysPower },
        cameraMovmentPower: { value: [0.0, 0.0] },
        derivatives: true
    };

    var fifthgalaxyMaterial = new THREE.ShaderMaterial({
        vertexShader: vShaders[4],
        fragmentShader: fShaders[4],
        uniforms: uf,
        // depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    fifthgalaxy = new THREE.Points(fifthstars, fifthgalaxyMaterial);
    fifthgalaxy.rotation.set(0, 0, 0);

    scene.add(fifthgalaxy);

    smallGalaxys.forEach(function (smallGalaxy) {

        new MTLLoader().load(smallGalaxy.mtlFile, (materials: any) => {
            materials.preload();
            // materials.depthTest = false;
            materials.depthWrite = false;

            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(smallGalaxy.objFile, function (newSmallGalaxys) {

                newSmallGalaxys.position.x = smallGalaxy.position.x;
                newSmallGalaxys.position.y = smallGalaxy.position.y;
                newSmallGalaxys.position.z = smallGalaxy.position.z;

                newSmallGalaxys.scale.x = smallGalaxy.scale.x;
                newSmallGalaxys.scale.y = smallGalaxy.scale.y;
                newSmallGalaxys.scale.z = smallGalaxy.scale.z;

                smallGalaxysObjectsArray.push(newSmallGalaxys);
                // sceneForSmallGalaxys.add(newSmallGalaxys);
                scene.add(newSmallGalaxys);

                newSmallGalaxys.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(smallGalaxy.defaultRotation.x));
                newSmallGalaxys.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(smallGalaxy.defaultRotation.y));
                newSmallGalaxys.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(smallGalaxy.defaultRotation.z));
            });

        });

    });

    const startActivity = (starID, currentGalaxy) => {
        let star = currentGalaxy.material.uniforms.activeStars.value[starID];
        const starUp = () => {
            let up = setInterval(() => {
                currentGalaxy.material.uniforms.activeStars.value[starID].w += 0.6;
                fouthGalaxyClouds[starID].material.opacity += 0.009;
                if (star.w >= 5) {
                    clearInterval(up);
                    setTimeout(starDown, 1);
                }
            }, 100);
        }
        const starDown = () => {
            let down = setInterval(() => {
                currentGalaxy.material.uniforms.activeStars.value[starID].w -= 0.6;
                if (fouthGalaxyClouds[starID].material.opacity > 0) {
                    fouthGalaxyClouds[starID].material.opacity -= 0.009;
                }
                if (star.w <= 0) {
                    clearInterval(down);
                    fouthGalaxyClouds[starID].material.opacity = 0;
                    setTimeout(starUp, Math.random() * 30000);
                }
            }, 100);
        }
        starUp();
    }

    var cloudTexture = new THREE.TextureLoader().load('./assets/cloud.png');
    var cloudMaterial = new THREE.SpriteMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.0,
        depthWrite: false
    });

    for (let dynamicStarID = 0; dynamicStarID < 400; dynamicStarID++) {

        var star = dynamicStars[dynamicStarID];

        var cloudMaterial = cloudMaterial.clone();
        var cloudMesh = new THREE.Sprite(cloudMaterial);
        cloudMesh.material.rotation = Math.PI * Math.random();
        cloudMesh.renderOrder = 1;
        cloudMesh.scale.set(7, 7, 7);

        var cloud = cloudMesh.clone();
        cloud.position.set(star.x, star.y, star.z - 1);
        clouds.add(cloud);

        fouthGalaxyClouds[dynamicStarID] = cloud;

        fouthGalaxyActiveStarsPull[dynamicStarID] = new THREE.Vector4(star.x, star.y, star.z, 0);
        fouthgalaxy.geometry.vertices[dynamicStarID] = new THREE.Vector3(star.x, star.y, star.z);

        setTimeout(startActivity, Math.random() * 30000, dynamicStarID, fouthgalaxy);
    }

    var centerCloud = cloudMesh.clone();
    centerCloud.position.set(0, 0, 0);
    centerCloud.scale.set(45, 45, 45);
    scene.add(centerCloud);

    for (let starID = 0; starID < 900; starID++) {
        // var star = firstgalaxy.geometry.vertices[Math.floor(Math.random() * firstgalaxy.geometry.vertices.length)];
        let star = firststars.vertices[MyMath.randomIntInRange(0, firststars.vertices.length - 1)];
        firstGalaxyActiveStarsPull.push(new THREE.Vector4(star.x, star.y, star.z, 1.0));
        setTimeout(upStarActivity, Math.random() * 3000, starID, star.x, star.y, star.z, firstgalaxy);
    }

    for (let starID = 0; starID < 1200; starID++) {
        let star = secondgalaxy.geometry.vertices[Math.floor(Math.random() * secondgalaxy.geometry.vertices.length)];
        secondGalaxyActiveStarsPull.push(new THREE.Vector4(star.x, star.y, star.z, 1.0));
        setTimeout(upStarActivity, Math.random() * 3000, starID, star.x, star.y, star.z, secondgalaxy);
    }

    for (let starID = 0; starID < 400; starID++) {
        let star = thirdgalaxy.geometry.vertices[Math.floor(Math.random() * thirdgalaxy.geometry.vertices.length)];
        thirdGalaxyActiveStarsPull.push(new THREE.Vector4(star.x, star.y, star.z, 1.0));
        setTimeout(upStarActivity, Math.random() * 3000, starID, star.x, star.y, star.z, thirdgalaxy);
    }

    allStars = [];
    allStars = allStars.concat(firststars.vertices);
    allStars = allStars.concat(secondgalaxy.geometry.vertices);
    allStars = allStars.concat(thirdgalaxy.geometry.vertices);
    allStars = allStars.concat(dynamicStars);
    allStars = allStars.concat(fifthgalaxy.geometry.vertices);

    for (let customColorStarID = 0; customColorStarID < 2200; customColorStarID++) {
        var star = allStars[Math.floor(Math.random() * allStars.length)];
        customColorStars.push(new THREE.Vector4(star.x, star.y, star.z, Math.random() * 10));
    }

    window.addEventListener('resize', function () {
        camera.aspect = innerWidth / innerHeight;
        renderer.setSize(innerWidth, innerHeight);
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    }, false);

    planets.forEach(function (planet, planetIndex) {

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

        scene.add(newPlanetPreview);

        for (var layer = 1; layer < planet.layersCount + 1; layer++) {

            new MTLLoader().load(planet.modelsFolder + layersNames[layer] + "_layer.mtl", (materials) => {
                let currentLayer = layer;

                materials.preload();

                var objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load(planet.modelsFolder + layersNames[currentLayer] + "_layer.obj", function (model) {

                    model.scale.set(planet.planetScale.x, planet.planetScale.y, planet.planetScale.z);

                    planets[planetIndex].physicalPlanet[currentLayer] = model;

                    if (currentLayer == 1) {

                        model.children[0]['material'].transparent = false;

                    }

                    model.scale.x += planets[planetIndex].layersDefaultTransformation[currentLayer].scale.x;
                    model.scale.y += planets[planetIndex].layersDefaultTransformation[currentLayer].scale.y;
                    model.scale.z += planets[planetIndex].layersDefaultTransformation[currentLayer].scale.z;

                    model.rotation.x = planets[planetIndex].layersDefaultTransformation[currentLayer].rotation.x;
                    model.rotation.y = planets[planetIndex].layersDefaultTransformation[currentLayer].rotation.y;
                    model.rotation.z = planets[planetIndex].layersDefaultTransformation[currentLayer].rotation.z;

                    model.position.set(planet.position.x, planet.position.y, planet.position.z);
                    model.children[0]['material'].visible = false;
                    scene.add(model);

                    model.name = planets[planetIndex].name;

                });

            });

        }

        planets[planetIndex].previewObject = newPlanetPreview;
    });

    for (var rickmobile = 0; rickmobile < rickMobileCount; rickmobile++) {
        var newRickmobileStartPosition = planets[Math.floor(Math.random() * planets.length)].position;
        var newRickmobileEndPosition = planets[Math.floor(Math.random() * planets.length)].position;

        while (newRickmobileStartPosition == newRickmobileEndPosition) {
            newRickmobileEndPosition = planets[Math.floor(Math.random() * planets.length)].position;
        }

        rickmobilesPull[rickmobile] = {
            startPosition: newRickmobileStartPosition,
            endPosition: newRickmobileEndPosition,
            model: null,
            speed: Math.random() * 3
        };

        new MTLLoader().load("./assets/models/rickmobil/rickmobil.mtl", (materials) => {
            let currentRickmobile = rickmobile;
            materials.preload();

            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load("./assets/models/rickmobil/rickmobil.obj", function (model) {
                model.position.set(rickmobilesPull[currentRickmobile].startPosition.x, rickmobilesPull[currentRickmobile].startPosition.y, rickmobilesPull[currentRickmobile].startPosition.z);
                model.lookAt(rickmobilesPull[currentRickmobile].endPosition);
                model.scale.set(0, 0, 0);
                rickmobilesPull[currentRickmobile].model = model;
                scene.add(model);
                model.visible = false;
                setTimeout(MoveRickmobil, Math.random() * 5000, currentRickmobile);
            });

        });

    }

    var backButtonTexture = new THREE.TextureLoader().load("./assets/interface/back.png");
    var backButtonMaterial = new THREE.SpriteMaterial({ map: backButtonTexture });

    backButton = new THREE.Sprite(backButtonMaterial);
    backButton.scale.set(1.2, 0.4, 0.4);
    backButton.position.z = -5;
    backButton.position.y = 2;
    backButton.position.x = -2.05;
    backButton.name = "backButton";

    var playButtonTexture = new THREE.TextureLoader().load("./assets/interface/play.png");
    var playButtonMaterial = new THREE.SpriteMaterial({ map: playButtonTexture });
    playButton = new THREE.Sprite(playButtonMaterial);

    playButton.scale.set(0.4, 0.4, 0.4);
    playButton.position.z = -4;
    playButton.position.y = 0;
    playButton.position.x = 1.2;
    playButton.name = "playButton";

    var comingSoonWindowTexture = new THREE.TextureLoader().load("./assets/interface/coming_soon.png");
    var comingSoonWindowMaterial = new THREE.SpriteMaterial({ map: comingSoonWindowTexture });
    comingSoonWindow = new THREE.Sprite(comingSoonWindowMaterial);
    comingSoonWindow.scale.set(1.2, 0.4, 0.4);
    comingSoonWindow.name = "comingSoonWindow";
    comingSoonWindow.position.z = -3;

    var taskTableTexture = new THREE.TextureLoader().load("./assets/interface/table.png");
    var taskTableMaterial = new THREE.SpriteMaterial({ map: taskTableTexture });
    taskTable = new THREE.Sprite(taskTableMaterial);
    taskTable.scale.set(3.2, 2, 2);
    taskTable.position.z = -3;

    taskTableSlots.forEach(function (slot, slotID) {
        var newSlotMaterial = new THREE.SpriteMaterial({ color: "white", opacity: 0.5 });
        var newSlot = new THREE.Sprite(newSlotMaterial);

        newSlot.position.set(slot.center.x, slot.center.y, -2.9);
        newSlot.scale.set(0.539, 0.24, 0.5);
        newSlot.name = "tableSlot";
        newSlot['slotID'] = slotID;
        taskTableSlots[slotID].object = newSlot;
    });

    taskTableImages.forEach(function (image, imageID) {
        var newImageTexture = new THREE.TextureLoader().load(image.texture);
        var newImageMaterial = new THREE.SpriteMaterial({ map: newImageTexture });
        var newImage = new THREE.Sprite(newImageMaterial);

        newImage.position.set(image.spawnPosition.x, image.spawnPosition.y, -2.9);
        newImage.scale.set(0.4 * image.scale.x, 0.4 * image.scale.y, 0.4 * image.scale.z);
        newImage.name = "tableImage";
        newImage['imageID'] = imageID;
        taskTableImages[imageID].object = newImage;
    });

    var readyButtonTexture = new THREE.TextureLoader().load("./assets/interface/ready.png");
    var readyButtonMaterial = new THREE.SpriteMaterial({ map: readyButtonTexture });
    readyButton = new THREE.Sprite(readyButtonMaterial);
    readyButton.scale.set(0.6, 0.2, 0.2);
    readyButton.position.set(1.0, -0.6, -2.9);

    readyButton.name = "readyButton";

    var youWonWindowTexture = new THREE.TextureLoader().load("./assets/interface/you_won.png");
    var youWonWindowMaterial = new THREE.SpriteMaterial({ map: youWonWindowTexture });

    youWonWindow = new THREE.Sprite(youWonWindowMaterial);

    youWonWindow.position.set(0.0, 0.0, -2.8);
    youWonWindow.scale.set(1.5, 0.75, 0.75);

    youWonWindow.name = "youWonWindow";


    var getAGiftButtonTexture = new THREE.TextureLoader().load("./assets/interface/get_a_gift.png");
    var getAGiftButtonMaterial = new THREE.SpriteMaterial({ map: getAGiftButtonTexture });

    getAGiftButton = new THREE.Sprite(getAGiftButtonMaterial);

    getAGiftButton.position.set(0.0, -0.2, -2.7);
    getAGiftButton.scale.set(0.6, 0.2, 0.2);

    getAGiftButton.name = "giftButton";

    var wrongWindowTexture = new THREE.TextureLoader().load("./assets/interface/wrong.png");
    var wrongWindowMaterial = new THREE.SpriteMaterial({ map: wrongWindowTexture });
    wrongWindow = new THREE.Sprite(wrongWindowMaterial);

    wrongWindow.position.set(0.0, 0.0, -2.6);
    wrongWindow.scale.set(0.8, 0.4, 0.4);

    wrongWindow.name = "wrongWindow";

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    domParent.addEventListener('touchstart', (event) => {
        // event.target.requestFullscreen();
    });
}

function createSkybox() {
    let imagePrefix = "skybox1-";
    let directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    let materialArray = [];
    for (let i = 0; i < directions.length; i++)
        materialArray.push(new THREE.MeshBasicMaterial({
            map: loader.getTexture(imagePrefix + directions[i]),
            side: THREE.BackSide,
            // transparent: true,
            // opacity: 0.8,
            depthWrite: false
        }));

    let imgArray = [];
    for (let i = 0; i < directions.length; i++)
        imgArray.push(loader.getTexture(imagePrefix + directions[i]).image);

    let skyGeometry = new THREE.BoxBufferGeometry(SKY_BOX_SIZE, SKY_BOX_SIZE, SKY_BOX_SIZE);
    let skyBox = new THREE.Mesh(skyGeometry, materialArray);
    skyBox.position.set(0, 0, 0);
    scene.add(skyBox);
}

function getDistanceBetweenTwoVectors(v1, v2) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function upStarActivity(starID, starX, starY, starZ, currentGalaxy) {
    let star = currentGalaxy.material.uniforms.activeStars.value[starID];
    if (star.w < 1.8) {
        currentGalaxy.material.uniforms.activeStars.value[starID].w += 0.01;
        setTimeout(upStarActivity, 1, starID, starX, starY, starZ, currentGalaxy);
    } else {
        setTimeout(downStarActivity, 1, starID, starX, starY, starZ, currentGalaxy);
    }
}

function downStarActivity(starID, starX, starY, starZ, currentGalaxy) {
    let star = currentGalaxy.material.uniforms.activeStars.value[starID];
    if (currentGalaxy == fouthgalaxy) {
        var minStarActivity = 0.0;
    }
    else {
        var minStarActivity = 1.0;
    }

    if (star.w > minStarActivity) {
        currentGalaxy.material.uniforms.activeStars.value[starID].w -= 0.005;
        setTimeout(downStarActivity, 1, starID, starX, starY, starZ, currentGalaxy);
    }
    else {
        refrestStarsActivity(starID, starX, starY, starZ, currentGalaxy);
    }
}

function refrestStarsActivity(starID, starX, starY, starZ, currentGalaxy) {
    if (currentGalaxy == fouthgalaxy) {
        var star = dynamicStars[Math.floor(Math.random() * dynamicStars.length)];
        currentGalaxy.geometry.vertices[starID].set(star.x, star.y, star.z);
        currentGalaxy.geometry.verticesNeedUpdate = true;
        currentGalaxy.material.uniforms.activeStars.value[starID] = new THREE.Vector4(star.x, star.y, star.z, 0.0);
        setTimeout(upStarActivity, Math.random() * 3000, starID, star.x, star.y, star.z, currentGalaxy);
        return;
    }

    setTimeout(upStarActivity, Math.random() * 3000, starID, starX, starY, starZ, currentGalaxy);
}

function MoveRickmobil(rickmobileID) {
    let currentRickmobile = rickmobilesPull[rickmobileID];

    if (currentRickmobile.model.visible == false) {
        currentRickmobile.model.visible = true;
    }

    if (getDistanceBetweenTwoVectors(currentRickmobile.model.position, currentRickmobile.endPosition) >= (getDistanceBetweenTwoVectors(currentRickmobile.startPosition, currentRickmobile.endPosition) / 2)) {
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

    if (getDistanceBetweenTwoVectors(currentRickmobile.model.position, currentRickmobile.endPosition) <= (getDistanceBetweenTwoVectors(currentRickmobile.endPosition, currentRickmobile.startPosition) / (150 * currentRickmobile.speed))) {
        var newRickmobileStartPosition = planets[Math.floor(Math.random() * planets.length)].position;
        var newRickmobileEndPosition = planets[Math.floor(Math.random() * planets.length)].position;
        currentRickmobile.startPosition = newRickmobileStartPosition;
        currentRickmobile.endPosition = newRickmobileEndPosition;

        while (newRickmobileStartPosition == newRickmobileEndPosition) {
            newRickmobileEndPosition = planets[Math.floor(Math.random() * planets.length)].position;
        }

        currentRickmobile.model.position.set(currentRickmobile.startPosition.x, currentRickmobile.startPosition.y, currentRickmobile.startPosition.z);
        currentRickmobile.model.visible = false;
        currentRickmobile.model.scale.set(0, 0, 0);
        currentRickmobile.speed = Math.random() * 3;

        setTimeout(MoveRickmobil, Math.random() * 5000, rickmobileID);

        return;
    }

    setTimeout(MoveRickmobil, 8, rickmobileID);
}

function moveCameraTo(camera, startX, startY, startZ, endX, endY, endZ, maxFrames, currentFrame, setCameraPosition) {
    camera.position.x += ((endX - startX) / maxFrames);
    camera.position.y += ((endY - startY) / maxFrames);
    camera.position.z += ((endZ - startZ) / maxFrames);

    if (currentFrame <= maxFrames) {
        setTimeout(moveCameraTo, Math.random(), camera, startX, startY, startZ, endX, endY, endZ, maxFrames, currentFrame + 1, setCameraPosition);
    }
    else {
        if (setCameraPosition) {
            camera.position.set(endX, endY, endZ);
        }
    }

}

function newGalaxy(_n, xSize, zSize, armOffsetMax, filterType = -1) {
    var stars = [];
    const numArms = 5;
    const armSeparationDistance = 2 * Math.PI / numArms;
    const rotationFactor = 3.5;
    if ((filterType == 4)) {
        var randomOffsetXY = 0.2;
    }
    else {
        var randomOffsetXY = 0.1;
    }

    for (var i = 0; i < _n; i++) {
        // Choose a distance from the center of the galaxy.
        var distance = Math.random();
        distance = Math.pow(distance, 2);

        if (filterType == 2) {
            while (distance < 0.15 || distance > 0.75) {
                distance = Math.pow(Math.random(), 2);
            }
        }

        if (filterType == 3 || filterType == 4) {
            while (distance < 0.4) {
                distance = Math.pow(Math.random(), 2);
            }
        }

        // Choose an angle between 0 and 2 * PI.
        var angle = Math.random() * 2 * Math.PI;
        var armOffset = Math.random() * armOffsetMax;
        armOffset = armOffset - armOffsetMax / 2;
        armOffset = armOffset * (1 / distance);

        var squaredArmOffset = Math.pow(armOffset, 2);
        if (armOffset < 0)
            squaredArmOffset = squaredArmOffset * -1;
        armOffset = squaredArmOffset;

        var rotation = distance * rotationFactor;

        angle = angle / armSeparationDistance * armSeparationDistance + armOffset + rotation;

        // Convert polar coordinates to 2D cartesian coordinates.
        var starX = Math.cos(angle) * distance;
        var starY = Math.sin(angle) * distance;

        var randomOffsetX = Math.random() * randomOffsetXY;
        var randomOffsetY = Math.random() * randomOffsetXY;

        starX += randomOffsetX;
        starY += randomOffsetY;

        // Now we can assign xy coords.
        stars[i] = {
            x: null,
            y: null,
            z: null,
            w: 24
        };

        stars[i].x = starX * xSize;

        if (filterType == 4) {
            stars[i].y = (Math.random() * 3) - ((Math.random() * 3));
        }
        else {
            stars[i].y = Math.random() * 2;
        }

        stars[i].z = starY * zSize;
    }

    return stars;
}

function newStarsOutsideGalaxys(starsCount) {
    stars = [];
    for (var i = 0; i < (starsCount * 0.2); i++) {
        var newStar;

        newStar = {
            x: 0,
            y: 0,
            z: 0
        }

        while (getDistanceBetweenTwoVectors(newStar, { x: 0, y: 0, z: 0 }) < 4000) {
            newStar = {
                x: Math.random() * 5000 - Math.random() * 5000,
                y: Math.random() * 5000 - Math.random() * 5000,
                z: Math.random() * 5000 - Math.random() * 5000
            }
        }

        stars[i] = newStar;
    }

    for (var i = 0; i < (starsCount * 0.08); i++) {
        var newStar;

        newStar = {
            x: 0,
            y: 0,
            z: 0
        }

        newStar = {
            x: Math.random() * 1000 - Math.random() * 1000,
            y: Math.random() * 1000 - Math.random() * 1000,
            z: Math.random() * 1000 - Math.random() * 1000
        }

        stars[i] = newStar;

    }

    for (var i = 0; i < (starsCount * 0.14); i++) {
        var newStar;

        newStar = {
            x: 0,
            y: 0,
            z: 0
        }

        newStar = {
            x: Math.random() * 3000 - Math.random() * 3000,
            y: Math.random() * 3000 - Math.random() * 3000,
            z: Math.random() * 3000 - Math.random() * 3000
        }

        stars[i] = newStar;

    }

    for (var i = 0; i < (starsCount * 0.01); i++) {
        var newStar;

        newStar = {
            x: 0,
            y: 0,
            z: 0
        }

        newStar = {
            x: Math.random() * 200 - Math.random() * 200,
            y: Math.random() * 200 - Math.random() * 200,
            z: Math.random() * 200 - Math.random() * 200
        }

        stars[i] = newStar;

    }

    return stars;

}

function onMouseMove(event) {
    if (objectHovered !== false) {
        objectHovered = false;
        document.body.style.cursor = 'grab';
    }

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    intersects.forEach(function (object) {
        if (object.object.type == "Sprite") {
            objectHovered = object.object;
            document.body.style.cursor = 'pointer';
        }
    });

    if (selectedPlanet >= 0) {
        if (objectHovered !== false) {
            document.body.style.cursor = 'default';
            if (objectHovered['name'] !== "planetPreview") {
                document.body.style.cursor = "pointer";
            }
        }
    }

}

function onMouseClick(event) {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    return;
    
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    intersects.forEach(function (object) {
        if (currentObjectIsFounded == true) {
            return;
        }

        if (object.object.type == "Sprite") {
            if (object.object.name == 'planetPreview') {
                planets.forEach(function (planet, planetIndex) {
                    if (planet.position.x == object.object.position.x && planet.position.y == object.object.position.y && planet.position.z == object.object.position.z) {
                        selectedPlanet = planetIndex;
                        planet.physicalPlanet.forEach(function (layer) {
                            layer.children[0].material.visible = true;
                        });
                    }

                    scene.remove(planet.previewObject);
                });

                rickmobilesPull.forEach(function (rickmobile) {
                    rickmobile.model.children[0].material.visible = false;
                    rickmobile.model.children[1].material.visible = false;
                });

                controls.minDistance = 0;
                controls.enableDamping = false;

                lastFreeCameraPosition = {
                    x: camera.position.x,
                    y: camera.position.y,
                    z: camera.position.z
                };

                setTimeout(moveCameraTo, Math.random(), camera, camera.position.x, camera.position.y, camera.position.z, object.object.position.x, object.object.position.y, object.object.position.z - 5, 150, 0, true);

                controls.target = object.object.position;
                controls.enabled = false;

                camera.add(backButton);
                camera.add(playButton);

            }

            if (object.object.name == 'backButton') {

                var isTaskTableExist = camera.children.includes(taskTable);
                var isYouWonWindowExist = camera.children.includes(youWonWindow);
                var isWrongWindowExist = camera.children.includes(wrongWindow);
                var isComingSoonWindowExist = camera.children.includes(comingSoonWindow);

                camera.remove(youWonWindow);
                camera.remove(getAGiftButton);
                camera.remove(wrongWindow);
                camera.remove(comingSoonWindow);

                if (isYouWonWindowExist || isWrongWindowExist || isComingSoonWindowExist) {
                    return;
                }

                camera.remove(taskTable);
                camera.remove(readyButton);

                taskTableSlots.forEach(function (slot) {
                    camera.remove(slot.object);
                });

                taskTableImages.forEach(function (image) {
                    camera.remove(image.object);
                });

                if (isTaskTableExist) {
                    return;
                }

                camera.remove(backButton);
                camera.remove(playButton);
                camera.remove(comingSoonWindow);

                controls.enabled = true;
                controls.target = new THREE.Vector3(0, 0, 0);

                selectedPlanet = -1;

                controls.minDistance = minCameraDistance;
                controls.enableDamping = true;

                setTimeout(moveCameraTo, Math.random(), camera, camera.position.x, camera.position.y, camera.position.z, lastFreeCameraPosition.x, lastFreeCameraPosition.y, lastFreeCameraPosition.z, 150, 0, false);

                planets.forEach(function (planet) {
                    scene.add(planet.previewObject);
                    planet.physicalPlanet.forEach(function (layer) {
                        layer.children[0].material.visible = false;
                    });
                });

                rickmobilesPull.forEach(function (rickmobile) {
                    rickmobile.model.children[0].material.visible = true;
                    rickmobile.model.children[1].material.visible = true;
                });

            }

            if (object.object.name == 'playButton') {

                let planet = planets[selectedPlanet];

                if (planet.name == "skwoth") {
                    camera.add(taskTable);
                    camera.add(readyButton);

                    taskTableSlots.forEach(function (slot) {
                        slot.inUseBy = null;
                        camera.add(slot.object);
                    });

                    taskTableImages.forEach(function (image) {
                        image.currentSlot = null;
                        image.object.position.set(image.spawnPosition.x, image.spawnPosition.y, -2.9);
                        camera.add(image.object);
                    });

                }
                else {
                    camera.add(comingSoonWindow);
                }

            }

            if (object.object.name == 'comingSoonWindow') {
                camera.remove(comingSoonWindow);
            }

            if (object.object.name == 'readyButton') {
                var isAllRight = true;

                taskTableSlots.slice(0, 4).forEach(function (slot, slotID) {
                    if (slot.inUseBy == null) {
                        isAllRight = false;
                    }
                    else {
                        let downSlot = taskTableSlots[slotID + 4];
                        if (taskTableImages[slot.inUseBy].agreeWith !== downSlot.inUseBy) {
                            isAllRight = false;
                        }
                    }
                });

                if (isAllRight == true) {
                    camera.add(youWonWindow);
                    camera.add(getAGiftButton);
                }
                else {
                    camera.add(wrongWindow);
                }

            }

            if (object.object.name == 'tableImage') {
                if (selectedImage == null) {
                    taskTableSlots.forEach(function (slot) {
                        if (slot.inUseBy == null) {
                            slot.object.material.color.set("green");
                        }
                        else {
                            slot.object.material.color.set("yellow");
                        }
                    });

                    selectedImage = object.object;
                    currentObjectIsFounded = true;
                    return;
                }

                if (selectedImage !== object.object) {
                    let currentImagePosition = new THREE.Vector3(object.object.position.x, object.object.position.y, object.object.position.z);
                    object.object.position.set(selectedImage.position.x, selectedImage.position.y, selectedImage.position.z);
                    selectedImage.position.set(currentImagePosition.x, currentImagePosition.y, currentImagePosition.z);

                    let currentImageSlot = taskTableImages[object.object.imageID].currentSlot;
                    let selectedImageSlot = taskTableImages[selectedImage.imageID].currentSlot;

                    if (currentImageSlot !== null) {
                        selectedImage.currentSlot = currentImageSlot;
                        currentImageSlot.inUseBy = selectedImage.imageID;
                    }

                    if (selectedImageSlot !== null) {
                        object.object.currentSlot = selectedImageSlot;
                        selectedImageSlot.inUseBy = object.object.imageID;
                    }

                }

                taskTableSlots.forEach(function (slot) {
                    slot.object.material.color.set("white");
                });

                selectedImage = null;
                throw new Error();
            }

            if (object.object.name == 'tableSlot') {
                if (selectedImage == null) {
                    return;
                }

                let currentSlot = taskTableSlots[object.object.slotID];
                var PreviousImageSlot = null;
                taskTableSlots.forEach(function (slot, slotID) {
                    if (slot.inUseBy == selectedImage.imageID) {
                        PreviousImageSlot = slotID;
                    }
                });


                if (currentSlot.inUseBy !== null) {
                    if (PreviousImageSlot == null) {
                        taskTableImages[currentSlot.inUseBy].currentSlot = null;
                    }
                    else {
                        taskTableImages[currentSlot.inUseBy].currentSlot = taskTableSlots[PreviousImageSlot];
                        taskTableSlots[PreviousImageSlot].inUseBy = currentSlot.inUseBy;
                        taskTableSlots[PreviousImageSlot].inUseBy == currentSlot.inUseBy;
                    }
                    taskTableImages[currentSlot.inUseBy].object.position.set(selectedImage.position.x, selectedImage.position.y, selectedImage.position.z);
                }
                else {
                    if (PreviousImageSlot !== null) {
                        taskTableSlots[PreviousImageSlot].inUseBy = null;
                    }
                }

                taskTableImages[selectedImage.imageID].currentSlot = currentSlot;
                selectedImage.position.set(currentSlot.center.x, currentSlot.center.y, -2.9);
                currentSlot.inUseBy = selectedImage.imageID;

                taskTableSlots.forEach(function (slot) {
                    slot.object.material.color.set("white");
                });

                selectedImage = null;

                throw new Error();
            }

            if (object.object.name == 'wrongWindow') {
                camera.remove(wrongWindow);
                currentObjectIsFounded = true;
            }

            if (object.object.name == 'giftButton') {
                window.location.href = giftURL;
                currentObjectIsFounded = true;
            }

        }

    });

    currentObjectIsFounded = false;
}

function onKeyPress(event) {

    if (event.key == "Escape") {
        if (selectedPlanet < 0) {
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

        controls.enabled = true;
        controls.target = new THREE.Vector3(0, 0, 0);

        selectedPlanet = -1;

        controls.minDistance = minCameraDistance;
        controls.enableDamping = true;
        camera.position.set(-90, 120, 180);

        planets.forEach(function (planet) {
            scene.add(planet.previewObject);
            planet.physicalPlanet.forEach(function (layer) {
                layer.children[0].material.visible = false;
            });
        });

        rickmobilesPull.forEach(function (rickmobile) {
            rickmobile.model.children[0].material.visible = true;
            rickmobile.model.children[1].material.visible = true;
        });

    }

    if (event.key == "1") {
        if (scene.children.includes(firstgalaxy)) {
            scene.remove(firstgalaxy);
        }
        else {
            scene.add(firstgalaxy);
        }
    }

    if (event.key == "2") {
        if (scene.children.includes(secondgalaxy)) {
            scene.remove(secondgalaxy);
        }
        else {
            scene.add(secondgalaxy);
        }
    }

    if (event.key == "3") {
        if (scene.children.includes(thirdgalaxy)) {
            scene.remove(thirdgalaxy);
        }
        else {
            scene.add(thirdgalaxy);
        }
    }

    if (event.key == "4") {
        if (scene.children.includes(fouthgalaxy)) {
            scene.remove(fouthgalaxy);
        }
        else {
            scene.add(fouthgalaxy);
        }
        if (scene.children.includes(clouds)) {
            scene.remove(clouds);
        }
        else {
            scene.add(clouds);
        }
    }

    if (event.key == "5") {
        if (scene.children.includes(fifthgalaxy)) {
            scene.remove(fifthgalaxy);
        }
        else {
            scene.add(fifthgalaxy);
        }
    }

    if (event.key == "6") {
        if (scene.children.includes(warpStars)) {
            scene.remove(warpStars);
        }
        else {
            scene.add(warpStars);
        }
    }

}

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    let spDelta = controls['sphericalDelta'] || {};
    fifthgalaxy.material.uniforms.cameraMovmentPower.value = [spDelta.theta, spDelta.phi];

    var polarAngle = controls.getPolarAngle();
    var cameraRotationFactor = Math.abs(polarAngle - Math.PI / 2);

    if (cameraRotationFactor >= 0.75) {
        cameraRotationPower = verticalCameraMagnitude;
    }
    else {
        cameraRotationPower = 1.0 + ((verticalCameraMagnitude - 1.0) * (cameraRotationFactor / 0.75));
    }

    [firstgalaxy, secondgalaxy, thirdgalaxy, fouthgalaxy].forEach(function (galaxy) {
        galaxy.material.uniforms.cameraRotationPower.value = cameraRotationPower;
    });

    planets.forEach(function (planet) {
        planet.physicalPlanet.forEach(function (layer, layerIndex) {
            layer.rotation.x += planet.layersPerFrameTransformation[layerIndex].rotation.x;
            layer.rotation.y += planet.layersPerFrameTransformation[layerIndex].rotation.y;
            layer.rotation.z += planet.layersPerFrameTransformation[layerIndex].rotation.z;

            layer.scale.x += planet.layersPerFrameTransformation[layerIndex].scale.x;
            layer.scale.y += planet.layersPerFrameTransformation[layerIndex].scale.y;
            layer.scale.z += planet.layersPerFrameTransformation[layerIndex].scale.z;
        });
    });

    smallGalaxys.forEach(function (galaxy, galaxyIndex) {
        let g = smallGalaxysObjectsArray[galaxyIndex];
        // console.log(smallGalaxysObjectsArray);
        // console.log(g);
        if (g) g.rotateY(THREE.MathUtils.degToRad(galaxy.rotationPower));
    });

    if (galaxyPlane) {
        if (polarAngle < Math.PI / 2) {
            galaxyPlane.material.opacity = 1 - (polarAngle / (Math.PI / 2));
        } else {
            galaxyPlane.material.opacity = 1 - (Math.abs(polarAngle - Math.PI) / (Math.PI / 2));
        }
    }
    renderer.autoClear = false;
    renderer.render(scene, camera);
    // renderer.render(sceneForSmallGalaxys, camera);
}

// window.addEventListener('load', () => {
//     initScene();
// }, false);