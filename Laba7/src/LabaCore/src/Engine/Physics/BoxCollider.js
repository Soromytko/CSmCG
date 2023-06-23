class BoxCollider extends GameObject {
    constructor(position, rotation, scale) {
        super(position, rotation, scale)

        this._points = []
        this._points.push([-1, -1, -1])
        this._points.push([-1, -1, +1])
        this._points.push([-1, +1, -1])
        this._points.push([-1, +1, +1])
        this._points.push([+1, -1, -1])
        this._points.push([+1, -1, +1])
        this._points.push([+1, +1, -1])
        this._points.push([+1, +1, +1])

        this.updatePoints()

        BoxCollider.COLLIDERS.push(this)
    }

    updatePoints() {
        for (let i = 0; i < this._points.length; i++){
            glMatrix.vec3.transformMat4(this._points[i], BoxCollider.POINTS[i], this._matrix)
        }
    }

    contains(globalPoint) {
        const localPoint = glMatrix.vec3.create()
        glMatrix.vec3.sub(localPoint, globalPoint, this._globalPosition)

        const hWidth = this._scale[0] * 0.5
        const hHeight = this._scale[1] * 0.5
        const hDepth = this._scale[2] * 0.5

        return localPoint[0] >= -hWidth && localPoint[0] <= hWidth &&
            localPoint[1] >= -hHeight && localPoint[1] <= hHeight &&
            localPoint[2] >= -hDepth && localPoint[2] <= hDepth
    }

    isCollisionWith(collider) {
        for (let i = 0; i < this._points.length; i++) {
            if (this.contains(collider._points[i])) {
                return true
            }
        }
        return false
    }
}

BoxCollider.size = 0.5

BoxCollider.POINTS = [
    [-BoxCollider.size, -BoxCollider.size, -BoxCollider.size],
    [-BoxCollider.size, -BoxCollider.size, +BoxCollider.size],
    [-BoxCollider.size, +BoxCollider.size, -BoxCollider.size],
    [-BoxCollider.size, +BoxCollider.size, +BoxCollider.size],
    [+BoxCollider.size, -BoxCollider.size, -BoxCollider.size],
    [+BoxCollider.size, -BoxCollider.size, +BoxCollider.size],
    [+BoxCollider.size, +BoxCollider.size, -BoxCollider.size],
    [+BoxCollider.size, +BoxCollider.size, +BoxCollider.size],
]

BoxCollider.COLLIDERS = []