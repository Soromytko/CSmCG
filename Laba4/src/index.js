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
        gl_Position = u_ProjectMat * u_mLocal * vec4(vertexPosition * u_Size, 1.0);

        vec3 directionToLight = -u_LightDirection;
        vec3 rotatedNormal = (u_ProjectMat * u_mLocal * vec4(vertexNormal, 1.0)).xyz;
        v_diffuseColor = max(0.0, dot(normalize(directionToLight), normalize(rotatedNormal)));
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

function main() {
    var canvas = document.getElementById('canvas')
    var gl = canvas.getContext('webgl')

    if (!canvas) {
        alert("Canvas not found")
        throw new Error()
    }

    if (!gl) {
        alert("WebGL initialization error")
        throw new Error()
    }

    bindInput()

    const vertShader = compileShader(gl, gl.VERTEX_SHADER, vertSource)
    const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragSource)

    if (!vertShader || !fragShader)
        throw new Error()

    var shaderProgram = createShaderProgram(gl, vertShader, fragShader)

    if (!shaderProgram)
        throw new Error()

    //Red
    redCube.attachShaderProgram(shaderProgram)
    redCube.createBuffers(gl)

    // Green
    greenCube.attachShaderProgram(shaderProgram)
    greenCube.createBuffers(gl)

    // Green
    yellowCube.attachShaderProgram(shaderProgram)
    yellowCube.createBuffers(gl)

    // Orange
    orangeCube.attachShaderProgram(shaderProgram)
    orangeCube.createBuffers(gl)
    
   
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    render()
    
    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.clearColor(0.0, 0.0, 0.0, 1.0)

        const baseMatrix = glMatrix.mat4.create()
        // Scene
        glMatrix.mat4.translate(baseMatrix, baseMatrix, [scene.pos.x, scene.pos.y, scene.pos.z, 0])
        glMatrix.mat4.rotate(baseMatrix, baseMatrix, scene.rotY, [0, 1, 0])
        // Pedestal
        glMatrix.mat4.translate(baseMatrix, baseMatrix, [pedestal.pos.x, pedestal.pos.y, pedestal.pos.z, 0])
        glMatrix.mat4.rotate(baseMatrix, baseMatrix, pedestal.rotY, [0, 1, 0])

        redCube.render(gl, baseMatrix, ambient)
        greenCube.render(gl, baseMatrix, ambient)
        yellowCube.render(gl, baseMatrix, ambient)
        orangeCube.render(gl, baseMatrix, ambient)

        requestAnimationFrame(render)
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
        redCube.rotation = event.target.value / 50
    })

    document.getElementById("greenRange").addEventListener("input", (event) => {
        greenCube.rotation = event.target.value / 50
    })

    document.getElementById("yellowRange").addEventListener("input", (event) => {
        yellowCube.rotation = event.target.value / 50
    })

    document.getElementById("orangeRange").addEventListener("input", (event) => {
        orangeCube.rotation = event.target.value / 50
    })

    document.getElementById("ambientRange").addEventListener("input", (event) => {
        ambient = event.target.value
    })
}







