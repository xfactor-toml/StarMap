attribute vec4 clr;
attribute float size;
uniform float pointMultiplier;
uniform vec3 camPos;
uniform float sizeFactor;
varying vec4 vColor;

void main() {
    vColor = clr;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // gl_PointSize = .5 * size * pointMultiplier / gl_Position.w;

    // vec4 camPos4 = projectionMatrix * vec4(camPos, 1.);
    // float camDist = distance(camPos4, mvPosition);
    // float sizeFactor = .2 + .8 - clamp((camDist - 100.) / (200. - 100.), 0., .8);
    // a = this.params.alpha.value.min + camFactor * (this.params.alpha.value.max - this.params.alpha.value.min);

    gl_PointSize = size * 30. * sizeFactor;
}