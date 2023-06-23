const gl = getGl();
function getGl() {
    const canvas = document.getElementById("canvas");
    if (!canvas) {
        alert("Canvas not found");
        throw new Error();
    }
    const gl = canvas.getContext("webgl");
    if (!gl) {
        alert("WebGL initialization error");
        throw new Error();
    }
    return gl;
}
const POSITION_ATTRIBUTE_LOCATION = 0;
const NORMAL_ATTRIBUTE_LOCATION = 1;
const COLOR_ATTRIBUTE_LOCATION = 2;
const ATTRIBUTE_TYPES = {
    VEC3: 12
};
const UNIFORM_TYPES = {
    FLOAT_1F: "FLOAT_1F",
    FLOAT_2F: "FLOAT_2F",
    FLOAT_3F: "FLOAT_3F",
    MAT_4F: "MAT_4F"
};
async function loadFile(path) {
    // const url = 'test.txt'
    const url = path;
    return await fetch(url).then((response)=>response.text()).then((data)=>data);
}

//# sourceMappingURL=index.793b3c35.js.map
