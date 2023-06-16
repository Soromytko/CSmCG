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