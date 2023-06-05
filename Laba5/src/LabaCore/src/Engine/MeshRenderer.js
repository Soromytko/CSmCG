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

    beind() {
        const mesh = this._mesh
        mesh.attributes.forEach(attribute => {
            attribute.enable()
        })
    }

    unbind() {
        const mesh = this._mesh
        mesh.attributes.forEach(attribute => {
            attribute.disable()
        })
    }

    render() {
        this._material.bind()
        
        // specifying shader uniforms
        
        this._mesh.vertexArray.draw()
    }
}

