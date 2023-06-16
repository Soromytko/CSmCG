precision mediump float;

varying vec3 v_FragColor;

void main()
{
   // Apply
   gl_FragColor = vec4(v_FragColor, 1.0);
}