precision mediump float;

struct LightInfo {
    vec3 position;
    vec3 direction;
    vec3 color;
    float size;
    int type;
};

#define LIGHT_COUNT 5

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

//uniform vec3 u_LightPosition;
uniform vec3 u_LightPositions[5];
uniform float u_LightSize;
uniform vec3 u_CameraPosition;

uniform LightInfo u_LightInfos[5];

vec4 getAmbientLightFragColor(vec3 color) {
    return vec4(color * u_AmbientIntensity, 1.0);
}

vec4 getPointLightFragColor(LightInfo lightInfo) {
    // Diffuse Color
    vec3 directionToLight = lightInfo.position - v_VertexPosition;
    float distanceToLight = length(directionToLight);
    directionToLight = normalize(directionToLight);
    vec3 normal = normalize(v_VertexNormal);
    float diffuse = max(0.0, dot(directionToLight, normal));
    float attenuation = max(0.0, (1.0 - distanceToLight / lightInfo.size)); // Light attenuation
    diffuse *= attenuation;
    vec3 diffuseColor = lightInfo.color * (diffuse * u_DiffuseIntensity);

    //Specular
    vec3 directionToCamera = u_CameraPosition - v_VertexPosition;
    directionToCamera = normalize(directionToCamera);
    vec3 lightDirection = v_VertexPosition - lightInfo.position;
    lightDirection = normalize(lightDirection);
    vec3 reflectedLightDirection = reflect(lightDirection, normal);
    float specular = max(0.0, dot(directionToCamera, reflectedLightDirection));
    specular = pow(specular, 128.0);
    vec3 specularColor = lightInfo.color * (specular * u_SpecularIntensity);

    return vec4(diffuseColor + specularColor, 1.0);
}

vec4 getSpotLightFragColor(LightInfo lightInfo) {
    vec3 directionToLight = lightInfo.position - v_VertexPosition;
    float distanceToLight = length(directionToLight);
    directionToLight = normalize(directionToLight);
    float diffuse = max(0.0, dot(directionToLight, - lightInfo.direction));
    diffuse = (diffuse < 0.9) ? 0.0 : 1.0 / pow(distanceToLight, 1.7);
    vec3 diffuseColor = lightInfo.color * (diffuse);

    return vec4(diffuseColor, 1.0);
}

vec4 getTextureFragColor(sampler2D texture, vec2 uv) {
    vec2 flipUV = vec2(uv.x, 1.0 - uv.y);
    return texture2D(texture, flipUV);
}

vec4 getGeneralLightFragColor() {
    vec4 result = getAmbientLightFragColor(vec3(1.0, 1.0, 1.0));
    for (int i = 0; i < LIGHT_COUNT; i++) {
        int type = u_LightInfos[i].type;
        if (type == 0) { // Point light type
            result += getPointLightFragColor(u_LightInfos[i]);
        } else if (type == 1) {
            result += getSpotLightFragColor(u_LightInfos[i]);
        }
    }
    return result;
}

void main()
{
    vec4 baseFragColor = vec4(u_Color.xyz, 1.0);
    vec4 lightFragColor =  getGeneralLightFragColor();
    vec4 textureFragColor = getTextureFragColor(u_MainTexture, v_uvTexture);
    
    gl_FragColor = baseFragColor * lightFragColor * textureFragColor; 
}

