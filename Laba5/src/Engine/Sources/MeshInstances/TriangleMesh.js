// Singleton class
class TriangleMesh extends Mesh {
    constructor() {
        super()

        if (TriangleMesh._instance) {
            return TriangleMesh._instance
        }

        this._vertices = [
            // Front face
            -0.5, -0.5, +0.0,
            +0.5, -0.5, +0.0,
            +0.5, +0.5, +0.0,
        ]

        this._normals = [
            // Front face
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ]
    
        this._indices = [
            0, 1, 2,
        ]

        // this._createBuffers()
    
        TriangleMesh._instance = this
    }

}


