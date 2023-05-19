var vertLambertSource = `
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

var fragSource = `
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