class Collider extends GameObject {
    constructor(position, rotation, scale) {
        super(position, rotation, scale)

        this._points = []
    }

    isCollisionWith(collider) {
        const matrix1 = this._matrix
        const pointMatrix = glMatrix.mat4.create()
        
        for (let i = 0; i < this._points.length; i++) {
            const localPoint = this._points[i]
            glMatrix.mat4.translate(pointMatrix, matrix1, [point])
            if (collider2.contains(point)) {
                return true
            }
        }

        return false
    }
}

