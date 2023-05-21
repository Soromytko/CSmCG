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
var redCube = new CubeObject({x: -2, y: 0, z: 0}, 0.2, {r: 1, g: 0, b: 0})
var greenCube = new CubeObject({x: -1, y: 0, z: 0}, 0.4, {r: 0, g: 1, b: 0})
var yellowCube = new CubeObject({x: 0, y: 0, z: 0}, 0.5, {r: 1, g: 1, b: 0})
var blueCube = new CubeObject({x: 1, y: 0, z: 0}, 0.3, {r: 0, g: 0, b: 1})
var debugCube = new CubeObject({x: 0, y: 2, z: 0}, 0.3, {r: 1, g: 0, b: 1})
// var lightCube = new CubeObject({x: 0, y: 2, z: -5}, 0.1, {r: 1, g: 1, b: 1})
var lightCube = new CubeObject({x: 0, y: 2, z: -5}, 1, {r: 1, g: 1, b: 1})
var lightSize = 7

var objects = [
    redCube,
    greenCube,
    yellowCube,
    blueCube,
    blueCube,
    debugCube,
]

var lambertMaterial
var phongMaterial
var lampMaterial

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
    lambertMaterial = new LambertMaterial()
    if (!lambertMaterial.build()) {
        console.error("Lambert shader error")
        throw new Error()
    }

    lampMaterial = new LampMaterial()
    if (!lampMaterial.build()) {
        console.log("Lamp shader error")
        throw new Error()
    }

    phongMaterial = new PhongMaterial()
    if (!phongMaterial.build()) {
        console.log("Phong shader error")
        throw new Error()
    }

    // setMaterial(lambertMaterial)
    setMaterial(lampMaterial)

    bindInput()
}

function setMaterial(material) {
    objects.forEach(object => {
        object.material = material
    })

    // debugCube.material = lampMaterial
}

function main() {
    init()

    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    renderLoop()
    function renderLoop() {
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

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
       
        // View
        const viewMatrix = glMatrix.mat4.create()
        /* To move the camera in same direction,
        you need to move all objects in the opposite direction,
        so the camera position with a minus sign */
        glMatrix.mat4.translate(viewMatrix, viewMatrix, [-camera.pos.x, -camera.pos.y, -camera.pos.z, 0])
        glMatrix.mat4.rotate(viewMatrix, viewMatrix, camera.rotX, [1, 0, 0])
        
        objects.forEach(object => {
            // World Matrix
            const worldMat = glMatrix.mat4.create()
            glMatrix.mat4.translate(worldMat, baseMatrix, [object.position.x, object.position.y, object.position.z, 0])
            glMatrix.mat4.rotate(worldMat, worldMat, object.rotationY, [0, 1, 0])
            glMatrix.mat4.scale(worldMat, worldMat, [object.size, object.size, object.size])
            
            const material = object.material
            material.use()

            gl.uniformMatrix4fv(material._uProjectMatLoc, false, projectionMatrix)
            gl.uniformMatrix4fv(material._uViewMatLoc, false, viewMatrix)
            gl.uniformMatrix4fv(material._uWorldMatLoc, false, worldMat)
            // Lights
            gl.uniform1f(material._uAmbientIntensityLoc, ambientIntensity)
            gl.uniform3f(material._uLightDirectionLoc, -1, -1, 0)
            gl.uniform3f(material._uLightPositionLoc, lightCube.position.x, lightCube.position.y, lightCube.position.z)
            gl.uniform1f(material._uDiffuseIntensityLoc, diffuseIntensity)
            gl.uniform1f(material._uLightSizeLoc, lightSize)
            // Color
            gl.uniform3f(material._uColorLoc, object.color.r, object.color.g, object.color.b)
            
            const mesh = object.mesh
            mesh.setVertexAttributePointers(material._aVertexPositionLoc, material._aVertexNormalLoc)

            // console.log(material._uColorLoc)

            gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0)
        })

        // const lightCubeMatrix = glMatrix.mat4.create()
        // // glMatrix.mat4.translate(lightCubeMatrix, lightCubeMatrix, [scene.pos.x, scene.pos.y, scene.pos.z, 0])
        // const sh = currentShaderProgram
        // setMaterial(lampMaterial)
        // renderObject(lightCube, lightCubeMatrix)
        // setMaterial(sh)

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
            setMaterial(lambertMaterial)
            console.log("Lambert shader is set")
        } else if (model == "Phong") {
            setMaterial(phongMaterial)
            // setMaterial(lampMaterial)
            console.log("Phong shader is set")
        } else {
            console.log("Unknown model: ", model)
        }
    })
}







