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