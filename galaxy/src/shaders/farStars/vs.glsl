uniform float radiusMin;
uniform float radiusMax;
uniform float scaleMin;
uniform float scaleMax;

varying vec3 vPosition;

void main() {

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	gl_Position = mvPosition * projectionMatrix;
    vPosition = position;

    float _radiusMin = 2.;
    float _radiusMax = 500.;
    float _scaleMin = 1.;
    float _scaleMax = 10.;
    _radiusMin = radiusMin;
    _radiusMax = radiusMax;
    _scaleMin = scaleMin;
    _scaleMax = scaleMax;

    // float dist = distance(position, vec3(0.5, 0.5, 0.5));
    float dist = distance(position, vec3(0., 0., 0.));

    float distFactor = (dist - _radiusMin) / (_radiusMax - _radiusMin);
    if (distFactor < 0.) distFactor = 0.;
    if (distFactor > 1.) distFactor = 1.;
    gl_PointSize = _scaleMin + distFactor * (_scaleMax - _scaleMin);

}