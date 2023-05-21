class CubeObject extends Object {
    constructor(position, size = 1, color) {
        super(position, size, color)
        this._mesh = new CubeMesh()
    }

}


