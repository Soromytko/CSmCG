// const lambertShader = new Shader(vertexShaderSourceCode, fragmentShaderSourceCode)
// const phongShader = new Shader(vertPhongSource, fragPhongSource)

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

const fragSrc2 = `
precision mediump float;

uniform vec3 u_Color;

void main() {
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
}

`

const fragSrc3 = `
precision mediump float;

uniform vec3 u_Color;

void main() {
    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
}

`

const SHADERS = {
    lambert: new Shader(lambertVertSouce, lambertFragSouce),
    phong: new Shader(vertPhongSource, fragPhongSource),
    lamp: new Shader(lampVertexShaderSourceCode, lampFragmentShaderSourceCode),
    test2: new Shader(vertSrc, fragSrc2),
    test3: new Shader(vertSrc, fragSrc3),
}

const PROJECT_MATRIX = glMatrix.mat4.create()
const VIEW_MATRIX = glMatrix.mat4.create()

const camera = {
    pos: {
        x: 0,
        y: 0,
        z: 0,
    },
    rot: {
        x: 0,
        y: 0,
        z: 0,
    },
}

const cameraTarget = {
    pos: {
        x: 0,
        y: 0,
        z: 0,
    }
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




function buildShaders() {
    for (const shader in SHADERS) {
        if (!SHADERS[shader].build()) {
            console.log(shader, " shader error")
            return false
        }
    }

    return true
}

function createScene() {
    scene = new GameObject({x: 0, y: 0, z: -3}, 1)
    pedestal = new GameObject({x: 0, y: 0, z: -2}, 1)
    
    redCube = new CubeObject({x: 0, y: 0, z: 0}, 0.5, {r: 1, g: 0, b: 0})
    greenCube = new CubeObject({x: -0.5, y: 0, z: 0}, 0.5, {r: 0, g: 1, b: 0})
    yellowCube = new CubeObject({x: 0.5, y: 0, z: 0}, 0.5, {r: 1, g: 1, b: 0})
    blueCube = new CubeObject({x: 0, y: 0.5, z: 0}, 0.5, {r: 0, g: 0, b: 1})
    // lightCube = new CubeObject({x: 0, y: 0, z: -5}, 0.1, {r: 1, g: 1, b: 1})
    lightCube = new CubeObject({x: 0, y: 0, z: -5}, 1, {r: 1, g: 1, b: 1})
    // debugCube = new CubeObject({x: 0, y: 0, z: 0}, 0.3, {r: 1, g: 0, b: 1})
    
    pedestal.parent = scene
    redCube.parent = pedestal
    greenCube.parent = pedestal
    yellowCube.parent = pedestal
    blueCube.parent = pedestal
    lightCube.parent = scene

    rootObject = scene

    redCube.meshRenderer.material.shader = SHADERS.test2
    greenCube.meshRenderer.material.shader = SHADERS.test3
    yellowCube.meshRenderer.material.shader = SHADERS.test3
    blueCube.meshRenderer.material.shader = SHADERS.test3
    lightCube.meshRenderer.material.shader = SHADERS.lamp
}

function bindInput() {
    const engine = new Engine()
    engine.addEventListener("keyup", (e) => {
        console.log("AAAAAQ")
    })

    window.onkeydown = function(e) {
        const key = e.key.toUpperCase()
        switch(key) {
            case "A": {
                cameraTarget.pos.x -= 0.1
                return
            }
            case "D": {
                cameraTarget.pos.x += 0.1
                return
            }
            case "Q": {
                cameraTarget.pos.y -= 0.1
                return
            }
            case "E": {
                cameraTarget.pos.y += 0.1
                return
            }
            case "S": {
                cameraTarget.pos.z += 0.1
                return
            }
            case "W": {
                cameraTarget.pos.z -= 0.1
                return
            }
        }        
    }
    
}

function length(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z)
}

function normalize(vector) {
    const l = length(vector)
    // const result = {x: vector.x / l, y: vector.y / l, z: vector.z / l}
    return {x: vector.x / l, y: vector.y / l, z: vector.z / l}
}

function move(from, to, speed) {
    const delta = {
        x: to.x - from.x,
        y: to.y - from.y,
        z: to.z - from.z,
    }
    
    const l = length(delta)
    if(l == 0) {
        return from
    }
    
    const direction = normalize(delta)
    const x = from.x + direction.x * speed * l
    const y = from.y + direction.y * speed * l
    const z = from.z + direction.z * speed * l
    return {x: x, y: y, z: z}
}

function main() {
    buildShaders()
    createScene()
    bindInput()

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
            meshRenderer.material.setMat4("u_ProjectMat", PROJECT_MATRIX)
            meshRenderer.material.setMat4("u_ViewMat", VIEW_MATRIX)
            meshRenderer.material.setMat4("u_WorldMat", matrix)

            renderer.submit(meshRenderer.material.shader, meshRenderer.mesh.vertexArray)
            meshRenderer.material.apply()
            renderer.render()

            // meshRenderer.render()
        }

        object._children.forEach(child => {
            renderObjectRecursively(child)
        })
    }

    renderLoop()
    function renderLoop() {
        // const n = move(camera.pos, cameraTarget.pos, 0.1)
        // camera.pos = n
        // console.log(n)

        camera.pos = move(camera.pos, cameraTarget.pos, 0.1)


        glMatrix.mat4.perspective(PROJECT_MATRIX, (60 * Math.PI) / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0)
        glMatrix.mat4.translate(VIEW_MATRIX, glMatrix.mat4.create(), [-camera.pos.x, -camera.pos.y, -camera.pos.z, 0])
        glMatrix.mat4.rotate(VIEW_MATRIX, VIEW_MATRIX, camera.rot.y, [1, 0, 0])

        renderer.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        renderObjectRecursively(rootObject)

        requestAnimationFrame(renderLoop)
    }
}
