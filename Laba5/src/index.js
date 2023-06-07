const SHADERS = {
    lambert: new Shader(lambertVertSrc, lambertFragSrc),
    phong: new Shader(phongVertSrc, phongFragSrc),
    guro: new Shader(guroVertSrc, guroFragSrc),
    lamp: new Shader(lampVertSrc, lampFragSrc),
    simple: new Shader(simpleVertSrc, simpleFragSrc),
    test2: new Shader(vertSrc, fragSrc2),
    test3: new Shader(vertSrc, fragSrc3),
}

const PROJECT_MATRIX = glMatrix.mat4.create()
const VIEW_MATRIX = glMatrix.mat4.create()

const camera = {
    pos: {
        x: 0,
        y: 2,
        z: 3,
    },
    rot: {
        x: 0,
        y: 0,
        z: 0,
    },
    input: {
        a: false,
        d: false,
        s: false,
        w: false,
    }
}

const cursor = {
    pos: {
        x: 0,
        y: 0,
    },
    oldPos: {
        x: 0,
        y: 0,
    },
    speed: {
        x: 0,
        y: 0,
    }
}

let isLooking = false

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
let plane

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
    const material = new Material(SHADERS.lambert)
    material.setFloat3("u_Color", [color.r, color.g, color.b])
    
    const cube = new GameObject(pos, size)
    cube.meshRenderer = new MeshRenderer(new CubeMesh(), material)

    return cube
}

function createPlane(pos, size, color) {
    const material = new Material(SHADERS.lambert)
    material.setFloat3("u_Color", [color.r, color.g, color.b])
    
    const plane = new GameObject(pos, size)
    plane.meshRenderer = new MeshRenderer(new PlaneMesh(), material)

    return plane
}

function createScene() {
    // Create objects
    scene = new GameObject({x: 0, y: 0, z: -3}, 1)
    pedestal = new GameObject({x: 0, y: 0, z: -2}, 1)
    redCube = createCube({x: 0, y: 0, z: 0}, 0.5, {r: 1, g: 0, b: 0})
    greenCube = createCube({x: -0.5, y: 0, z: 0}, 0.5, {r: 0, g: 1, b: 0})
    yellowCube = createCube({x: 0.5, y: 0, z: 0}, 0.5, {r: 1, g: 1, b: 0})
    blueCube = createCube({x: 0, y: 0.5, z: 0}, 0.5, {r: 0, g: 0, b: 1})
    lightCube = createCube({x: 0, y: 2, z: 1}, 0.1, {r: 1, g: 1, b: 1})
    lightCube.meshRenderer.material = new Material(SHADERS.lamp)
    
    pedestal.parent = scene
    redCube.parent = pedestal
    greenCube.parent = pedestal
    yellowCube.parent = pedestal
    blueCube.parent = pedestal
    lightCube.parent = scene

    plane = createPlane({x: 0.0, y: -0.5, z: 0.0}, 10, {r: 1.0, g: 1.1, b: 1.0})
    plane.parent = scene
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
        cameraScript()

        glMatrix.mat4.perspective(PROJECT_MATRIX, (60 * Math.PI) / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0)
        glMatrix.mat4.rotate(VIEW_MATRIX, glMatrix.mat4.create(), camera.rot.y, [1, 0, 0])
        glMatrix.mat4.rotate(VIEW_MATRIX, VIEW_MATRIX, camera.rot.x, [0, 1, 0])
        glMatrix.mat4.translate(VIEW_MATRIX, VIEW_MATRIX, [-camera.pos.x, -camera.pos.y, -camera.pos.z, 0])

        renderer.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        renderObjectRecursively(scene)

        requestAnimationFrame(renderLoop)
    }
}
