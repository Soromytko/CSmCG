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

function createShaderProgram(gl, vertexShader, fragmentShader) {
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

var gl

var scene = {
    pos: {x: 0, y: 0, z: -5},
    rotY: 0
}
var pedestal = {
    pos: {x: 0, y: 0, z: -3},
    rotY: 0,
}
var ambient = 0.1
var redCube = new Cube({x: -2, y: 0, z: 0}, 0.2, {r: 1, g: 0, b: 0})
var greenCube = new Cube({x: -1, y: 0, z: 0}, 0.4, {r: 0, g: 1, b: 0})
var yellowCube = new Cube({x: 0, y: 0, z: 0}, 0.5, {r: 1, g: 1, b: 0})
var orangeCube = new Cube({x: 1, y: 0, z: 0}, 0.3, {r: 1, g: 0.6, b: 0})
var lightCube = new Cube({x: 0, y: 2, z: 0}, 0.1, {r: 1, g: 1, b: 1})

var objects = [
    new Cube({x: 0, y: 1, z: 0}, 0.2, {r: 1, g: 0, b: 1}),
    redCube,
    greenCube,
    yellowCube,
    orangeCube,
]


 // Initialization =========================================================
 var vertSource = `
    precision mediump float;
    attribute vec3 vertexPosition;
    attribute vec3 vertexNormal;

    uniform float u_Size;
    uniform mat4 u_ProjectMat;
    uniform mat4 u_mLocal;

    // Lights
    uniform vec3 u_LightPosition;
    uniform vec3 u_LightDirection;

    varying float v_diffuseColor;

    void main(void)
    {
        vec4 vertexGlobalPosition = u_mLocal * vec4(vertexPosition * u_Size, 1.0);
        gl_Position = u_ProjectMat * u_mLocal * vec4(vertexPosition * u_Size, 1.0);

        vec3 directionToLight = u_LightPosition - vertexGlobalPosition.xyz;
        vec3 rotatedNormal = (u_mLocal * vec4(vertexNormal, 1.0)).xyz - (u_mLocal * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        // rotatedNormal = vertexNormal;
        float diff = max(0.0, dot(normalize(directionToLight), normalize(rotatedNormal)));
        v_diffuseColor = diff / length(directionToLight) * 5.0;
    }
 `
 
 var fragSource = `
    precision mediump float;

    uniform vec4 u_Color;
    uniform float u_AmbientStrength;

    varying float v_diffuseColor;
 
    void main()
    {
        vec3 lightColor = vec3(1.0, 1.0, 1.0);
        vec4 ambient = vec4(lightColor * u_AmbientStrength, 1.0);
        // gl_FragColor = ambient * u_Color;
        // gl_FragColor = v_diffuseColor * u_Color;
        gl_FragColor = (ambient + v_diffuseColor) * u_Color;
    }
 `

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

    // CubeMesh is a singleton class, call this for an instance
    new CubeMesh().createBuffers(gl)

    bindInput()
 }

function main() {
    init()

    const vertShader = compileShader(gl, gl.VERTEX_SHADER, vertSource)
    const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragSource)

    if (!vertShader || !fragShader)
        throw new Error()

    var shaderProgram = createShaderProgram(gl, vertShader, fragShader)

    if (!shaderProgram)
        throw new Error()
   
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    

    gl.useProgram(shaderProgram)
    const uProjectMatLoc = gl.getUniformLocation(shaderProgram, 'u_ProjectMat')
    const uLocal = gl.getUniformLocation(shaderProgram, 'u_mLocal')
    const uSizeLocation = gl.getUniformLocation(shaderProgram, "u_Size")
    const uColorLocation = gl.getUniformLocation(shaderProgram, "u_Color")
    const u_AmbientLocation = gl.getUniformLocation(shaderProgram, "u_AmbientStrength")
    const uLightPositionLoc = gl.getUniformLocation(shaderProgram, "u_LightPosition")
    const uLightDirectionLocation = gl.getUniformLocation(shaderProgram, "u_LightDirection")
    const vertexPositionAttribLoc = gl.getAttribLocation(shaderProgram, 'vertexPosition')
    const vertexNormalAttribLoc = gl.getAttribLocation(shaderProgram, 'vertexNormal')
    
    gl.enableVertexAttribArray(vertexPositionAttribLoc)
    gl.enableVertexAttribArray(vertexNormalAttribLoc)

    renderObject = function(object, baseMatrix) {
        const mesh = object.mesh
        mesh.setVertexAttributePointers(vertexPositionAttribLoc, vertexNormalAttribLoc)

        // Local Matrix
        const localMat = glMatrix.mat4.create()
        glMatrix.mat4.translate(localMat, baseMatrix, [object.position.x, object.position.y, object.position.z, 0])
        glMatrix.mat4.rotate(localMat, localMat, object.rotationY, [0, 1, 0])
        gl.uniformMatrix4fv(uLocal, false, localMat)
        // Size
        gl.uniform1f(uSizeLocation, object.size)
        // Color
        gl.uniform4f(uColorLocation, object.color.r, object.color.g, object.color.b, 1)

       

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

        const projectionMatrix = glMatrix.mat4.create()
        glMatrix.mat4.perspective(projectionMatrix, (60 * Math.PI) / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);
        gl.uniformMatrix4fv(uProjectMatLoc, false, projectionMatrix)

        // Lights
        gl.uniform1f(u_AmbientLocation, ambient)
        gl.uniform3f(uLightDirectionLocation, -1, -1, 0)
        gl.uniform3f(uLightPositionLoc, lightCube.position.x, lightCube.position.y, lightCube.position.z)
        
        objects.forEach(object => {
            renderObject(object, baseMatrix)
        })

        const lightCubeMatrix = glMatrix.mat4.create()
        glMatrix.mat4.translate(lightCubeMatrix, lightCubeMatrix, [scene.pos.x, scene.pos.y, scene.pos.z, 0])
        renderObject(lightCube, lightCubeMatrix)

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

    document.getElementById("orangeRange").addEventListener("input", (event) => {
        orangeCube.rotationY = event.target.value / 50
    })

    document.getElementById("ambientRange").addEventListener("input", (event) => {
        ambient = event.target.value
    })

    document.getElementById("lightXRange").addEventListener("input", (event) => {
        lightCube.position.x = event.target.value
    })

    document.getElementById("lightYRange").addEventListener("input", (event) => {
        lightCube.position.y = event.target.value
    })

    document.getElementById("lightZRange").addEventListener("input", (event) => {
        lightCube.position.z = event.target.value
    })
}







