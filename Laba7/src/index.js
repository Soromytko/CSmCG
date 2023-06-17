const OBJ_LOADER = new OBJLoader()

const SHADERS = {
    standard: undefined,
    phongTexture: undefined,
    phong: undefined,
    lambert: undefined,
    guro: undefined,
    lamp: undefined,
    simple: undefined,
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

let headlightL


const objects = []

async function loadShaders() {
    const loadShader = async function(shaderFileName) {
        const url = "res/Shaders/" + shaderFileName
        // e.g. url = res/Shaders/Phong.vert
        return await loadFile(url)
    }
    SHADERS.standard = new Shader(await loadShader("Standard.vert"), await loadShader("Standard.frag"))
    SHADERS.phongTexture = new Shader(await loadShader("PhongTexture.vert"), await loadShader("PhongTexture.frag"))
    SHADERS.phong = new Shader(await loadShader("Phong.vert"), await loadShader("Phong.frag"))
    SHADERS.lambert = new Shader(await loadShader("Lambert.vert"), await loadShader("Lambert.frag"))
    SHADERS.guro = new Shader(await loadShader("Guro.vert"), await loadShader("Guro.frag"))
    SHADERS.lamp = new Shader(await loadShader("Lamp.vert"), await loadShader("Lamp.frag"))
    SHADERS.simple = new Shader(await loadShader("Simple.vert"), await loadShader("Simple.frag"))
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
    
    const material = new Material(SHADERS.standard)
    material.setFloat3("u_Color", [color.r, color.g, color.b])
    material.setTexture("u_MainTexture", primaryTexture)
    material.setTexture("u_SecondaryTexture", secondaryTexture)
    
    const cube = new GameObject(pos, scale)
    cube.meshRenderer = new MeshRenderer(new CubeMesh(), material)

    return cube
}

function createLampCube(pos, scale) {
    const material = new Material(SHADERS.standard)
    material.setFloat3("u_Color", [1.0, 1.0, 1.0])
    
    const cube = new GameObject(pos, scale)
    cube.meshRenderer = new MeshRenderer(new CubeMesh(), material)

    return cube
}

function createPlane(pos, scale, color) {
    const texture1 = new Texture(document.getElementById('ground-image'))
    
    const material = new Material(SHADERS.standard)
    material.setFloat3("u_Color", [color.r, color.g, color.b])
    material.setTexture("u_MainTexture", texture1)
    
    const plane = new GameObject(pos, scale)
    plane.meshRenderer = new MeshRenderer(new PlaneMesh(), material)

    return plane
}

function createCar(pos) {
    const material = new Material(SHADERS.standard)
    material.setFloat3("u_Color", [1.0, 1.0, 1.0])
    
    const model = new GameObject(pos)
    const mesh = new Mesh()
    mesh.vertices = OBJ_LOADER.vertices
    mesh.normals = OBJ_LOADER.normals
    mesh.indices = OBJ_LOADER.indices
    mesh.build()
    model.meshRenderer = new MeshRenderer(mesh, material)

    return model
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

    plane = createPlane({x: 0.0, y: -0.5, z: 0.0}, {x: 100, y:1, z: 100}, {r: 1.0, g: 1.0, b: 1.0})
    plane.parent = scene

    car = createCar({x: 0.0, y: 0.0, z: 0.0})
    car.parent = scene

    // headlightL = new GameObject({x: 5.0, y: 0.0, z: 0.0})
    headlightL = new GameObject({x: 2.6, y: 0.35, z: -0.75})
    headlightL.parent = car
    headlightR = new GameObject({x: 2.6, y: 0.35, z: 0.75})
    headlightR.parent = car

    // Push only a root objects, child objects will be rendered recursively
    objects.push(scene)
    objects.push(lightCube)
}

async function loadModels() {
    await OBJ_LOADER.load("res/Models/Car.obj")
}

async function main() {
    await loadShaders()
    await loadModels()
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
            material.setLightInfo("u_LightInfos[0]", [lightPos.x, lightPos.y, lightPos.z], [1.0, 1.0, 1.0], lightSize, 0)
            material.setLightInfo("u_LightInfos[1]", [headlightL.globalPosition.x, headlightL.globalPosition.y, headlightL.globalPosition.z], [1.0, 1.0, 1.0], lightSize, 1)
            material.setLightInfo("u_LightInfos[2]", [headlightR.globalPosition.x, headlightR.globalPosition.y, headlightR.globalPosition.z], [1.0, 1.0, 1.0], lightSize, 1)
            material.setFloat1("u_LightSize", lightSize)
            material.setFloat1("u_AmbientIntensity", ambientIntensity)
            material.setFloat1("u_DiffuseIntensity", diffuseIntensity)
            material.setFloat1("u_SpecularIntensity", specularIntensity)
            //Texture
            material.setFloat1("u_MixingTextures", mixingTextures)

            renderer.submit(meshRenderer.material.shader, meshRenderer.mesh.vertexArray)
            meshRenderer.material.apply()
            renderer.render()
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

        objects.forEach(object => {
            renderObjectRecursively(object)
        })

        requestAnimationFrame(renderLoop)
    }
}
