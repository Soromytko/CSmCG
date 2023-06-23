const input = new Input()
const OBJ_LOADER = new OBJLoader()

const SHADERS = {
    standard: undefined,
}

const PROJECT_MATRIX = glMatrix.mat4.create()
const VIEW_MATRIX = glMatrix.mat4.create()

let cameraPivot
let camera

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
    SHADERS.standard = new Shader(standardVert, standardFrag)
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
    mesh.uv = new Array(mesh.vertices.length)
    mesh.build()
    model.meshRenderer = new MeshRenderer(mesh, material)
    
    const collider = new BoxCollider()
    collider.parent = model
    collider.scale = [5.0, 5.0, 3.0]
    model.collider = collider

    // cube = createCube([0.0, 0.0, 0.0], [1.0, 1.0, 1.0], [1.0, 0.0, 1.0], document.getElementById("cube1-image"))
    // cube.parent = model
    // cube.localPosition = [0.0, 0.0, 0.0]
    // cube.scale = [5.0, 5.0, 3.0]

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
    scene = new GameObject([0.0, 0.0, 0.0])
    pedestal = new GameObject([0.0, 0.0, -2.0])
    redCube = createCube([0.0, 0.0, -2.0], [1.0, 1.0, 1.0], [1.0, 0.0, 0.0], one)
    greenCube = createCube([-1.0, -0.1, -2.0], [1.0, 0.8, 1.0], [0.0, 1.0, 0.0], two)
    blueCube = createCube([1.0, -0.2, -2.0], [1.0, 0.6, 1.0], [0.0, 0.0, 1.0], three)
    lightCube = createLampCube([0.0, 2.0, -2.0], [0.1, 0.1, 0.1])
    lightCube.meshRenderer.material = new Material(SHADERS.lamp)
    
    pedestal.parent = scene
    redCube.parent = pedestal
    greenCube.parent = pedestal
    blueCube.parent = pedestal

    plane = createPlane([0.0, -0.5, 0.0], [100, 1, 100], [1.0, 1.0, 1.0])
    plane.parent = scene

    car = createCar([0.0, 0.0, -10.0])
    car.parent = scene
    car.script = new CarController(car)

    headlightL = new GameObject([2.52965, 0.365211, -0.746565])
    // headlightL = createLampCube([2.52965, 0.365211, -0.746565], [0.1, 0.1, 0.1])
    headlightL.parent = car
    headlightL.localPosition = [2.52965, 0.365211, -0.746565]
    headlightR = new GameObject()
    headlightR.parent = car
    headlightR.localPosition = [2.52965, 0.365211, +0.746565]

    //Camera
    cameraPivot = new GameObject([0.0, 0.0, 0.0])
    cameraPivot.parent = car
    cameraPivot.localPosition = [0.0, 0.0, 0.0]
    camera = new GameObject([0.0, 3.0, 2.0])
    camera.parent = cameraPivot
    camera.localPosition = [0.0, 0.0, 10.0]
    camera.script = new CameraPivotController(camera)
    
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
        const meshRenderer = object.meshRenderer
        if (meshRenderer) {
            const material = meshRenderer.material
            material.setMat4("u_ProjectMat", PROJECT_MATRIX)
            material.setMat4("u_ViewMat", VIEW_MATRIX)
            material.setMat4("u_WorldMat", object.matrix)
            //Light
            material.setFloat3("u_CameraPosition", camera.globalPosition)
            material.setLightInfo("u_LightInfos[0]", lightCube.globalPosition, [0, 0, 0], [1.0, 1.0, 1.0], lightSize, 0)
            material.setLightInfo("u_LightInfos[1]", headlightL.globalPosition, headlightL.getRelativeDirection(1.0, -1.0, 0.0), [1.0, 1.0, 1.0], lightSize, 1)
            material.setLightInfo("u_LightInfos[2]", headlightR.globalPosition, headlightR.getRelativeDirection(1.0, -1.0, 0.0), [1.0, 1.0, 1.0], lightSize, 1)
            material.setFloat1("u_LightSize", lightSize)
            material.setFloat1("u_AmbientIntensity", ambientIntensity)
            material.setFloat1("u_DiffuseIntensity", diffuseIntensity)
            material.setFloat1("u_SpecularIntensity", specularIntensity)
            //Texture
            material.setFloat1("u_MixingTextures", mixingTextures)

            if (!meshRenderer.material.shader) return
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
        camera._script.update()
        car._script.update()

        glMatrix.mat4.perspective(PROJECT_MATRIX, (60 * Math.PI) / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0)
        glMatrix.mat4.invert(VIEW_MATRIX, camera.matrix)

        renderer.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        objects.forEach(object => {
            renderObjectRecursively(object)
        })

        requestAnimationFrame(renderLoop)
    }
}
