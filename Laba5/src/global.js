const gl = getGl()

function getGl() {
    const canvas = document.getElementById('canvas')
    if (!canvas) {
        alert("Canvas not found")
        throw new Error()
    }

    const gl = canvas.getContext('webgl')
    if (!gl) {
        alert("WebGL initialization error")
        throw new Error()
    }

    return gl
}

const POSITION_ATTRIBUTE_LOCATION = 0
const NORMAL_ATTRIBUTE_LOCATION = 1
const COLOR_ATTRIBUTE_LOCATION = 2

const UNIFORM_TYPES = {
    FLOAT_1F:   "FLOAT_1F",
    FLOAT_2F:   "FLOAT_2F",
    FLOAT_3F:   "FLOAT_3F",
    MAT_4F:     "MAT_4F",
}

const lambertShader = new Shader(vertexShaderSourceCode, fragmentShaderSourceCode)
const phongShader = new Shader(vertPhongSource, fragPhongSource)

const PROJECT_MATRIX_UNIFORM_BUFFER = new UniformBuffer()
const VIEW_MATRIX_UNIFORM_BUFFER = new UniformBuffer()
const WORLD_MATRIX_UNIFORM_BUFFER = new UniformBuffer()

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
    lambertShader.addUniform(UNIFORM_TYPES.MAT_4F, "u_ViewMat", VIEW_MATRIX_UNIFORM_BUFFER)
    lambertShader.addUniform(UNIFORM_TYPES.MAT_4F, "u_WorldMat", WORLD_MATRIX_UNIFORM_BUFFER)

    phongShader.addUniform(UNIFORM_TYPES.MAT_4F, "u_ProjectMat", PROJECT_MATRIX_UNIFORM_BUFFER)
    phongShader.addUniform(UNIFORM_TYPES.MAT_4F, "u_ViewMat", VIEW_MATRIX_UNIFORM_BUFFER)
    phongShader.addUniform(UNIFORM_TYPES.MAT_4F, "u_WorldMat", WORLD_MATRIX_UNIFORM_BUFFER)
}
