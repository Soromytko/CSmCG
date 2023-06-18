class GameObject {
    constructor(position = {x: 0, y: 0, z: 0}, scale = {x: 1, y: 1, z: 1}) {
        this._position = position
        this._rotation = {x: 0, y: 0, z: 0}
        this._scale = scale

        this._parent
        this._children = []
        this._hierarchyIndex = 0

        // Components
        this._meshRenderer
        
        this._matrix
    }

    get position() {
        return this._position
    }

    set position(value) {
        this._position = value
    }

    get globalPosition() {
        if (!this._parent) {
            return this._position
        }
        const parentGlobalPosition = this._parent.globalPosition

        return {
            x: parentGlobalPosition.x + this._position.x,
            y: parentGlobalPosition.y + this._position.y,
            z: parentGlobalPosition.z + this._position.z,
        }
    }

    get rotation() {
        return this._rotation
    }

    set rotation(value) {
        this._rotation = value
    }

    get scale() {
        return this._scale
    }

    set scale(value) {
        this._scale = value
    }

    get meshRenderer() {
        return this._meshRenderer
    }

    set meshRenderer(value) {
        this._meshRenderer = value
    }

    get matrix() {
        return this._matrix
    }

    set matrix(newMatrix) {
        this._matrix = newMatrix
    }

    get parent() {
        return this._parent
    }

    set parent(newParent) {
        if (newParent) {
            if (newParent == this) {
                console.log("The new parent object is the same object")
                return
            }

            if (this._isChildRecursive(newParent)) {
                console.log("The new parent object is a child of this object")
                return
            }
            newParent._addChild(this)
        }

        if (this._parent) {
            this._parent._removeChild(this)
        }
        
        this._parent = newParent
    }

    _addChild(newChild) {
        if (!newChild) {
            console.log("The new child object is undefined")
            return
        }

        // if (newChild._parent) {
        //     console.log("The parent of the new child is not null")
        // }

        // if (newChild == this) {
        //     console.log("The new child and the parent are the same object")
        //     return
        // }

        const index = this._children.indexOf(newChild)
        if (index < 0) {
            this._children.push(newChild)
        }
        
    }

    _removeChild(maybeChild) {
        if (!maybeChild) {
            console.log("The child object is undefined")
            return
        }

        const index = this._children.indexOf(maybeChild)
        if (index >= 0) {
            this._children.splice(index, 1)
            // maybeChild._parent = undefined
        }
    }

    _isChildRecursive(maybeChild) {
        if (this._children.indexOf(maybeChild) >= 0) {
            return true;
        }

        for (let i = 0; i < this._children.length; i++) {
            return this._children[i]._isChildRecursive(maybeChild)
        }
    }

    _updateMatrix() {
        this._globalPosition = _calGlobalPos()
    }

    _calGlobalPos() {
        const m = this._parent
        const v = [1, 1, 1, 1]
        const u = [0, 0, 0, 0]
        u[0] = m[0] * v[0] + m[4] * v[1] + m[8]  * v[2] + m[12] * v[3];
        u[1] = m[1] * v[0] + m[5] * v[1] + m[9]  * v[2] + m[13] * v[3];
        u[2] = m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3];
        u[3] = m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3];
        return u
    }

}


