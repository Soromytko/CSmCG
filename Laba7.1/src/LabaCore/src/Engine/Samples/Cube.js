const lambertShader = new Shader(vertexShaderSourceCode, fragmentShaderSourceCode)
const phongShader = new Shader(vertPhongSource, fragPhongSource)

const PROJECT_MATRIX = glMatrix.mat4.create()
const VIEW_MATRIX = glMatrix.mat4.create()

const camera = {
    pos: {
        x: 0,
        y: 0,
        z: 0
    },
    rot: {
        x: 0,
        y: 0,
        z: 0
    },
}



function buildAllShaders() {
    if (!lambertShader.build()) {
        console.log("Lambert shader error")
        return false
    }
    if (!phongShader.build()) {
        console.log("Phong shader error")
        return false
    }
}

function main0() {
    const vertSrc = `
    precision mediump float;

    attribute vec3 a_VertexPosition;

    uniform mat4 u_ProjectMat;
    uniform mat4 u_ViewMat;
    uniform mat4 u_WorldMat;

    void main() {
        // gl_Position = vec4(a_VertexPosition, 1.0);
        gl_Position = u_ProjectMat * u_ViewMat * u_WorldMat * vec4(a_VertexPosition, 1.0);
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

    let cube = new CubeObject({x: 0, y: 0, z: -5})
    cube.meshRenderer.shader = shader

    const renderObjectRecursively = function(object) {
        const matrix = object.parent ? object.parent.matrix : glMatrix.mat4.create()
        glMatrix.mat4.translate(matrix, matrix, [object.position.x, object.position.y, object.position.z, 0])
        glMatrix.mat4.rotate(matrix, matrix, object.rotationY, [0, 1, 0])
        glMatrix.mat4.scale(matrix, matrix, [object.size, object.size, object.size])
        object.matrix = matrix

        const meshRenderer = object.meshRenderer
        if (meshRenderer) {
            shader.setMat4("u_ProjectMat", PROJECT_MATRIX)
            shader.setMat4("u_ViewMat", VIEW_MATRIX)
            shader.setMat4("u_WorldMat", matrix)
            meshRenderer.render()
        }

        object._children.forEach(child => {
            renderRecursively(child)
        })
    }

    let r = 1.0
    let dirR = 1
    let g = 0.3
    let dirG = 1
    let b = 0.3
    let dirB = 1
    renderLoop()
    function renderLoop() {

        glMatrix.mat4.perspective(PROJECT_MATRIX, (60 * Math.PI) / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0)
        glMatrix.mat4.translate(viewMatrix, viewMatrix, [-camera.pos.x, -camera.pos.y, -camera.pos.z, 0])
        glMatrix.mat4.rotate(viewMatrix, viewMatrix, camera.rotX, [1, 0, 0])


        renderer.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        renderer.submit(shader, vertexArray)

        renderObjectRecursively(cube)

        const reflect = function(value, dir) {
            if (value >= 1.0) {
                return -1
            }
            else if (value <= 0.0) {
                return 1
            }

            return dir
        }

        cube.rotationY += 0.01

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
