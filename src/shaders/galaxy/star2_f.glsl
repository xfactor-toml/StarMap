uniform float alphaFactor;
uniform bool isCamDistLogic;

varying vec4 vColor;
varying float distFactor;

void main() {
    vec2 uv = gl_PointCoord.xy - .5;
    uv *= 3.;

    float a = 1.;
    vec3 clr = vec3(0);

    float d = length(uv);
    float m = .1 / d;

    // float rays = max(0., 1. - abs(uv.x * uv.y * 10.));
    // clr += rays;

    // black holes
    // m *= smoothstep(.1, .2, d);

    m *= smoothstep(1., .2, d);

    clr += m;

    // float aFactor = max(0., 0.5 - d * d * d);

    // a = min(vColor.a, (clr.x + clr.y + clr.z) / 3.);
    // a *= aFactor;

    a = vColor.a * alphaFactor;
    if (isCamDistLogic) a = vColor.a * alphaFactor * distFactor;

    gl_FragColor = vec4(vColor.xyz * clr, a);

    // test
    // gl_FragColor = vColor;

}