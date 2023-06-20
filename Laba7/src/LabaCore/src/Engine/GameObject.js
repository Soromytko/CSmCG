class GameObject {
    constructor(position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
        this._globalPosition = glMatrix.vec3.create()
        glMatrix.vec3.copy(this._globalPosition, position)
        this._localPosition = glMatrix.vec3.create()
        glMatrix.vec3.copy(this._localPosition, position)
        this._rotation = glMatrix.vec3.create()
        glMatrix.vec3.copy(this._rotation, rotation)
        this._scale = scale
        this._matrix = glMatrix.mat4.create()
        this._updateMatrix()

        this._parent
        this._children = []
        this._hierarchyIndex = 0

        // Components
        this._meshRenderer
    }
    
    get globalPosition() {
        return this._globalPosition
    }

    set globalPosition(value) {
        this._globalPosition = glMatrix.vec3.create()
        glMatrix.vec3.copy(this._globalPosition, value)

        // this._localPosition = this._parent ? value - this._parent._globalPosition : this._globalPosition
        if (this._parent) {
            // DOTO
            glMatrix.vec3.sub(this._localPosition, value, this._parent._globalPosition)
            // this._globalPosition = glMatrix.vec3.create()
            // glMatrix.mat4.getTranslation(this._globalPosition, this._matrix)
        } else {
            glMatrix.vec3.copy(this._localPosition, this._globalPosition)
        }

        this._updateMatrix()
        this._updateChildrenRecursive()
    }

    get localPosition() {
        return this._localPosition
    }

    set localPosition(value) {
        this._localPosition = glMatrix.vec3.create()
        glMatrix.vec3.copy(this._localPosition, value)

        this._updateMatrix()
        
        if (this._parent) {
            this._globalPosition = glMatrix.vec3.create()
            glMatrix.mat4.getTranslation(this._globalPosition, this._matrix)
        } else {
            glMatrix.vec3.copy(this._globalPosition, this._localPosition)
        }

        this._updateChildrenRecursive()
    }

    get rotation() {
        return this._rotation
    }

    set rotation(value) {
        this._rotation = glMatrix.vec3.create()
        glMatrix.vec3.copy(this._rotation, value)
        
        // TODO
        this._updateMatrix()
        this._updateChildrenRecursive()
        // this.localPosition = this._localPosition
    }

    get scale() {
        return this._scale
    }

    set scale(value) {
        this._scale = value
    }

    get matrix() {
        return this._matrix
    }

    set matrix(newMatrix) {
        this._matrix = newMatrix
    }

    get meshRenderer() {
        return this._meshRenderer
    }

    set meshRenderer(value) {
        this._meshRenderer = value
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

        glMatrix.vec3.sub(this._localPosition, this._globalPosition, this._parent._globalPosition)
        this.localPosition = this._localPosition
    }

    get forward() {
        const dir = [0.0, 0.0, 1.0] // Forward direction
        
        const destMat = glMatrix.mat4.create()
        glMatrix.mat4.translate(destMat, this._matrix, dir)
        
        const dest = glMatrix.vec3.create()
        glMatrix.mat4.getTranslation(dest, destMat)
        
        const result = glMatrix.vec3.create()
        glMatrix.vec3.sub(result, dest, this._globalPosition)

        return result
    }

    move(x, y, z) {
        const offset = glMatrix.vec3.create()
        glMatrix.vec3.set(offset, x, y, z)
        const newPos = glMatrix.vec3.create()
        glMatrix.vec3.add(newPos, this._localPosition, offset)
        this.localPosition = newPos
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
        const maybeParentMatrix = this._parent ? this._parent.matrix : glMatrix.mat4.create()

        const pos = this._localPosition
        glMatrix.mat4.translate(this._matrix, maybeParentMatrix, pos)

        const rot = this._rotation
        glMatrix.mat4.rotate(this._matrix, this._matrix, rot[1], [0, 1, 0])

        const scale = this._scale
        glMatrix.mat4.scale(this._matrix, this._matrix, scale)
    }

    _updateChildrenRecursive() {
        this._children.forEach(child => {
            // It updates child.globalPosition and child.matrix
            child.localPosition = child._localPosition
            // child.setLocalPosition(this._localPosition)
            // child.localRotation = child._localRotation
        })
    }

    // _getPositionByMatrix() {
    //     const vec3 = glMatrix.vec3.create()
    //     const matrix = this._matrix
    //     glMatrix.mat4.getTranslation(vec3, matrix)
    //     return {x: vec3[0], y: vec3[1], z: vec3[2]}
    // }

    // _calGlobalPos() {
    //     const m = this._parent
    //     const v = [1, 1, 1, 1]
    //     const u = [0, 0, 0, 0]
    //     u[0] = m[0] * v[0] + m[4] * v[1] + m[8]  * v[2] + m[12] * v[3]
    //     u[1] = m[1] * v[0] + m[5] * v[1] + m[9]  * v[2] + m[13] * v[3]
    //     u[2] = m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3]
    //     u[3] = m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3]
    //     return u
    // }

}


