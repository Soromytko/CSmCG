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

function createCube(pos, scale, color, primaryImage, secondaryImage) {
    const rot = [0, 0, 0]

    const primaryTexture = new Texture(primaryImage)
    const secondaryTexture = new Texture(secondaryImage)
    
    const material = new Material(SHADERS.standard)
    material.setFloat3("u_Color", color)
    material.setTexture("u_MainTexture", primaryTexture)
    material.setTexture("u_SecondaryTexture", secondaryTexture)
    
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

function createPlane(pos, scale, color) {
    const rot = [0, 0, 0]

    const texture1 = new Texture(document.getElementById('ground-image'))
    
    const material = new Material(SHADERS.standard)
    material.setFloat3("u_Color", color)
    material.setTexture("u_MainTexture", texture1)
    
    const plane = new GameObject(pos, rot, scale)
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

    // redCube = createCube([0.0, 0.0, -5.0], [1.0, 1.0, 1.0], [1.0, 0.0, 0.0], one, fire)
    // console.log(redCube.localPosition)
    // lightCube = createLampCube([0.0, 2.0, -2.0], [0.1, 0.1, 0.1])
    // lightCube.meshRenderer.material = new Material(SHADERS.lamp)
    // objects.push(redCube)
    // objects.push(lightCube)
    // return

    // Create objects
    scene = new GameObject([0.0, 0.0, -3.0])
    pedestal = new GameObject([0.0, 0.0, -2.0])
    redCube = createCube([0.0, 0.0, 0.0], [1.0, 1.0, 1.0], [1.0, 0.0, 0.0], one, fire)
    greenCube = createCube([-1.0, -0.1, 0.0], [1.0, 0.8, 1.0], [0.0, 1.0, 0.0], two, grass)
    blueCube = createCube([1.0, -0.2, 0.0], [1.0, 0.6, 1.0], [0.0, 0.0, 1.0], three, marble)
    lightCube = createLampCube([0.0, 2.0, -2.0], [0.1, 0.1, 0.1])
    lightCube.meshRenderer.material = new Material(SHADERS.lamp)
    
    pedestal.parent = scene
    redCube.parent = pedestal
    greenCube.parent = pedestal
    blueCube.parent = pedestal

    plane = createPlane([0.0, -0.5, 0.0], [100, 1, 100], [1.0, 1.0, 1.0])
    plane.parent = scene

    car = createCar([0.0, 0.0, -0.0])
    car.parent = scene

    headlightL = new GameObject([2.6, 0.35, -0.75])
    headlightL.parent = car
    headlightR = new GameObject([2.6, 0.35, 0.75])
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


    // const v1 = glMatrix.vec3.create()
    // glMatrix.vec3.set(v1, 0, 2, 4)
    // const vvv = [0, 0, 10]
    // glMatrix.vec3.copy(v1, vvv)
    // vvv[0] = 100
    // console.log(v1)

    // pedestal.rotation = [0, 20, 0]
    // pedestal.rotation = [0, 20, 0]
    // return

    const renderer = new Renderer(0, 0, gl.canvas.width, gl.canvas.height)
    renderer.cleaningColor = [0.0, 0.0, 0.0, 1.0]

    const renderObjectRecursively = function(object) {
        const meshRenderer = object.meshRenderer
        if (meshRenderer) {
            // if (object == redCube) console.log(object.matrix)
            const material = meshRenderer.material
            material.setMat4("u_ProjectMat", PROJECT_MATRIX)
            material.setMat4("u_ViewMat", VIEW_MATRIX)
            material.setMat4("u_WorldMat", object.matrix)
            // material.setMat4("u_WorldMat", glMatrix.mat4.create())
            //Light
            material.setFloat3("u_CameraPosition", [camera.pos.x, camera.pos.y, camera.pos.z])
            material.setLightInfo("u_LightInfos[0]", lightCube.globalPosition, [1.0, 1.0, 1.0], lightSize, 0)
            // material.setLightInfo("u_LightInfos[0]", globalPosition.slice(0, 3), [1.0, 1.0, 1.0], lightSize, 0)
            material.setLightInfo("u_LightInfos[1]", [headlightL.globalPosition], [1.0, 1.0, 1.0], lightSize, 1)
            material.setLightInfo("u_LightInfos[2]", [headlightR.globalPosition], [1.0, 1.0, 1.0], lightSize, 1)
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
