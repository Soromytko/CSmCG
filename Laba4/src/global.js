var gl = getGl()

function getGl() {
    const canvas = document.getElementById('canvas')
    if (!canvas) {
        alert("Canvas not found")
        throw new Error()
    }

    const gl = canvas.getContext('webgl')
    if (!gl) {
        alert("WebGL initialization error")
        throw new Error()
    }

    return gl
}

var VERTEX_ATTRIBUTE
var NORMAL_ATTRIBUTE
var COLOR_ATTRIBYTE

var COLOR_UNIFORM