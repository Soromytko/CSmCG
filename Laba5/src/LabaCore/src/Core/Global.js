const gl = getGl()

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

const POSITION_ATTRIBUTE_LOCATION = 0
const NORMAL_ATTRIBUTE_LOCATION = 1
const COLOR_ATTRIBUTE_LOCATION = 2

const ATTRIBUTE_TYPES = {
    VEC3: 4 * 3,
}

const UNIFORM_TYPES = {
    FLOAT_1F:   "FLOAT_1F",
    FLOAT_2F:   "FLOAT_2F",
    FLOAT_3F:   "FLOAT_3F",
    MAT_4F:     "MAT_4F",
}

function loadFile(path) {
    const url = 'test.txt'

    // fetch('http://localhost/test.txt')
    fetch(url)
    .then(response => response.text())
    .then((data) => {
    console.log(data)
  })
}