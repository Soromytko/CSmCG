var lambertShader = new Shader(vertexShaderSourceCode, fragmentShaderSourceCode)
var phongShader = new Shader(vertPhongSource, fragPhongSource)

var PROJECT_MATRIX_UNIFORM_BUFFER = new UniformBuffer()
var VIEW_MATRIX_UNIFORM_BUFFER = new UniformBuffer()
var WORLD_MATRIX_UNIFORM_BUFFER = new UniformBuffer()

function buildAllShaders() {
    if (!lambertShader.build()) {
        console.log("Lambert shader error")
        return false
    }
    if (!phongShader.build()) {
        console.log("Phong shader error")
        return false
    }

    lambertShader.addUniform(UNIFORM_TYPES.MAT_4F, "u_ProjectMat", PROJECT_MATRIX_UNIFORM_BUFFER)
    lambertShader.addUniform(UNIFROM_TYPES.MAT_4F, "u_ViewMat", VIEW_MATRIX_UNIFORM_BUFFER)
    lambertShader.addUniform(UNIFORM_TYPES.MAT_4F, "u_WorldMat", WORLD_MATRIX_UNIFORM_BUFFER)

    phongShader.addUniform(UNIFORM_TYPES.MAT_4F, "u_ProjectMat", PROJECT_MATRIX_UNIFORM_BUFFER)
    phongShader.addUniform(UNIFORM_TYPES.MAT_4F, "u_ViewMat", VIEW_MATRIX_UNIFORM_BUFFER)
    phongShader.addUniform(UNIFORM_TYPES.MAT_4F, "u_WorldMat", WORLD_MATRIX_UNIFORM_BUFFER)
}