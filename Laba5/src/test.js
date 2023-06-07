// const lambertShader = new Shader(vertexShaderSourceCode, fragmentShaderSourceCode)
// const phongShader = new Shader(vertPhongSource, fragPhongSource)

const SHADERS = {
    lambert: new Shader(lambertVertSouce, lambertFragSouce),
    phong: new Shader(vertPhongSource, fragPhongSource),
    lamp: new Shader(lampVertexShaderSourceCode, lampFragmentShaderSourceCode),
    simple: new Shader(simpleVertShaderSrc, simpleFragShaderSrc),
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

let lightSize = 7
let ambientIntensity = 0.1
let diffuseIntensity = 2
let specularIntensity = 0.5

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

function createCube(pos, size, color) {
    const material = new Material(SHADERS.simple)
    material.setFloat3("u_Color", [color.r, color.g, color.b])
    
    const cube = new GameObject(pos, size)
    cube.meshRenderer = new MeshRenderer(new CubeMesh(), material)

    return cube
}

function createScene() {
    // Create objects
    scene = new GameObject({x: 0, y: 0, z: -3}, 1)
    pedestal = new GameObject({x: 0, y: 0, z: -2}, 1)
    redCube = createCube({x: 0, y: 0, z: 0}, 0.5, {r: 1, g: 0, b: 0})
    greenCube = createCube({x: -0.5, y: 0, z: 0}, 0.5, {r: 0, g: 1, b: 0})
    yellowCube = createCube({x: 0.5, y: 0, z: 0}, 0.5, {r: 1, g: 1, b: 0})
    blueCube = createCube({x: 0, y: 0.5, z: 0}, 0.5, {r: 0, g: 0, b: 1})
    lightCube = createCube({x: 0, y: 1, z: -1}, 0.1, {r: 1, g: 1, b: 1})
    // debugCube = new CubeObject({x: 0, y: 0, z: 0}, 0.3, {r: 1, g: 0, b: 1})
    
    pedestal.parent = scene
    redCube.parent = pedestal
    greenCube.parent = pedestal
    yellowCube.parent = pedestal
    blueCube.parent = pedestal
    lightCube.parent = scene


    // Create materials
    // redCube.meshRenderer.material.shader = SHADERS.test2
    // greenCube.meshRenderer.material.shader = SHADERS.test3
    // yellowCube.meshRenderer.material.shader = SHADERS.test3
    // blueCube.meshRenderer.material.shader = SHADERS.test3
    // lightCube.meshRenderer.material.shader = SHADERS.lamp
}

function bindInput() {
    const engine = new Engine()
    engine.addEventListener("keyup", (e) => {
        // console.log("AAAAAQ")
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

function bindGUI() {
    document.getElementById("sceneRange").addEventListener("input", (event) => {
        scene.rotation.y = event.target.value / 60
    })

    document.getElementById("pedestalRange").addEventListener("input", (event) => {
        pedestal.rotation.y = event.target.value / 60
    })

    document.getElementById("redRange").addEventListener("input", (event) => {
        redCube.rotation.y = event.target.value / 50
    })

    document.getElementById("greenRange").addEventListener("input", (event) => {
        greenCube.rotation.y = event.target.value / 50
    })

    document.getElementById("yellowRange").addEventListener("input", (event) => {
        yellowCube.rotation.y = event.target.value / 50
    })

    document.getElementById("blueRange").addEventListener("input", (event) => {
        blueCube.rotation.y = event.target.value / 50
    })

    document.getElementById("ambientRange").addEventListener("input", (event) => {
        ambientIntensity = event.target.value
    })

    document.getElementById("diffuseRange").addEventListener("input", (event) => {
        diffuseIntensity = event.target.value * 10
    })

    document.getElementById("specularRange").addEventListener("input", (event) => {
        specularIntensity = event.target.value
    })


    document.getElementById("lightSizeRange").addEventListener("input", (event) => {
        lightSize = event.target.value * 10
    })

    document.getElementById("lightXRange").addEventListener("input", (event) => {
        lightCube.position.x = event.target.value * 10 - 5 // [-5, 5]
    })

    document.getElementById("lightYRange").addEventListener("input", (event) => {
        lightCube.position.y = event.target.value * 10 - 5 // [-5, 5]
    })

    document.getElementById("lightZRange").addEventListener("input", (event) => {
        lightCube.position.z = event.target.value * 10 - 5 // [-5, 5]
    })

    document.getElementById("lightingModelSelect").addEventListener("change", (event) => {
        const setShader = function(shader) {
            redCube.meshRenderer.material.shader = shader
            greenCube.meshRenderer.material.shader = shader
            yellowCube.meshRenderer.material.shader = shader
            blueCube.meshRenderer.material.shader = shader
        }

        const model = event.target.value
        if (model == "Simple") {
            setShader(SHADERS.simple)
            console.log("Simple material is set")
        } else if (model == "Lambert") {
            setShader(SHADERS.lambert)
            console.log("Lambert material is set")
        } else if (model == "Phong") {
            setShader(SHADERS.phong)
            console.log("Phong material is set")
        } else if (model == "Guro") {
            setShader(SHADERS.lambert)
            console.log("Guro material is set")
        }
        else {
            console.log("Unknown model: ", model)
        }
    })
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
    bindGUI()

    const renderer = new Renderer(0, 0, gl.canvas.width, gl.canvas.height)
    renderer.cleaningColor = [0.0, 0.0, 0.0, 1.0]

    const renderObjectRecursively = function(object) {
        const parentMatrix = object.parent ? object.parent.matrix : glMatrix.mat4.create()
        const matrix = glMatrix.mat4.create()
        glMatrix.mat4.translate(matrix, parentMatrix, [object.position.x, object.position.y, object.position.z, 0])
        glMatrix.mat4.rotate(matrix, matrix, object.rotation.y, [0, 1, 0])
        glMatrix.mat4.scale(matrix, matrix, [object.size, object.size, object.size])
        object.matrix = matrix

        const meshRenderer = object.meshRenderer
        if (meshRenderer) {
            const material = meshRenderer.material
            material.setMat4("u_ProjectMat", PROJECT_MATRIX)
            material.setMat4("u_ViewMat", VIEW_MATRIX)
            material.setMat4("u_WorldMat", matrix)
            //Light
            const lightPos = lightCube.globalPosition
            material.setFloat3("u_CameraPosition", [-camera.pos.x, -camera.pos.y, -camera.pos.z])
            material.setFloat3("u_LightPosition", [lightPos.x, lightPos.y, lightPos.z])
            material.setFloat1("u_LightSize", lightSize)
            material.setFloat1("u_AmbientIntensity", ambientIntensity)
            material.setFloat1("u_DiffuseIntensity", diffuseIntensity)
            material.setFloat1("u_SpecularIntensity", specularIntensity)

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
        camera.pos = move(camera.pos, cameraTarget.pos, 0.1)

        glMatrix.mat4.perspective(PROJECT_MATRIX, (60 * Math.PI) / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0)
        glMatrix.mat4.translate(VIEW_MATRIX, glMatrix.mat4.create(), [-camera.pos.x, -camera.pos.y, -camera.pos.z, 0])
        glMatrix.mat4.rotate(VIEW_MATRIX, VIEW_MATRIX, camera.rot.y, [1, 0, 0])

        renderer.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        renderObjectRecursively(scene)

        requestAnimationFrame(renderLoop)
    }
}
