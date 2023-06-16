class CarController {
    constructor(object) {
        this._object = object

        this._movementSpeed = 2
        this._rotationSpeed = 2
        this._move = 0
    }

    _checkCollision() {
        const object = this._object

        object.collider.updatePoints()
        for (let i = 0; i < BoxCollider.COLLIDERS.length; i++) {
            const collider = BoxCollider.COLLIDERS[i]
            if (collider != object.collider) {
                collider.updatePoints()
                lightCube.globalPosition = collider._points[0]
                // console.log(lightCube.globalPosition)
                if (object.collider.isCollisionWith(collider)) {
                    // console.log("COLLISION")
                    return true
                }
            }
        }
        return false
    }

    update() {
        const object = this._object

        const clamp = (value, min, max) => value < min ? min : value > max ? max : value
        const moveTowards = (from, to, delta) => from == to ? to : from < to ? clamp(from + delta, from, to) : clamp(from - delta, to, from)
        
        if (input.getKey('w')) this._move += 0.001 * this._movementSpeed
        else if (input.getKey('s')) this._move -= 0.001 * this._movementSpeed
        else this._move = moveTowards(this._move, 0, 0.001)
        if (input.getKey('q')) this._move = moveTowards(this._move, 0, 0.01)
        
        const direction = object.right
        glMatrix.vec3.mul(direction, direction, [this._move, this._move, this._move])
        
        let rotY = 0
        if (input.getKey('a')) {
            rotY += 1 * this._rotationSpeed
        }
        if (input.getKey('d')) {
            rotY -= 1 * this._rotationSpeed
        }

        const oldPos = glMatrix.vec3.create()
        glMatrix.vec3.copy(oldPos, object.globalPosition)
        const oldRot = glMatrix.vec3.create()
        glMatrix.vec3.copy(oldRot, object.rotation)

        object.moveGlobal(direction[0], direction[1], direction[2])
        object.rotate(0.0, rotY * 0.01, 0.0)

        if (this._checkCollision()) {
            object.globalPosition = oldPos
            // object.rotation = oldRot
        }
    }
}