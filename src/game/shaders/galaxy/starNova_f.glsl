// uniform bool isCamDistLogic;
varying vec4 vColor;
varying float alphaDistFactor;

void main() {
    vec2 uv = (gl_FragCoord.xy - .5) * 3.;
    vec3 clr = vec3(0);

    // ceter light
    float d = length(uv);
    float m = .1 / d;
    // black holes
    // m *= smoothstep(.1, .2, d);
    m *= smoothstep(1., .2, d);
    clr += m;

    // rays
    float rayFactor = uv.x * uv.y;
    float factorX = 1. - abs(uv.x) * 2. / 3.;
    float factorY = 1. - abs(uv.y) * 2. / 3.;
    float rays = max(0., factorX * factorY * (1. - abs(rayFactor * 20.)));
    // clr += rays;

    // alpha
    float a = 1.;
    // a = min(vColor.a, (clr.x + clr.y + clr.z) / 3.);
    // a = (clr.x + clr.y + clr.z) / 3.;
    // a *= aFactor;

    // a = vColor.a; // * alphaDistFactor;
    // if (isCamDistLogic) a = vColor.a * alphaDistFactor;

    // gl_FragColor = vec4(vColor.xyz * clr, a);
    gl_FragColor = vec4(clr, a);

    // test
    // gl_FragColor = vColor;

}