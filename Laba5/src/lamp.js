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


var vs1 = `
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

var fs1 = `
precision mediump float;

uniform vec3 u_Color;

void main()
{
    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
}
`

class LampMaterial extends Material{
    constructor() {
        super()

        if (this._instance) {
            return this._instance
        }

        this._vertexShaderSourceCode = lampVertexShaderSourceCode
        this._fragmentShaderSourceCode = lampFragmentShaderSourceCode

        this._uniforms = {
            PROJECT_MATRIX_UNIFORM: PROJECT_MAT,
            VIEW_MATRIX_UNIFORM: VIEW_MAT,
            WORLD_MATRIX_UNIFORM: undefined,
            COLOR_UNIFORM: undefined,
        }

        this._instance = this
    }

    _init() {
        const shaderProgram = this._shaderProgram
        // Uniforms
        this._uProjectMatLoc = gl.getUniformLocation(shaderProgram, 'u_ProjectMat')
        this._uViewMatLoc = gl.getUniformLocation(shaderProgram, 'u_ViewMat')
        this._uWorldMatLoc = gl.getUniformLocation(shaderProgram, 'u_WorldMat')
        this._uColorLoc = gl.getUniformLocation(shaderProgram, "u_Color")

        // Attributes
        this._aVertexPositionLoc = gl.getAttribLocation(shaderProgram, 'a_VertexPosition')
        this._aVertexNormalLoc = gl.getAttribLocation(shaderProgram, 'a_VertexNormal')

        // gl.enableVertexAttribArray(this._aVertexPositionLoc)
    }
}