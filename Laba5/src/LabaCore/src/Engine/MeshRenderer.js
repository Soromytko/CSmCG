class MeshRenderer {
    constructor(mesh, material) {
        this._mesh = mesh
        this._material = material
    }

    get mesh() {
        return this._mesh
    }

    set mesh(mesh) {
        this._mesh = mesh
    }

    get material() {
        return this._material
    }

    set material(material) {
        this._material = material
    }

    // render() {
    //     const renderer = new Renderer()
    //     renderer.submit(this._material.shader, this._mesh.vertexArray)
    //     this.material.apply()
    //     renderer.render()
    // }
}

