const input = new Input()
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

const meshes = {
    car: new Mesh(),
    lamppost: new Mesh(),
}

const PROJECT_MATRIX = glMatrix.mat4.create()
const VIEW_MATRIX = glMatrix.mat4.create()

let camera

let lightSize = 7
let ambientIntensity = 0.1
let diffuseIntensity = 2
let specularIntensity = 0.5
let mixingTextures = 1.0

let scene
let pedestal
let plane

let headlightL
let headlightR

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

function createCube(pos, scale, color, primaryImage) {
    const rot = [0, 0, 0]

    const primaryTexture = new Texture(primaryImage)
    
    const material = new Material(SHADERS.standard)
    material.setFloat3("u_Color", color)
    material.setTexture("u_MainTexture", primaryTexture)
    
    const cube = new GameObject(pos, rot, scale)
    cube.meshRenderer = new MeshRenderer(new CubeMesh(), material)

    return cube
}

function createLampCube(pos, scale) {
    const rot = [0, 0, 0]
    
    const material = new Material(SHADERS.standard)
    material.setFloat3("u_Color", [1.0, 1.0, 1.0])
    
    const cube = new GameObject(pos, rot, scale)
    cube.meshRenderer = new MeshRenderer(new CubeMesh(), material)

    return cube
}

function createPlane(pos, scale, color, image) {
    const rot = [0, 0, 0]

    const texture = new Texture(image)
    
    const material = new Material(SHADERS.standard)
    material.setFloat3("u_Color", color)
    material.setTexture("u_MainTexture", texture)
    
    const plane = new GameObject(pos, rot, scale)
    plane.meshRenderer = new MeshRenderer(new PlaneMesh(), material)

    return plane
}

function createModel(mesh, color) {
    const material = new Material(SHADERS.phong)
    material.setFloat3("u_Color", color)
    
    const model = new GameObject()
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
    const asphalt = document.getElementById("asphalt-image")
    const road = document.getElementById("road-image")
    const groundT = document.getElementById("ground-image")

    // Create objects
    scene = new GameObject([0.0, 0.0, 0.0])
    pedestal = new GameObject([0.0, 0.0, -2.0])
    lightCube = createLampCube([0.0, 2.0, -2.0], [0.1, 0.1, 0.1])
    lightCube.meshRenderer.material = new Material(SHADERS.lamp)
    
    pedestal.parent = scene

    plane = createPlane([0.0, -0.5, 0.0], [25, 1, 50], [1.0, 1.0, 1.0], road)
    plane.parent = scene
    const road2 = createPlane([0.0, -0.5, -1], [1, 1, 1], [1.0, 1.0, 1.0], road)
    road2.parent = plane
    for (let i = 0; i < 1; i++) {
        const create = function(pos, rotY) {
            const lamppost = createModel(meshes.lamppost, [1.0, 1.0, 1.0])
            const step = 10
            lamppost.globalPosition = pos
            lamppost.rotate(0, rotY)
            lamppost.parent = scene
            const light = new LightInfo()
            light.size = 25
            light.type = 0
            light.parent = lamppost
            light.localPosition = [0, 15, 3]
        }

        const z = -i * 40 - 20
        create([-12, 0.0, z], 90 * Math.PI / 180)
        create([12, 0.0, z], -90 * Math.PI / 180)
        
    }

    const ground = createPlane([0.0, -0.7, -20], [50, 1, 100], [1.0, 1.0, 1.0], grass)
    ground.parent = scene

    // car = createCar([0.0, 0.0, -10.0])
    car = createModel(meshes.car, [1.0, 0.0, 0.5])
    car.rotate(0, Math.PI)
    car.parent = scene
    car.script = new CarController(car)

    headlightL = new LightInfo()
    headlightL.type = 1
    headlightL.parent = car
    const tilt = 10 * Math.PI / 180
    // headlightL.localPosition = [1.07313, -1.46486, -3.58664]
    headlightL.localPosition = [1.08891, 1.35343, +3.3577]
    headlightL.rotate(tilt, 0, 0)
    headlightR = new LightInfo()
    headlightR.type = 1
    headlightR.parent = car
    headlightR.localPosition = [-1.08891, 1.35343, +3.3577]
    headlightR.rotate(tilt, 0, 0)

    //Camera
    camera = new GameObject([0.0, 15.0, 15.0])
    camera.rotate(-30 * Math.PI / 180, 0, 0)
    camera.script = new CameraController(camera)
    
    // Push only a root objects, child objects will be rendered recursively
    objects.push(scene)
    objects.push(lightCube)
}

async function loadModels() {
    await OBJ_LOADER.load("res/Models/Car.obj")
    meshes.car.vertices = OBJ_LOADER.vertices
    meshes.car.normals = OBJ_LOADER.normals
    meshes.car.indices = OBJ_LOADER.indices
    meshes.car.uv = new Array(meshes.car.vertices.length)
    meshes.car.build()

    await OBJ_LOADER.load("res/Models/lamppost.obj")
    meshes.lamppost.vertices = OBJ_LOADER.vertices
    meshes.lamppost.normals = OBJ_LOADER.normals
    meshes.lamppost.indices = OBJ_LOADER.indices
    meshes.lamppost.uv = new Array(meshes.lamppost.vertices.length)
    meshes.lamppost.build()
}

function setLights(material) {
    LightInfo.INSTANCES.forEach((light, index) => {
        const name = "u_LightInfos[" + index + "]" 
        material.setLightInfo(name, light.globalPosition, light.forward, [1.0, 1.0, 1.0], light.size, light.type)
    })
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
        const meshRenderer = object.meshRenderer
        if (meshRenderer) {
            const material = meshRenderer.material
            material.setMat4("u_ProjectMat", PROJECT_MATRIX)
            material.setMat4("u_ViewMat", VIEW_MATRIX)
            material.setMat4("u_WorldMat", object.matrix)
            //Light
            material.setFloat3("u_CameraPosition", camera.globalPosition)
            setLights(material)
            // material.setLightInfo("u_LightInfos[4]", lightCube.globalPosition, [0, 0, 0], [1.0, 1.0, 1.0], lightSize, 0)
            // material.setLightInfo("u_LightInfos[1]", headlightL.globalPosition, headlightL.getRelativeDirection(0.0, -0.7, 1.0), [1.0, 1.0, 1.0], lightSize, 1)
            // material.setLightInfo("u_LightInfos[2]", headlightR.globalPosition, headlightR.getRelativeDirection(0.0, -0.7, 1.0), [1.0, 1.0, 1.0], lightSize, 1)
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
        input.update()
        // camera.script.update()
        car.script.update()

        glMatrix.mat4.perspective(PROJECT_MATRIX, (60 * Math.PI) / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0)
        glMatrix.mat4.invert(VIEW_MATRIX, camera.matrix)

        renderer.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        objects.forEach(object => {
            renderObjectRecursively(object)
        })

        requestAnimationFrame(renderLoop)
    }
}
