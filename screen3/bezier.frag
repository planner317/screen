#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
uniform float zoom;
uniform float rings;
uniform bool colorMode;
uniform float px[12];
uniform float py[12];
const float P2 = 6.283185;
const float P2_1dev3 = P2 / 3.0; // 1/3 от 2пи
const float P2_2dev3 = P2 / 3.0 * 2.0; // 2/3 от 2пи


float bezier10(float t, float p1, float p2, float p3, float p4) {
    t = t * 4.0 - float(int(t * 4.0));

    float iT = 1.0 - t;
    float iT3 = iT * iT * iT;
    float iT2 = iT * iT;
    float t2 = t * t;
    float t3 = t * t * t;
    return iT3 * p1 + 3.0 * iT2 * t * p2 + 3.0 * iT * t2 * p3 + t3 * p4;
}

void main()
{
    vec2 pos = (gl_FragCoord.xy / zoom);
    pos.x = pos.x - float(int(pos.x));
    pos.y = pos.y - float(int(pos.y));
    float x = 0.0;
    int i = int(pos.x*4.0);
    if (i == 0) x = bezier10(pos.x, px[0],  px[1],  px[2],  px[3]);
    if (i == 1) x = bezier10(pos.x, px[3],  px[4],  px[5],  px[6]);
    if (i == 2) x = bezier10(pos.x, px[6],  px[7],  px[8],  px[9]);
    if (i == 3) x = bezier10(pos.x, px[9],  px[10], px[11], px[0]);


    float y;
    i = int(pos.y*4.0);
    if (i == 0) y = bezier10(pos.y, py[0],  py[1],  py[2],  py[3]);
    if (i == 1) y = bezier10(pos.y, py[3],  py[4],  py[5],  py[6]);
    if (i == 2) y = bezier10(pos.y, py[6],  py[7],  py[8],  py[9]);
    if (i == 3) y = bezier10(pos.y, py[9],  py[10], py[11], py[0]);


    float c = (sin((x + y) * rings+time  )+1.0)/2.0;
    if (colorMode){
        float r = c    ;
        float g = c+0.5 - float(int(c+0.5));
        float b = c+0.5 - float(int(c+0.5));
        gl_FragColor = vec4(r,g,b,1.0);
    }
    else gl_FragColor = vec4(c,c,c,1.0);
}
