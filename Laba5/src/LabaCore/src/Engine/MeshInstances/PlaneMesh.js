// Singleton class
class PlaneMesh extends Mesh {
    constructor() {
        super()

        if (PlaneMesh._instance) {
            return PlaneMesh._instance
        }

        this._vertices = [
            -0.5, +0.0, -0.5,
            -0.5, +0.0, +0.5,
            +0.5, +0.0, +0.5,
            +0.5, +0.0, -0.5,
        ]

        this._normals = [
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
        ]

        this._uv = [
            0, 0,
            0, 1,
            1, 1,
            1, 0,
        ]
    
        this._indices = [
            0, 1, 2,
            0, 2, 3,
        ]

        this._createBuffers()
    
        PlaneMesh._instance = this
    }

}


