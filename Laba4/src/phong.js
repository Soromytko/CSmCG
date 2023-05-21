var vertPhongSource = `
precision mediump float;

attribute vec3 a_VertexPosition;
attribute vec3 a_VertexNormal;

uniform mat4 u_ProjectMat;
uniform mat4 u_ViewMat;
uniform mat4 u_WorldMat;

varying vec3 v_VertexPosition;
varying vec3 v_VertexNormal;

void main()
{
    vec4 vertexGlobalPosition = u_WorldMat * vec4(a_VertexPosition, 1.0);
    v_VertexPosition = vertexGlobalPosition.xyz;
    vec3 rotatedNormal = (u_WorldMat * vec4(a_VertexNormal, 1.0)).xyz - (u_WorldMat * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    v_VertexNormal = rotatedNormal;

    gl_Position = u_ProjectMat * u_ViewMat * u_WorldMat * vec4(a_VertexPosition, 1.0);
}
`

var fragPhongSource = `
precision mediump float;

varying vec3 v_VertexPosition;
varying vec3 v_VertexNormal;

uniform vec3 u_Color;
uniform float u_AmbientIntensity;
uniform float u_DiffuseIntensity;

uniform vec3 u_LightPosition;
uniform float u_LightSize;

void main()
{
   vec3 lightColor = vec3(1.0, 1.0, 1.0);

   // Ambient Color
   vec3 ambientColor = lightColor * u_AmbientIntensity;
   
   // Diffuse Color
   vec3 directionToLight = u_LightPosition - v_VertexPosition;
   float distanceToLight = length(directionToLight);
   directionToLight = normalize(directionToLight);
   vec3 normal = normalize(v_VertexNormal);
   float diffuse = max(0.0, dot(directionToLight, normal));
   diffuse *= max(0.0, (1.0 - distanceToLight / u_LightSize)); // Light attenuation
   vec3 diffuseColor = lightColor * (diffuse * u_DiffuseIntensity);

   // Apply
   gl_FragColor = vec4(u_Color * (ambientColor + diffuseColor), 1.0);
}
`

class PhongMaterial extends Material {
    constructor() {
        super()

        if (this._instance) {
            return this._instance
        }

        this._vertexShaderSourceCode = vertPhongSource
        this._fragmentShaderSourceCode = fragPhongSource

        this._instance = this
    }

    _init() {
        const shaderProgram = this._shaderProgram
        // Uniforms
        this._uProjectMatLoc = gl.getUniformLocation(shaderProgram, 'u_ProjectMat')
        this._uViewMatLoc = gl.getUniformLocation(shaderProgram, 'u_ViewMat')
        this._uWorldMatLoc = gl.getUniformLocation(shaderProgram, 'u_WorldMat')
        this._uColorLoc = gl.getUniformLocation(shaderProgram, "u_Color")
        this._uAmbientIntensityLoc = gl.getUniformLocation(shaderProgram, "u_AmbientIntensity")
        this._uDiffuseIntensityLoc = gl.getUniformLocation(shaderProgram, "u_DiffuseIntensity")
        this._uLightPositionLoc = gl.getUniformLocation(shaderProgram, "u_LightPosition")
        this._uLightDirectionLoc = gl.getUniformLocation(shaderProgram, "u_LightDirection")
        this._uLightSizeLoc = gl.getUniformLocation(shaderProgram, "u_LightSize")

        // Attributes
        this._aVertexPositionLoc = gl.getAttribLocation(shaderProgram, 'a_VertexPosition')
        this._aVertexNormalLoc = gl.getAttribLocation(shaderProgram, 'a_VertexNormal')

        gl.enableVertexAttribArray(this._aVertexPositionLoc)
        gl.enableVertexAttribArray(this._aVertexNormalLoc)
    }
}