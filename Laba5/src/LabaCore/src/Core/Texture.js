class Texture {
    constructor(image) {
        image = document.getElementById('crate-image')

        // Texture Block (TEXTURE0, TEXTURE1, TEXTURE2, ...)
        this._counter = Texture.COUNTER
        Texture.COUNTER += 1
        
        this._texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + this._counter);
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

    bind(slot) {
        // gl.uniform1f(slot, this._counter)
        gl.activeTexture(gl.TEXTURE0 + this._counter)
        gl.bindTexture(gl.TEXTURE_2D, this._texture)
    }

    unbind() {

    }
}

Texture.COUNTER = 0