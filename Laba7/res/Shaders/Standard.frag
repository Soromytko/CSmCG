precision mediump float;

varying vec3 v_VertexPosition;
varying vec3 v_VertexNormal;
varying vec2 v_uvTexture;

uniform vec3 u_Color;
uniform float u_AmbientIntensity;
uniform float u_DiffuseIntensity;
uniform float u_SpecularIntensity;

// Texture
uniform sampler2D u_MainTexture;
uniform float u_MixingTextures;

uniform vec3 u_LightPosition;
//uniform vec3 u_LightPositions[5];
uniform float u_LightSize;
uniform vec3 u_CameraPosition;

vec4 getLightFragColor(vec3 lightPosition, vec3 lightColor) {
    // Ambient Color
    vec3 ambientColor = lightColor * u_AmbientIntensity;

    // Diffuse Color
    vec3 directionToLight = lightPosition - v_VertexPosition;
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
    vec3 lightDirection = v_VertexPosition - lightPosition;
    lightDirection = normalize(lightDirection);
    vec3 reflectedLightDirection = reflect(lightDirection, normal);
    float specular = max(0.0, dot(directionToCamera, reflectedLightDirection));
    specular = pow(specular, 128.0);
    vec3 specularColor = lightColor * (specular * u_SpecularIntensity);

    return vec4(ambientColor + diffuseColor + specularColor, 1.0);
}

vec4 getTextureFragColor(sampler2D texture, vec2 uv) {
    vec2 flipUV = vec2(uv.x, 1.0 - uv.y);
    return texture2D(texture, flipUV);
}

void main()
{
    vec4 baseFragColor = vec4(u_Color.xyz, 1.0);
    vec4 lightFragColor = getLightFragColor(u_LightPosition, vec3(1.0, 1.0, 1.0));
    vec4 textureFragColor = getTextureFragColor(u_MainTexture, v_uvTexture);
    
    gl_FragColor = baseFragColor * lightFragColor * textureFragColor; 
}

