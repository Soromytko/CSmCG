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
uniform sampler2D u_SecondaryTexture;
uniform float u_MixingTextures;

uniform vec3 u_LightPosition;
uniform float u_LightSize;
uniform vec3 u_CameraPosition;

vec4 mixColors(vec4 color1, vec4 color2, float weight)
{
    // 50% of the color1 and 50% of the color2
    weight *= 0.5;
    return vec4(color1.xyz * (1.0 - weight) + color2.xyz * weight, 1.0);
}

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

    // Texture
    vec2 uv = vec2(v_uvTexture.x, 1.0 - v_uvTexture.y);
    vec4 mainTextureFragColor = texture2D(u_MainTexture, uv);
    vec4 secondaryTextureFragColor = texture2D(u_SecondaryTexture, uv);

    // Apply
    vec4 lightFragColor = vec4(u_Color * (ambientColor + diffuseColor + specularColor), 1.0);
    gl_FragColor = mixColors(lightFragColor * mainTextureFragColor, secondaryTextureFragColor, u_MixingTextures);
}

