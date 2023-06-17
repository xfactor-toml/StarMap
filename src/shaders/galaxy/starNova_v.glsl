// attribute vec4 clr;
// attribute float size;

uniform vec3 camPos;
uniform bool isCamDistLogic;
// uniform vec4 iColor;

varying vec2 vUv;
varying vec3 vNormal;
// varying vec4 vColor;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // vColor = iColor;

}