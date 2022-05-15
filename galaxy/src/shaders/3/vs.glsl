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