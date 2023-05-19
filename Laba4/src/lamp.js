var lampVertexShaderSourceCode = `
precision mediump float;

attribute vec3 a_VertexPosition;

uniform mat4 u_ProjectMat;
uniform mat4 u_ViewMat;
uniform mat4 u_WorldMat;

void main()
{
   gl_Position = u_ProjectMat * u_ViewMat * u_WorldMat * vec4(a_VertexPosition, 1.0);
}
`

var lampFragmentShaderSourceCode = `
precision mediump float;

uniform vec3 u_Color;

void main()
{
    gl_FragColor = vec4(u_Color, 1.0);
}
`