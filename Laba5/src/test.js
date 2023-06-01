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
    // buildAllShaders()

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
    
    const shader = new Shader(vertSrc, fragSrc)
    if (!shader.build()) return

    const uniformColorBuffer = new UniformBuffer([1.0, 0.3, 0.5])
    shader.addUniform(UNIFORM_TYPES.FLOAT_3F, "u_Color", uniformColorBuffer)

    const mesh = new TriangleMesh()

    const vertexArray = new VertexArray()
    vertexArray.addVertexBuffer(new VertexBuffer(mesh.vertices))
    // vertexArray.addVertexBuffer(new VertexBuffer(mesh.normals))
    vertexArray.setIndexBuffer(new IndexBuffer(mesh.indices))
    
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    
    let dir = 1
    let g = 0.3
    renderLoop()
    function renderLoop() {
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        shader.bind()
        vertexArray.draw()

        if (g >= 1.0) {
            dir = -1
        }
        else if (g <= 0.0) {
            dir = 1
        }
        
        g += 0.05 * dir
        uniformColorBuffer.data[1] = g

        requestAnimationFrame(renderLoop)
    }
}