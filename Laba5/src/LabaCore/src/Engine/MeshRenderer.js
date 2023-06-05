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

    set shader(shader) {
        this._shader = shader
    }

    render() {
        const vertexArray = this._mesh.vertexArray
        const shader = this._shader

        const renderer = new Renderer()
        renderer.submit(shader, vertexArray)
        renderer.render()
        return


        this._material.bind()
        
        // specifying shader uniforms
        
        this._mesh.vertexArray.draw()
    }
}

