class CubeObject extends Object {
    constructor(position, size = 1, color) {
        super(position, size, color)
        this._mesh = new CubeMesh()

        this._meshRenderer = new MeshRenderer(new CubeMesh())
    }

}


