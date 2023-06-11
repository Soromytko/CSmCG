Texture.COUNTER = 0

class Texture {
    constructor(image) {
        image = document.getElementById('crate-image')

        this._texture = gl.createTexture();
        this._count = Texture.COUNTER
        Texture.COUNTER += 1

        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE,
            image
        );
    }

    bind(index) {
        gl.uniform1f(index, this._count)
        gl.bindTexture(gl.TEXTURE_2D, this._texture)
    }
}