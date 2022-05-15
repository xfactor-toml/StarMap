uniform float z;
        
varying vec3 vPosition;
varying vec3 mPosition;
varying float gas;
varying float customStarColor;
    
void main() {

    float a=distance(mPosition,vPosition);
    if(a>0.)a=1.;
    
    float b=max(0.3,.0105*length(vPosition));

    float c=distance(gl_PointCoord,vec2(.5));
    float starlook=-(c-.5)*1.2; 
    float gaslook=(1.)/(c*50.);
    float texture=(starlook * 5.0)+(gaslook * 1.7);
    
    if(customStarColor == 0.0){
    gl_FragColor=vec4(0.505, 0.39, b, 1.)*texture*(0.13-a*.35);
    }
    else if(customStarColor <= 2.0){
    gl_FragColor=vec4(0.258, 0.282, 0.145, 1.)*texture*(0.13-a*.35);
    }
    else if(customStarColor <= 4.0){
    gl_FragColor=vec4(0.694, 0.301, 0.282, 1.)*texture*(0.13-a*.35);
    }
    else if(customStarColor <= 6.0){
    gl_FragColor=vec4(0.745, 0.635, 0.360, 1.)*texture*(0.13-a*.35);
    }
    else if(customStarColor <= 8.0){
    gl_FragColor=vec4(0.431, 0.831, 0.819, 1.)*texture*(0.13-a*.35);
    }
    else if(customStarColor <= 10.0){
    gl_FragColor=vec4(1.0, 0.901, 0.890, 1.)*texture*(0.13-a*.35);
    }

    if(z>0.)gl_FragColor*=cos(1.57*z/322.)*(1.-.001*length(mPosition));
}