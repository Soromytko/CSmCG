precision mediump float;

varying vec3 v_VertexPosition;
varying vec3 v_VertexNormal;

uniform vec3 u_Color;
uniform float u_AmbientIntensity;
uniform float u_DiffuseIntensity;
uniform float u_SpecularIntensity;

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
    gl_FragColor = lightFragColor;
}