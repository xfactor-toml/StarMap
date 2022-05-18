uniform vec2 cameraMovmentPower;
uniform float starSize;
uniform float starColor;
uniform float starAlpha;

varying vec3 vPosition;

float line(vec2 uv, vec2 pt1, vec2 pt2, float aPointSize, float tensionPower) {
    float clrFactor = 0.0;
    float r = distance(uv, pt1) / distance(pt1, pt2);
    
    if (r <= tensionPower) {
        vec2 ptc = mix(pt1, pt2, r); 
        float dist = distance(ptc, uv);
        if (dist < aPointSize / 1.) {
            clrFactor = 1.0;
        }
    }

    if (distance(uv, vec2(0.5, 0.5)) < aPointSize) {
        // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        clrFactor = 1.0;
    }

    return clrFactor;
}


void main() {
    float pointSize = starSize * 0.05;
    float tension = 4.9;
    float tensionPower = 3.0;

    float pDist = distance(vPosition, vec3(0., 0., 0.));
    tension = pDist * 0.001;

    // float minDistance = 0.0001;

    // if (abs(cameraMovmentPower.x) > minDistance || abs(cameraMovmentPower.y) > minDistance) {
    float clr = line(
        gl_PointCoord.xy, 
        (cameraMovmentPower.xy * tension) + .5, 
        vec2(0.5, 0.5), 
        // vec2(0., 0.),
        pointSize, 
        tensionPower
        ) * 5.0;
    gl_FragColor = vec4(clr, clr, clr, starAlpha);
    // }
    
    // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);

}