// const lambertShader = new Shader(vertexShaderSourceCode, fragmentShaderSourceCode)
// const phongShader = new Shader(vertPhongSource, fragPhongSource)

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


let rootObject

let scene
let pedestal
let redCube
let greenCube
let yellowCube
let blueCube

// lightCube,

// debugCube,



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

const shader = new Shader(vertSrc, fragSrc)

function buildShaders() {
    // if (!lambertShader.build()) {
    //     console.log("Lambert shader error")
    //     return false
    // }
    // if (!phongShader.build()) {
    //     console.log("Phong shader error")
    //     return false
    // }

    if (!shader.build()) return  
}

function createScene() {
    scene = new GameObject({x: 0, y: 0, z: -3}, 1)
    pedestal = new GameObject({x: 0, y: 0, z: -2}, 1)
    
    redCube = new CubeObject({x: 0, y: 0, z: 0}, 0.5, {r: 1, g: 0, b: 0})
    redCube.meshRenderer.shader = shader

    greenCube = new CubeObject({x: -0.5, y: 0, z: 0}, 0.5, {r: 0, g: 1, b: 0})
    greenCube.meshRenderer.shader = shader

    yellowCube = new CubeObject({x: 0.5, y: 0, z: 0}, 0.5, {r: 1, g: 1, b: 0})
    yellowCube.meshRenderer.shader = shader

    blueCube = new CubeObject({x: 0, y: 0.5, z: 0}, 0.5, {r: 0, g: 0, b: 1})
    blueCube.meshRenderer.shader = shader
    
    // lightCube = new CubeObject({x: 0, y: 0, z: -5}, 0.1, {r: 1, g: 1, b: 1})
    // debugCube = new CubeObject({x: 0, y: 0, z: 0}, 0.3, {r: 1, g: 0, b: 1})

    // redCube = new CubeObject({x: 0, y: 0, z: 0}, 0.2, {r: 1, g: 0, b: 0})

    
    pedestal.parent = scene
    redCube.parent = pedestal
    greenCube.parent = pedestal
    yellowCube.parent = pedestal
    blueCube.parent = pedestal

    // redCube.parent = scene

    rootObject = scene
}

function main() {
    buildShaders()
    createScene()

    const renderer = new Renderer(0, 0, gl.canvas.width, gl.canvas.height)
    renderer.cleaningColor = [0.0, 0.0, 0.0, 1.0]


    const renderObjectRecursively = function(object) {
        const maybeMarent = object.parent ? object.parent.matrix : glMatrix.mat4.create()
        const matrix = glMatrix.mat4.create()
        glMatrix.mat4.translate(matrix, maybeMarent, [object.position.x, object.position.y, object.position.z, 0])
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
            renderObjectRecursively(child)
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
        glMatrix.mat4.translate(VIEW_MATRIX, VIEW_MATRIX, [-camera.pos.x, -camera.pos.y, -camera.pos.z, 0])
        glMatrix.mat4.rotate(VIEW_MATRIX, VIEW_MATRIX, camera.rot.y, [1, 0, 0])


        renderer.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        // renderObjectRecursively(cube)
        renderObjectRecursively(rootObject)
        // renderObjectRecursively(redCube)

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
        dirB = reflect(b, dirB)

        r += 0.02 * dirR
        g += 0.05 * dirG
        b += 0.03 * dirB

        shader.setUniform(UNIFORM_TYPES.FLOAT_3F, "u_Color", [r, g, b])

        requestAnimationFrame(renderLoop)
    }
}
