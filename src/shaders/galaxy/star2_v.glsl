attribute vec4 clr;
attribute float size;

uniform float pointMultiplier;
uniform vec3 camPos;
uniform float sizeFactor;
uniform bool isCamDistLogic;
uniform float scale;

varying vec4 vColor;
varying float alphaDistFactor;

void main() {

    vColor = clr;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // cam pos transform
    vec4 localCamPos = modelViewMatrix * vec4(camPos, 1.0);
    localCamPos = projectionMatrix * localCamPos;

    // gl_PointSize = .2 * size * pointMultiplier / gl_Position.w;

    // vec4 camPos4 = vec4(camPos, 1.);
    float camDist = distance(localCamPos, gl_Position);
    // float camDist = distance(camPos, position);

    float valMin = .2;
    float valMax = 1. - valMin;
    float sizeDelta = valMax - valMin;
    float distMin = 50.;
    float distMax = 250.;
    float distDelta = distMax - distMin;
    // alphaDistFactor = 1. - clamp((camDist - distMin) / (distMax - distMin), 0., valMax);
    float alphaFactor = (clamp(camDist, distMin, distMax) - distMin) / distDelta;
    alphaDistFactor = valMin + sizeDelta * (1. - alphaFactor);

    // float sizeFactor = clamp(distFactor, .6, 1.);

    valMin = .8;
    valMax = 1.;
    sizeDelta = valMax - valMin;
    distMin = 200.;
    distMax = 10000.;
    distDelta = distMax - distMin;
    float cdFactor = (clamp(camDist, distMin, distMax) - distMin) / distDelta;
    float sizeFactor = valMin + sizeDelta * (1. - cdFactor);

    // gl_PointSize = size * 30. * distFactor;
    gl_PointSize = size * 30. * sizeFactor;
    // gl_PointSize = size * 30. * sizeFactor * 10.;
    // gl_PointSize = size * 30.;
}