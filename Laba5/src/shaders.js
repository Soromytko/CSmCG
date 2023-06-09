
// Simple /////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
const simpleVertSrc = `
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

const simpleFragSrc = `
precision mediump float;

uniform vec3 u_Color;

void main()
{
    gl_FragColor = vec4(u_Color, 1.0);
}
`



// Lambert ////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
const lambertVertSrc = `
precision mediump float;

attribute vec3 a_VertexPosition;
attribute vec3 a_VertexNormal;

uniform mat4 u_ProjectMat;
uniform mat4 u_ViewMat;
uniform mat4 u_WorldMat;

varying vec3 v_VertexPosition;
varying vec3 v_VertexNormal;

void main(void)
{
    vec4 vertexGlobalPosition = u_WorldMat * vec4(a_VertexPosition, 1.0);
    v_VertexPosition = vertexGlobalPosition.xyz;
    vec3 rotatedNormal = (u_WorldMat * vec4(a_VertexNormal, 1.0)).xyz - (u_WorldMat * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    v_VertexNormal = rotatedNormal;

    gl_Position = u_ProjectMat * u_ViewMat * u_WorldMat * vec4(a_VertexPosition, 1.0);
}
`

const lambertFragSrc = `
precision mediump float;

uniform vec3 u_Color;
uniform float u_AmbientIntensity;
uniform float u_DiffuseIntensity;

varying vec3 v_VertexPosition;
varying vec3 v_VertexNormal;

varying float v_Diffuse;

// Lights
uniform vec3 u_LightPosition;
uniform float u_LightSize;

void main()
{
    vec3 lightColor = vec3(1.0, 1.0, 1.0);

    vec3 directionToLight = u_LightPosition - v_VertexPosition;
    float distanceToLight = length(directionToLight);
    directionToLight = normalize(directionToLight);
    vec3 normal = normalize(v_VertexNormal);
    float diffuse = max(0.0, dot(directionToLight, normal));
    diffuse *= max(0.0, (1.0 - distanceToLight / u_LightSize));

    vec3 diffuseColor = lightColor * (diffuse * u_DiffuseIntensity);

    gl_FragColor = vec4(u_Color * (diffuseColor), 1.0);
}
`


// Phong //////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
const phongVertSrc = `
precision mediump float;

attribute vec3 a_VertexPosition;
attribute vec3 a_VertexNormal;
attribute vec2 a_uvTexture;

uniform mat4 u_ProjectMat;
uniform mat4 u_ViewMat;
uniform mat4 u_WorldMat;

varying vec3 v_VertexPosition;
varying vec3 v_VertexNormal;
varying vec2 v_uvTexture;

void main()
{
    vec4 vertexGlobalPosition = u_WorldMat * vec4(a_VertexPosition, 1.0);
    v_VertexPosition = vertexGlobalPosition.xyz;
    vec3 rotatedNormal = (u_WorldMat * vec4(a_VertexNormal, 1.0)).xyz - (u_WorldMat * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    v_VertexNormal = rotatedNormal;
    v_uvTexture = a_uvTexture;

    gl_Position = u_ProjectMat * u_ViewMat * u_WorldMat * vec4(a_VertexPosition, 1.0);
}
`

const phongFragSrc = `
precision mediump float;

varying vec3 v_VertexPosition;
varying vec3 v_VertexNormal;
varying vec2 v_uvTexture;

uniform vec3 u_Color;
uniform float u_AmbientIntensity;
uniform float u_DiffuseIntensity;
uniform float u_SpecularIntensity;
uniform sampler2D u_Sampler2D;

uniform vec3 u_LightPosition;
uniform float u_LightSize;
uniform vec3 u_CameraPosition;

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
    float attenuation = max(0.0, (1.0 - distanceToLight / u_LightSize)); // Light attenuation
    diffuse *= attenuation;
    vec3 diffuseColor = lightColor * (diffuse * u_DiffuseIntensity);

    //Specular
    vec3 directionToCamera = u_CameraPosition - v_VertexPosition;
    directionToCamera = normalize(directionToCamera);
    vec3 lightDirection = v_VertexPosition - u_LightPosition;
    lightDirection = normalize(lightDirection);
    vec3 reflectedLightDirection = reflect(lightDirection, normal);
    float specular = max(0.0, dot(directionToCamera, reflectedLightDirection));
    specular = pow(specular, 128.0);
    vec3 specularColor = lightColor * (specular * u_SpecularIntensity);

    // Apply
    vec4 lightFragColor = vec4(u_Color * (ambientColor + diffuseColor + specularColor), 1.0);
    vec4 textureFragColor = texture2D(u_Sampler2D, v_uvTexture);

    gl_FragColor = lightFragColor * textureFragColor;
}
`

// Guro ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
const guroVertSrc = `
precision mediump float;

attribute vec3 a_VertexPosition;
attribute vec3 a_VertexNormal;

uniform mat4 u_ProjectMat;
uniform mat4 u_ViewMat;
uniform mat4 u_WorldMat;

// varying vec3 v_VertexPosition;
// varying vec3 v_VertexNormal;


uniform vec3 u_Color;
uniform float u_AmbientIntensity;
uniform float u_DiffuseIntensity;
uniform float u_SpecularIntensity;

uniform vec3 u_LightPosition;
uniform float u_LightSize;
uniform vec3 u_CameraPosition;

varying vec3 v_FragColor;

void main()
{
    // ========================= VertexShader ==================================================
    vec4 vertexGlobalPosition = u_WorldMat * vec4(a_VertexPosition, 1.0);
    vec3 v_VertexPosition = vertexGlobalPosition.xyz;
    vec3 rotatedNormal = (u_WorldMat * vec4(a_VertexNormal, 1.0)).xyz - (u_WorldMat * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vec3 v_VertexNormal = rotatedNormal;

    gl_Position = u_ProjectMat * u_ViewMat * u_WorldMat * vec4(a_VertexPosition, 1.0);



    // ========================= Fragment Shader ==================================================
    vec3 lightColor = vec3(1.0, 1.0, 1.0);

    // Ambient Color
    vec3 ambientColor = lightColor * u_AmbientIntensity;

    // Diffuse Color
    vec3 directionToLight = u_LightPosition - v_VertexPosition;
    float distanceToLight = length(directionToLight);
    directionToLight = normalize(directionToLight);
    vec3 normal = normalize(v_VertexNormal);
    float diffuse = max(0.0, dot(directionToLight, normal));
    float attenuation = max(0.0, (1.0 - distanceToLight / u_LightSize)); // Light attenuation
    diffuse *= attenuation;
    vec3 diffuseColor = lightColor * (diffuse * u_DiffuseIntensity);
    //Specular
    vec3 directionToCamera = u_CameraPosition - v_VertexPosition;
    directionToCamera = normalize(directionToCamera);
    vec3 reflectedLightDirection = reflect(-directionToLight, normal);
    float specular = max(0.0, dot(directionToCamera, reflectedLightDirection));
    specular = pow(specular, 128.0);
    specular *= attenuation;
    vec3 specularColor = lightColor * (specular * u_SpecularIntensity);

    v_FragColor = u_Color * (ambientColor + diffuseColor + specularColor);

}
`

const guroFragSrc = `
precision mediump float;

varying vec3 v_FragColor;

void main()
{
   // Apply
   gl_FragColor = vec4(v_FragColor, 1.0);
}
`


// Texture /////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
const textureVertSrc = `
precision mediump float;

attribute vec3 a_VertexPosition;
attribute vec3 a_VertexNormal;
attribute vec2 a_uvTexture;

uniform mat4 u_ProjectMat;
uniform mat4 u_ViewMat;
uniform mat4 u_WorldMat;

varying vec2 v_uvTexture;

void main()
{
    v_uvTexture = a_uvTexture;

   gl_Position = u_ProjectMat * u_ViewMat * u_WorldMat * vec4(a_VertexPosition, 1.0);
}
`

const textureFragSrc = `
precision mediump float;

varying vec2 v_uvTexture;

uniform vec3 u_Color;
uniform sampler2D u_Sampler2D;

void main()
{
    // gl_FragColor = vec4(u_Color, 1.0);
    gl_FragColor = texture2D(u_Sampler2D, v_uvTexture);
}
`



// Lamp ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
const lampVertSrc = `
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

const lampFragSrc = `
precision mediump float;

uniform vec3 u_Color;

void main()
{
    // gl_FragColor = vec4(u_Color, 1.0);
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`


// Test ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
const vertSrc = `
precision mediump float;

attribute vec3 a_VertexPosition;

uniform mat4 u_ProjectMat;
uniform mat4 u_ViewMat;
uniform mat4 u_WorldMat;

void main() {
    // gl_Position = vec4(a_VertexPosition, 1.0);
    gl_Position = u_ProjectMat * u_ViewMat * u_WorldMat * vec4(a_VertexPosition, 1.0);
}

`

const fragSrc = `
precision mediump float;

uniform vec3 u_Color;

void main() {
    gl_FragColor = vec4(u_Color, 1.0);
}

`

const fragSrc2 = `
precision mediump float;

uniform vec3 u_Color;

void main() {
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
}

`

const fragSrc3 = `
precision mediump float;

uniform vec3 u_Color;

void main() {
    gl_FragColor = vec4(u_Color, 1.0);
    //  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}

`

















