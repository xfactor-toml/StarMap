attribute vec4 clr;
attribute float size;

uniform float pointMultiplier;
uniform vec3 camPos;
uniform float sizeFactor;
uniform bool isCamDistLogic;

varying vec4 vColor;
varying float distFactor;

void main() {
    vColor = clr;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // gl_PointSize = .5 * size * pointMultiplier / gl_Position.w;

    // vec4 camPos4 = vec4(camPos, 1.);
    // float camDist = distance(camPos4, mvPosition);
    float camDist = distance(camPos, position);
    float startSize = .2;
    float sizeDt = 1. - startSize;
    float distMin = 40.;
    float distMax = 200.;
    distFactor = 1. - clamp((camDist - distMin) / (distMax - distMin), 0., sizeDt);
    // a = this.params.alpha.value.min + camFactor * (this.params.alpha.value.max - this.params.alpha.value.min);

    float sizeFactor = clamp(distFactor, .6, 1.);
    // gl_PointSize = size * 30. * distFactor;
    // gl_PointSize = size * 30. * sizeFactor;
    gl_PointSize = size * 30.;
}