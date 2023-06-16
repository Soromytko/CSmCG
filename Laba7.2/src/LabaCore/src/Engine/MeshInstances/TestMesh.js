class TestMesh extends Mesh {
    constructor() {
        super()

        if (TestMesh._instance) {
            return TestMesh._instance
        }

        this._vertices = [
            -1, 0, 1, 1, 0, 1, 1, 0, -1, -1, 0, -1,
        ]

        this._normals = [
            -0, 1, -0, -0, 1, -0, -0, 1, -0, -0, 1, -0
        ]

        // this._uv = [
        //     0, 0,
        //     0, 1,
        //     1, 1,
        //     1, 0,
        // ]
    
        this._indices = [
            0, 1, 2, 2, 3, 0
        ]

        this._createBuffers()
    
        TestMesh._instance = this
    }

}


