uniform vec2 cameraMovmentPower;

varying vec3 vPosition;
varying vec3 mPosition;
varying float gas;
varying float customStarColor;

float line(vec2 uv, vec2 pt1, vec2 pt2, float pointSize, float tensionPower) {
    float clrFactor = 0.0;
    float tickness = pointSize;
    float r = distance(uv, pt1) / distance(pt1, pt2);
    
    if (r <= tensionPower) {
        vec2 ptc = mix(pt1, pt2, r); 
        float dist = distance(ptc, uv);
        if (dist < tickness / 2.0) {
            clrFactor = 1.0;
        }
    }
    return clrFactor;
}


void main() {
    float tension = 4.9;
    float pointSize = 0.06;
    float tensionPower = 3.0;

    // if (z > 0.) gl_FragColor *= cos(1.57 * z/322.) * (1. - .001 * length(mPosition));

    if (distance(gl_PointCoord, vec2(0.5, 0.5)) < 0.05) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }

    if (distance(vPosition, vec3(0.5, 0.5, 0.5)) < 10000.) {
        tension = 3.6;
        float pointSize = 0.06;
        // float tensionPower = 1.0;
    }

    if (distance(vPosition, vec3(0.5, 0.5, 0.5)) < 900.) {
        tension = 0.5;
        float pointSize = 0.06;
        // float tensionPower = 1.0;
    }

    if (abs(cameraMovmentPower.x) > 0.02 || abs(cameraMovmentPower.y) > 0.02) {
        float distanceToLine = line(gl_PointCoord.xy, (cameraMovmentPower.xy * tension) + .5, vec2(0.5, 0.5), pointSize, tensionPower) * 5.0;
        gl_FragColor = vec4(distanceToLine, distanceToLine, distanceToLine, distanceToLine);
    }

}