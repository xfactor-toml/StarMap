import * as THREE from "three";

export type StarParams = {
    camera: THREE.PerspectiveCamera;
    starSize: number;
};

export class Star extends THREE.Group {
    private params: StarParams;
    private light: THREE.PointLight;
    // private mesh: THREE.Mesh;
    private uniforms: any;

    constructor(aParams: StarParams) {

        super();

        this.params = aParams;

        // if (this.params.isShine == true) {
        //     this.light = new THREE.PointLight(this.data.color, this.data.shineIntensive, this.data.shineDistance);
        //     this.add(this.light);
        // }

        let spriteMaterial = new THREE.SpriteMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        // let sun_clr_1 = new THREE.Color(aStarData.sunClr1);
        // let sun_clr_2 = new THREE.Color(aStarData.sunClr2);
        // let sun_clr_3 = new THREE.Color(aStarData.sunClr3);
        // let sun_clr_4 = new THREE.Color(aStarData.sunClr4);
        // let sun_clr_5 = new THREE.Color(aStarData.sunClr5);
        // let sun_corona_clr_1 = new THREE.Color(aStarData.sunCoronaClr1);
        // let sun_corona_clr_2 = new THREE.Color(aStarData.sunCoronaClr2);

        // test
        let sun_clr_1 = new THREE.Color(1.0, 1.0, .0);
        let sun_clr_2 = new THREE.Color(1.0, .0, .0);
        let sun_clr_3 = new THREE.Color(1.0, .0, 1.0);
        let sun_clr_4 = new THREE.Color(1.0, 1.0, 1.0);
        let sun_clr_5 = new THREE.Color(1., 0.894, 0.);
        let sun_corona_clr_1 = new THREE.Color(1.0, .95, 1.0);
        let sun_corona_clr_2 = new THREE.Color(1.0, 0.6, 0.1);

        this.uniforms = {
            iTime: { value: 0 },
            mx: { value: 0 },
            my: { value: 0 },
            sun_clr_1: { value: { x: sun_clr_1.r, y: sun_clr_1.g, z: sun_clr_1.b } },
            sun_clr_2: { value: { x: sun_clr_2.r, y: sun_clr_2.g, z: sun_clr_2.b } },
            sun_clr_3: { value: { x: sun_clr_3.r, y: sun_clr_3.g, z: sun_clr_3.b } },
            sun_clr_4: { value: { x: sun_clr_4.r, y: sun_clr_4.g, z: sun_clr_4.b } },
            sun_clr_5: { value: { x: sun_clr_5.r, y: sun_clr_5.g, z: sun_clr_5.b } },
            sun_corona_clr_1: { value: { x: sun_corona_clr_1.r, y: sun_corona_clr_1.g, z: sun_corona_clr_1.b } },
            sun_corona_clr_2: { value: { x: sun_corona_clr_2.r, y: sun_corona_clr_2.g, z: sun_corona_clr_2.b } },
            corona_size: { value: 1 } //aParams.coronaSize }
        };

        this.variant_2(spriteMaterial, this.uniforms);

        let sprite = new THREE.Sprite(spriteMaterial);
        let size = this.params.starSize || 1;
        sprite.scale.set(size, size, 1);
        this.add(sprite);
    }

    private vertexShaderAddUvVarying(shader) {
        shader.vertexShader = shader.vertexShader.split('void main()')
            .join(`
                varying vec2 vUv;
                void main()
            `)
            .split('gl_Position = projectionMatrix * mvPosition;')
            .join(`
                vUv = uv;
                gl_Position = projectionMatrix * mvPosition;
            `);
    }

    private fragmentBeforeMain(shader, code) {
        shader.fragmentShader = shader.fragmentShader
            .split('void main()').join(`${code}void main()`)
    }

    private fragmentMain(shader, code) {
        shader.fragmentShader = shader.fragmentShader
            .split('gl_FragColor = vec4( outgoingLight, diffuseColor.a )').join(code)
    }

    private variant_2(spriteMaterial: THREE.SpriteMaterial, uf: any) {
        let _this = this;

        spriteMaterial.onBeforeCompile = (shader) => {

            shader.uniforms.iTime = uf.iTime;
            shader.uniforms.mx = uf.mx;
            shader.uniforms.my = uf.my;
            shader.uniforms.sun_clr_1 = uf.sun_clr_1;
            shader.uniforms.sun_clr_2 = uf.sun_clr_2;
            shader.uniforms.sun_clr_3 = uf.sun_clr_3;
            shader.uniforms.sun_clr_4 = uf.sun_clr_4;
            shader.uniforms.sun_clr_5 = uf.sun_clr_5;
            shader.uniforms.sun_corona_clr_1 = uf.sun_corona_clr_1;
            shader.uniforms.sun_corona_clr_2 = uf.sun_corona_clr_2;
            shader.uniforms.corona_size = uf.corona_size;

            _this.vertexShaderAddUvVarying(shader);

            _this.fragmentBeforeMain(shader, `
                varying vec2 vUv;
                
                uniform float iTime;
                // uniform vec3 uPos;
                uniform float my;
                uniform float mx;

                uniform vec3 sun_clr_1;
                uniform vec3 sun_clr_2;
                uniform vec3 sun_clr_3;
                uniform vec3 sun_clr_4;
                uniform vec3 sun_clr_5;
                uniform vec3 sun_corona_clr_1;
                uniform vec3 sun_corona_clr_2;
                uniform float corona_size;

                vec4 NC0=vec4(0.0,157.0,113.0,270.0);
                vec4 NC1=vec4(1.0,158.0,114.0,271.0);
                vec4 WS=vec4(0.25,0.25,0.25,0.25);
                
                vec4 hash4( vec4 n ) { return fract(sin(n)*1399763.5453123); }
                
                vec3 hash3( vec3 n ) { return fract(sin(n)*1399763.5453123); }
                
                vec3 hpos( vec3 n ) { return hash3(vec3(
                    dot(n,vec3(157.0,113.0,271.0)),
                    dot(n,vec3(271.0,157.0,113.0)),
                    dot(n,vec3(113.0,271.0,157.0))
                )); }
                
                float noise4q(vec4 x){
                vec4 n3 = vec4(0,0.25,0.5,0.75);
                vec4 p2 = floor(x.wwww+n3);
                vec4 b = floor(x.xxxx+n3) + floor(x.yyyy+n3)*157.0 + floor(x.zzzz +n3)*113.0;
                vec4 p1 = b + fract(p2*0.00390625)*vec4(164352.0, -164352.0, 163840.0, -163840.0);
                p2 = b + fract((p2+1.0)*0.00390625)*vec4(164352.0, -164352.0, 163840.0, -163840.0);
                vec4 f1 = fract(x.xxxx+n3);
                vec4 f2 = fract(x.yyyy+n3);
                f1=f1*f1*(3.0-2.0*f1);
                f2=f2*f2*(3.0-2.0*f2);
                vec4 n1 = vec4(0,1.0,157.0,158.0);
                vec4 n2 = vec4(113.0,114.0,270.0,271.0);  
                vec4 vs1 = mix(hash4(p1), hash4(n1.yyyy+p1), f1);
                vec4 vs2 = mix(hash4(n1.zzzz+p1), hash4(n1.wwww+p1), f1);
                vec4 vs3 = mix(hash4(p2), hash4(n1.yyyy+p2), f1);
                vec4 vs4 = mix(hash4(n1.zzzz+p2), hash4(n1.wwww+p2), f1);  
                vs1 = mix(vs1, vs2, f2);
                vs3 = mix(vs3, vs4, f2);
                vs2 = mix(hash4(n2.xxxx+p1), hash4(n2.yyyy+p1), f1);
                vs4 = mix(hash4(n2.zzzz+p1), hash4(n2.wwww+p1), f1);
                vs2 = mix(vs2, vs4, f2);
                vs4 = mix(hash4(n2.xxxx+p2), hash4(n2.yyyy+p2), f1);
                vec4 vs5 = mix(hash4(n2.zzzz+p2), hash4(n2.wwww+p2), f1);
                vs4 = mix(vs4, vs5, f2);
                f1 = fract(x.zzzz+n3);
                f2 = fract(x.wwww+n3);
                f1=f1*f1*(3.0-2.0*f1);
                f2=f2*f2*(3.0-2.0*f2);
                vs1 = mix(vs1, vs2, f1);
                vs3 = mix(vs3, vs4, f1);
                vs1 = mix(vs1, vs3, f2);
                float r=dot(vs1,vec4(0.25));
                return r*r*(3.0-2.0*r);
                }
                
                float noiseSphere(vec3 ray,vec3 pos,float r,mat3 mr,float zoom,vec3 subnoise,float anim){
                    float b = dot(ray,pos);
                    float c = dot(pos,pos) - b*b;
                    vec3 r1=vec3(0.0);
                    float s=0.0;
                    float d=0.03125;
                    float d2=zoom/(d*d); 
                    float ar=5.0;
                    for (int i=0;i<3;i++) {
                        float rq=r*r;
                        if(c <rq) {
                            float l1=sqrt(rq-c);
                            r1= ray*(b-l1)-pos;
                            r1=r1*mr;
                            s+=abs(noise4q(vec4(r1*d2+subnoise*ar,anim*ar))*d);
                        }
                        ar-=2.0;
                        d*=4.0;
                        d2*=0.0625;
                        r=r-r*0.02;
                    }
                    return s;
                }
                
                float ring(vec3 ray,vec3 pos,float r,float size) {
                    float b = dot(ray,pos);
                    float c = dot(pos,pos) - b*b;
                    float s = max( 0.0, ( 1.0 - size * abs(r-sqrt(c)) ) );
                    return s;
                }
                
                float ringRayNoise(vec3 ray,vec3 pos,float r,float size,mat3 mr,float anim){
                    float b = dot(ray,pos);
                    vec3 pr=ray*b-pos;
                    float c=length(pr);
                    pr*=mr;
                    pr=normalize(pr);
                    float s=max(0.0,(1.0-size*abs(r-c)));
                    float nd=noise4q(vec4(pr*1.0,-anim+c))*2.0;
                    nd=pow(nd,2.0);
                    float n=0.4;
                    float ns=1.0;
                    if (c>r) {
                        n=noise4q(vec4(pr*10.0,-anim+c));
                        ns=noise4q(vec4(pr*50.0,-anim*2.5+c*2.0))*2.0;
                    }
                    n=n*n*nd*ns;
                    return pow(s,4.0)+s*s*n;
                }

                float sphereZero(vec3 ray,vec3 pos,float r){
                    float b = dot(ray,pos);
                    float c = dot(pos,pos) - b*b;
                    float s=1.0;
                    if (c<r*r) s=0.0;
                    return s;
                }
            `);

            _this.fragmentMain(shader, `
                vec2 p = (vUv-0.5)*3.;
            
                float time = iTime;
                vec2 rotate = vec2(mx, my);
                vec2 sins = sin(rotate);
                vec2 coss = cos(rotate);
                
                mat3 mr=mat3(vec3(coss.x,0.0,sins.x),vec3(0.0,1.0,0.0),vec3(-sins.x,0.0,coss.x));
                mr=mat3(vec3(1.0,0.0,0.0),vec3(0.0,coss.y,sins.y),vec3(0.0,-sins.y,coss.y))*mr;    
            
                vec3 ray = normalize(vec3(p,2.0));
                vec3 pos = vec3(0.0,0.0,3.0);
                
                float s1=noiseSphere(ray,pos,1.0,mr,0.5,vec3(0.0), time);
                s1=pow(min(1.0,s1*2.4),2.0);
                float s2=noiseSphere(ray,pos,1.0,mr,4.0,vec3(83.23, 34.34, 67.453), time);
                s2=min(1.0,s2*2.2);

                // sun color
                vec3 clr1 = sun_clr_1; // vec3(1.0, 1.0, .0); // основной цвет солнца base: 1, 1, 0
                vec3 clr2 = sun_clr_2; // vec3(1.0, .0, .0); // основной цвет перелива base: 1, 0, 0
                vec3 clr3 = sun_clr_3; // vec3(1.0, .0, 1.0); // один цвет переливов base: 1.0, 0.0, 1.0
                vec3 clr4 = sun_clr_4; // vec3(1.0, 1.0, 1.0); // всплывающие пятнышки
                vec3 clr5 = sun_clr_5; // vec3(1.0, 1.0, 1.0); // блики пробегающие по поверхности - base: 1

                gl_FragColor = vec4( mix(clr1, clr5, pow(s1,60.0)) * s1, 1.0 );
                // core release
                gl_FragColor += vec4( mix(mix(clr2, clr3, pow(s2,2.0)), clr4, pow(s2,10.0)) * s2, 1.0 );
                gl_FragColor.xyz -= vec3(ring(ray, pos, 1.03, 11.0)) * 2.0;
                gl_FragColor = max( vec4(0.0), gl_FragColor );
                
                // corona color
                vec3 corona_clr1 = sun_corona_clr_1; // vec3(1.0, .95, 1.0); // нижний цвет короны base: vec3(1.0,0.95,1.0)
                vec3 corona_clr2 = sun_corona_clr_2; // vec3(.0, 1.0, .0); // верхний цвет короны base: vec3(1.0,0.6,0.1)
                // corona
                float corona_radius = 0.96;
                float c_size = 1.0 / corona_size;
                float s3 = ringRayNoise(ray, pos, corona_radius, c_size, mr, time);
                gl_FragColor.xyz += mix(corona_clr2, corona_clr1, pow(s3,3.0)) * s3;
                
                gl_FragColor = clamp( vec4(0.0), vec4(1.0), gl_FragColor );
                
                // hide rectangle
                gl_FragColor.a = max(gl_FragColor.r, max(gl_FragColor.g, gl_FragColor.b)); 
                
            `);
            
        }

    }

    update(dt: number) {
        // this.uf.iTime.value = Params.clock.getElapsedTime();
        this.uniforms.iTime.value += dt;

        let camera = this.params.camera;
        if (camera) {
            let p = camera.position;
            this.uniforms.my.value = Math.atan2(Math.sqrt(p.x * p.x + p.z * p.z), p.y) - Math.PI / 2;
            this.uniforms.mx.value = Math.atan2(p.z, p.x);
        }
    }

}