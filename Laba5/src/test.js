const PROJECT_MATRIX_UNIFORM_BUFFER = new UniformBuffer()
const VIEW_MATRIX_UNIFORM_BUFFER = new UniformBuffer()
const WORLD_MATRIX_UNIFORM_BUFFER = new UniformBuffer()

// const lambertShader = new Shader(vertexShaderSourceCode, fragmentShaderSourceCode)
// const phongShader = new Shader(vertPhongSource, fragPhongSource)

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

function main() {
    const vertSrc = `
    precision mediump float;

    attribute vec3 a_VertexPosition;

    void main() {
        gl_Position = vec4(a_VertexPosition, 1.0);
    }
    
    `

    const fragSrc = `
    precision mediump float;

    uniform vec3 u_Color;

    void main() {
        gl_FragColor = vec4(u_Color, 1.0);
    }

    `

    const vertices = [
        -0.5, -0.5, +0.0,
        +0.5, -0.5, +0.0,
        +0.5, +0.5, +0.0,
    ]

    const indices = [
        0, 1, 2
    ]

    const shader = new Shader(vertSrc, fragSrc)
    if (!shader.build()) return

    const mesh = new TriangleMesh()
    const vertexArray = mesh.vertexArray

    const renderer = new Renderer(0, 0, gl.canvas.width, gl.canvas.height)
    renderer.cleaningColor = [0.0, 0.0, 0.0, 1.0]

    let r = 1.0
    let dirR = 1
    let g = 0.3
    let dirG = 1
    let b = 0.3
    let dirB = 1
    renderLoop()
    function renderLoop() {
        renderer.clear(gl.COLOR_BUFFER_BIT)
        renderer.submit(shader, vertexArray)
        renderer.render()

        const reflect = function(value, dir) {
            if (value >= 1.0) {
                return -1
            }
            else if (value <= 0.0) {
                return 1
            }

            return dir
        }

        dirR = reflect(r, dirR)
        dirG = reflect(g, dirG)
        dirB = reflect(g, dirB)

        r += 0.02 * dirR
        g += 0.05 * dirG
        b += 0.03 * dirB

        shader.setUniform(UNIFORM_TYPES.FLOAT_3F, "u_Color", [r, g, b])

        requestAnimationFrame(renderLoop)
    }
}
