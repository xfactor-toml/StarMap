uniform sampler2D diffuseTexture;

varying vec4 vColor;

void main() {
    gl_FragColor = texture2D(diffuseTexture, gl_PointCoord) * vColor;
}