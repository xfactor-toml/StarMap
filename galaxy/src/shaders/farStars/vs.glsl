// uniform float size;
// uniform float distanceSize;
// uniform float t;
// uniform float z;
// uniform float pixelRatio;
// uniform vec4 activeStars[GALAXY_ACTIVE_STARS_COUNT];
// uniform vec4 starsWithCustomColor[GALAXY_STARS_WITH_CUSTOM_COLOR_COUNT];
// uniform float cameraRotationPower;
// uniform float galaxyPower;

varying vec3 vPosition;
varying vec3 mPosition; // modified position
// varying float gas;
// varying float customStarColor;


void main() {

    vPosition = position;
    mPosition = position;
    vec4 mvPosition = modelViewMatrix * vec4(mPosition, 1.);
    gl_Position = mvPosition * projectionMatrix;
    float multiplier = 200000.;

    if (distance(position, vec3(0.5, 0.5, 0.5)) < 100000.) {
        multiplier = 1000.;
    }

    if (distance(position, vec3(0.5, 0.5, 0.5)) < 2000.) {
        multiplier = 100.;
    }

    gl_PointSize = 50. / length(mvPosition.xyz) / multiplier;

    if (gl_PointSize < 15.) {
        gl_PointSize = 15.;
    }

    if (gl_PointSize > 20.) {
        gl_PointSize = 20.;
    }

}