const SHADERS = {
    phongTexture: undefined,
    phong: undefined,
    lambert: new Shader(lambertVertSrc, lambertFragSrc),
    guro: new Shader(guroVertSrc, guroFragSrc),
    lamp: new Shader(lampVertSrc, lampFragSrc),
    simple: new Shader(simpleVertSrc, simpleFragSrc),
    test2: new Shader(vertSrc, fragSrc2),
    test3: new Shader(vertSrc, fragSrc3),
}

const SHADER_SRCS = {
    phonTexture: { vert: "", frag: "" },
    phong: { vert: "", frag: "" },
    lambert: { vert: "", frag: "" },
    guro: { vert: "", frag: "" },
    lamp: { vert: "", frag: "" },
    simple: { vert: "", frag: "" },
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
}

let lightSize = 7
let ambientIntensity = 0.1
let diffuseIntensity = 2
let specularIntensity = 0.5
let mixingTextures = 1.0

let scene
let pedestal
let redCube
let greenCube
let blueCube
let plane

const objects = []

async function loadShaders() {
    const loadShader = async function(shaderFileName) {
        const url = "res/Shaders/" + shaderFileName
        // e.g. url = res/Shaders/Phong.vert
        return await loadFile(url)
    }
    SHADERS.phongTexture = new Shader(await loadShader("PhongTexture.vert"), await loadShader("PhongTexture.frag"))
    SHADERS.phong = new Shader(await loadShader("Phong.vert"), await loadShader("Phong.frag"))
    // SHADERS.lambert = new Shader(await loadFile("res/Shaders/Lambert.vert"), await loadFile("res/Shaders/Lambert.frag"))
}

function buildShaders() {
    for (const shader in SHADERS) {
        if (!SHADERS[shader].build()) {
            console.log(shader, " shader error")
            return false
        }
    }

    return true
}

function createCube(pos, scale, color, primaryImage, secondaryImage) {
    const primaryTexture = new Texture(primaryImage)
    const secondaryTexture = new Texture(secondaryImage)
    
    const material = new Material(SHADERS.phongTexture)
    material.setFloat3("u_Color", [color.r, color.g, color.b])
    material.setTexture("u_MainTexture", primaryTexture)
    material.setTexture("u_SecondaryTexture", secondaryTexture)
    
    const cube = new GameObject(pos, scale)
    cube.meshRenderer = new MeshRenderer(new CubeMesh(), material)

    return cube
}

function createLampCube(pos, scale) {
    const material = new Material(SHADERS.phongTexture)
    material.setFloat3("u_Color", [1.0, 1.0, 1.0])
    
    const cube = new GameObject(pos, scale)
    cube.meshRenderer = new MeshRenderer(new CubeMesh(), material)

    return cube
}

function createPlane(pos, scale, color) {
    const texture1 = new Texture(document.getElementById('ground-image'))
    const texture2 = new Texture(document.getElementById('ground-image'))
    
    const material = new Material(SHADERS.phongTexture)
    material.setFloat3("u_Color", [color.r, color.g, color.b])
    material.setTexture("u_MainTexture", texture1)
    material.setTexture("u_SecondaryTexture", texture2)
    
    const plane = new GameObject(pos, scale)
    plane.meshRenderer = new MeshRenderer(new PlaneMesh(), material)

    return plane
}

function createScene() {
    //Textures
    const one = document.getElementById("cube1-image")
    const two = document.getElementById("cube2-image")
    const three = document.getElementById("cube3-image")
    const fire = document.getElementById("fire-image")
    const grass = document.getElementById("grass-image")
    const marble = document.getElementById("marble-image")

    // Create objects
    scene = new GameObject({x: 0.0, y: 0.0, z: -3.0})
    pedestal = new GameObject({x: 0.0, y: 0.0, z: -2.0})
    redCube = createCube({x: 0.0, y: 0.0, z: 0.0}, {x: 1.0, y: 1.0, z: 1.0}, {r: 1.0, g: 0.0, b: 0.0}, one, fire)
    greenCube = createCube({x: -1.0, y: -0.1, z: 0.0}, {x: 1.0, y: 0.8, z: 1.0}, {r: 0.0, g: 1.0, b: 0.0}, two, grass)
    blueCube = createCube({x: 1.0, y: -0.2, z: 0.0}, {x: 1.0, y: 0.6, z: 1.0}, {r: 0.0, g: 0.0, b: 1.0}, three, marble)
    lightCube = createLampCube({x: 0.0, y: 2.0, z: -2.0}, {x: 0.1, y: 0.1, z: 0.1})
    lightCube.meshRenderer.material = new Material(SHADERS.lamp)
    
    pedestal.parent = scene
    redCube.parent = pedestal
    greenCube.parent = pedestal
    blueCube.parent = pedestal

    plane = createPlane({x: 0.0, y: -0.5, z: 0.0}, {x: 10, y:10, z: 10}, {r: 1.0, g: 1.0, b: 1.0})
    plane.parent = scene

    // Push only a root objects, child objects will be rendered recursively
    objects.push(scene)
    objects.push(lightCube)
}

async function main() {
    await loadShaders()
    buildShaders()
    createScene()
    bindGUI()

    const renderer = new Renderer(0, 0, gl.canvas.width, gl.canvas.height)
    renderer.cleaningColor = [0.0, 0.0, 0.0, 1.0]

    const renderObjectRecursively = function(object) {
        const parentMatrix = object.parent ? object.parent.matrix : glMatrix.mat4.create()
        const matrix = glMatrix.mat4.create()
        glMatrix.mat4.translate(matrix, parentMatrix, [object.position.x, object.position.y, object.position.z, 0])
        glMatrix.mat4.rotate(matrix, matrix, object.rotation.y, [0, 1, 0])
        glMatrix.mat4.scale(matrix, matrix, [object.scale.x, object.scale.y, object.scale.z])
        object.matrix = matrix

        const meshRenderer = object.meshRenderer
        if (meshRenderer) {
            const material = meshRenderer.material
            material.setMat4("u_ProjectMat", PROJECT_MATRIX)
            material.setMat4("u_ViewMat", VIEW_MATRIX)
            material.setMat4("u_WorldMat", matrix)
            //Light
            const lightPos = lightCube.globalPosition
            material.setFloat3("u_CameraPosition", [camera.pos.x, camera.pos.y, camera.pos.z])
            material.setFloat3("u_LightPosition", [lightPos.x, lightPos.y, lightPos.z])
            material.setFloat1("u_LightSize", lightSize)
            material.setFloat1("u_AmbientIntensity", ambientIntensity)
            material.setFloat1("u_DiffuseIntensity", diffuseIntensity)
            material.setFloat1("u_SpecularIntensity", specularIntensity)
            //Texture
            material.setFloat1("u_MixingTextures", mixingTextures)

            renderer.submit(meshRenderer.material.shader, meshRenderer.mesh.vertexArray)
            meshRenderer.material.apply()
            renderer.render()

            // meshRenderer.render()
        }

        object._children.forEach(child => {
            renderObjectRecursively(child)
        })
    }

    // loadFile("res/Shaders/LambertVert.txt")

    renderLoop()
    function renderLoop() {
        cameraScript()

        // if (input.getKey("G"))
        // loadFile()


        glMatrix.mat4.perspective(PROJECT_MATRIX, (60 * Math.PI) / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0)
        glMatrix.mat4.rotate(VIEW_MATRIX, glMatrix.mat4.create(), camera.rot.y, [1, 0, 0])
        glMatrix.mat4.rotate(VIEW_MATRIX, VIEW_MATRIX, camera.rot.x, [0, 1, 0])
        glMatrix.mat4.translate(VIEW_MATRIX, VIEW_MATRIX, [-camera.pos.x, -camera.pos.y, -camera.pos.z, 0])

        renderer.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        objects.forEach(object => {
            renderObjectRecursively(object)
        })

        requestAnimationFrame(renderLoop)
    }
}
