function compileShader(gl, type, source) { 
    const shader = gl.createShader(type); 
    gl.shaderSource(shader, source); 
    gl.compileShader(shader); 
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { 
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader)); 
        gl.deleteShader(shader);
        return null; 
    } 
    return shader;
}

function linkShaders(gl, vertexShader, fragmentShader) {
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader); 
    gl.attachShader(shaderProgram, fragmentShader); 
    gl.linkProgram(shaderProgram); 
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) { 
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram)); 
        return null; 
    } 
    return shaderProgram
}

function createShaderProgram(gl, vertexShaderSourceCode, fragmentShaderSourceCode) {
    const vertexCompiledShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSourceCode)
    const fragmentCompiledShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceCode)

    if (!vertexCompiledShader || !fragmentCompiledShader) {
        return undefined
    }

    return linkShaders(gl, vertexCompiledShader, fragmentCompiledShader)
}

var gl

var camera = {
    pos: {x: 0, y: 2, z: 0},
    rotX: 0.3,
}
var scene = {
    pos: {x: 0, y: 0, z: -6},
    rotY: 0,
}
var pedestal = {
    pos: {x: 0, y: 0, z: -3},
    rotY: 0,
}
var ambientIntensity = 0.1
var diffuseIntensity = 2
var redCube = new Cube({x: -2, y: 0, z: 0}, 0.2, {r: 1, g: 0, b: 0})
var greenCube = new Cube({x: -1, y: 0, z: 0}, 0.4, {r: 0, g: 1, b: 0})
var yellowCube = new Cube({x: 0, y: 0, z: 0}, 0.5, {r: 1, g: 1, b: 0})
var blueCube = new Cube({x: 1, y: 0, z: 0}, 0.3, {r: 0, g: 0, b: 1})
// var lightCube = new Cube({x: 0, y: 2, z: -5}, 0.1, {r: 1, g: 1, b: 1})
var lightCube = new Cube({x: 0, y: 2, z: -5}, 1, {r: 1, g: 1, b: 1})
var lightSize = 7

var objects = [
    redCube,
    greenCube,
    yellowCube,
    blueCube,
]

var lambertShaderProgram
var phongShaderProgram
var lampShaderProgram
var currentShaderProgram

var uProjectMatLoc
var uViewMatLoc
var uWorldMatLoc
var uColorLoc
var uAmbientIntensityLoc
var uDiffuseIntensityLoc
var uLightPositionLoc
var uLightDirectionLoc
var uLightSizeLoc
var aVertexPositionLoc
var aVertexNormalLoc

function init() {
    const canvas = document.getElementById('canvas')
    if (!canvas) {
        alert("Canvas not found")
        throw new Error()
    }

    gl = canvas.getContext('webgl')
    if (!gl) {
        alert("WebGL initialization error")
        throw new Error()
    }

    lambertShaderProgram = createShaderProgram(gl, vertLambertSource, fragSource)
    if (!lambertShaderProgram) {
        console.log("Lambert shader error")
        throw new Error()
    }

    phongShaderProgram = createShaderProgram(gl, vertPhongSource, fragPhongSource)
    if (!phongShaderProgram) {
        console.log("Phong shader error")
        throw new Error()
    }

    lampShaderProgram = createShaderProgram(gl, lampVertexShaderSourceCode, lampFragmentShaderSourceCode)
    if (!lampShaderProgram) {
        console.log("Lamp shader error")
        throw new Error()
    }

    setShaderProgram(lambertShaderProgram)

    // CubeMesh is a singleton class, call this for an instance
    new CubeMesh().createBuffers(gl)

    bindInput()
}

function setShaderProgram(newShaderProgram) {
    currentShaderProgram = newShaderProgram

    gl.disableVertexAttribArray(aVertexPositionLoc)
    gl.disableVertexAttribArray(aVertexNormalLoc)

    uProjectMatLoc = gl.getUniformLocation(currentShaderProgram, 'u_ProjectMat')
    uViewMatLoc = gl.getUniformLocation(currentShaderProgram, 'u_ViewMat')
    uWorldMatLoc = gl.getUniformLocation(currentShaderProgram, 'u_WorldMat')
    uColorLoc = gl.getUniformLocation(currentShaderProgram, "u_Color")
    uAmbientIntensityLoc = gl.getUniformLocation(currentShaderProgram, "u_AmbientIntensity")
    uDiffuseIntensityLoc = gl.getUniformLocation(currentShaderProgram, "u_DiffuseIntensity")
    uLightPositionLoc = gl.getUniformLocation(currentShaderProgram, "u_LightPosition")
    uLightDirectionLoc = gl.getUniformLocation(currentShaderProgram, "u_LightDirection")
    uLightSizeLoc = gl.getUniformLocation(currentShaderProgram, "u_LightSize")
    aVertexPositionLoc = gl.getAttribLocation(currentShaderProgram, 'a_VertexPosition')
    aVertexNormalLoc = gl.getAttribLocation(currentShaderProgram, 'a_VertexNormal')

    gl.enableVertexAttribArray(aVertexPositionLoc)
    gl.enableVertexAttribArray(aVertexNormalLoc)

    gl.useProgram(currentShaderProgram)
}

function main() {
    init()

    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    
    gl.enableVertexAttribArray(aVertexPositionLoc)
    gl.enableVertexAttribArray(aVertexNormalLoc)

    let renderObject = function(object, baseMatrix) {
        const mesh = object.mesh
        mesh.setVertexAttributePointers(aVertexPositionLoc, aVertexNormalLoc)

        // World Matrix
        const worldMat = glMatrix.mat4.create()
        glMatrix.mat4.translate(worldMat, baseMatrix, [object.position.x, object.position.y, object.position.z, 0])
        glMatrix.mat4.rotate(worldMat, worldMat, object.rotationY, [0, 1, 0])
        glMatrix.mat4.scale(worldMat, worldMat, [object.size, object.size, object.size])
        gl.uniformMatrix4fv(uWorldMatLoc, false, worldMat)
        // Color
        gl.uniform3f(uColorLoc, object.color.r, object.color.g, object.color.b)

        gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0)
    }

    renderLoop()
    function renderLoop() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.clearColor(0.0, 0.0, 0.0, 1.0)

        const baseMatrix = glMatrix.mat4.create()
        // Scene transformation
        glMatrix.mat4.translate(baseMatrix, baseMatrix, [scene.pos.x, scene.pos.y, scene.pos.z, 0])
        glMatrix.mat4.rotate(baseMatrix, baseMatrix, scene.rotY, [0, 1, 0])
        // Pedestal transformation
        glMatrix.mat4.translate(baseMatrix, baseMatrix, [pedestal.pos.x, pedestal.pos.y, pedestal.pos.z, 0])
        glMatrix.mat4.rotate(baseMatrix, baseMatrix, pedestal.rotY, [0, 1, 0])

        // Project
        const projectionMatrix = glMatrix.mat4.create()
        glMatrix.mat4.perspective(projectionMatrix, (60 * Math.PI) / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);
        gl.uniformMatrix4fv(uProjectMatLoc, false, projectionMatrix)

        // View
        const viewMatrix = glMatrix.mat4.create()
        /* To move the camera in same direction,
        you need to move all objects in the opposite direction,
        so the camera position with a minus sign */
        glMatrix.mat4.translate(viewMatrix, viewMatrix, [-camera.pos.x, -camera.pos.y, -camera.pos.z, 0])
        glMatrix.mat4.rotate(viewMatrix, viewMatrix, camera.rotX, [1, 0, 0])
        gl.uniformMatrix4fv(uViewMatLoc, false, viewMatrix)

        // Lights
        gl.uniform1f(uAmbientIntensityLoc, ambientIntensity)
        gl.uniform3f(uLightDirectionLoc, -1, -1, 0)
        gl.uniform3f(uLightPositionLoc, lightCube.position.x, lightCube.position.y, lightCube.position.z)
        gl.uniform1f(uDiffuseIntensityLoc, diffuseIntensity)
        gl.uniform1f(uLightSizeLoc, lightSize)
        
        objects.forEach(object => {
            renderObject(object, baseMatrix)
        })

        const lightCubeMatrix = glMatrix.mat4.create()
        // glMatrix.mat4.translate(lightCubeMatrix, lightCubeMatrix, [scene.pos.x, scene.pos.y, scene.pos.z, 0])
        const sh = currentShaderProgram
        setShaderProgram(lampShaderProgram)
        renderObject(lightCube, lightCubeMatrix)
        setShaderProgram(sh)

        requestAnimationFrame(renderLoop)
    }
}

function bindInput() {
    document.getElementById("sceneRange").addEventListener("input", (event) => {
        scene.rotY = event.target.value / 60
    })

    document.getElementById("pedestalRange").addEventListener("input", (event) => {
        pedestal.rotY = event.target.value / 60
    })

    document.getElementById("redRange").addEventListener("input", (event) => {
        redCube.rotationY = event.target.value / 50
    })

    document.getElementById("greenRange").addEventListener("input", (event) => {
        greenCube.rotationY = event.target.value / 50
    })

    document.getElementById("yellowRange").addEventListener("input", (event) => {
        yellowCube.rotationY = event.target.value / 50
    })

    document.getElementById("blueRange").addEventListener("input", (event) => {
        blueCube.rotationY = event.target.value / 50
    })

    document.getElementById("ambientRange").addEventListener("input", (event) => {
        ambientIntensity = event.target.value
    })

    document.getElementById("diffuseRange").addEventListener("input", (event) => {
        diffuseIntensity = event.target.value * 10
    })

    document.getElementById("lightSizeRange").addEventListener("input", (event) => {
        lightSize = event.target.value * 10
    })

    document.getElementById("lightXRange").addEventListener("input", (event) => {
        lightCube.position.x = event.target.value * 20 - 10 // [-10, 10]
    })

    document.getElementById("lightYRange").addEventListener("input", (event) => {
        lightCube.position.y = event.target.value * 20 - 10 // [-10, 10]
    })

    document.getElementById("lightZRange").addEventListener("input", (event) => {
        lightCube.position.z = event.target.value * 20 - 10 // [-10, 10]
    })

    document.getElementById("lightingModelSelect").addEventListener("change", (event) => {
        const model = event.target.value
        if (model == "Lambert") {
            setShaderProgram(lambertShaderProgram)
            console.log("Lambert shader is set")
        } else if (model == "Phong") {
            setShaderProgram(phongShaderProgram)
            // setShaderProgram(lampShaderProgram)
            console.log("Phong shader is set")
        } else {
            console.log("Unknown model: ", model)
        }
    })
}







