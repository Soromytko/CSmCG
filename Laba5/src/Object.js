class Object {
    constructor(position, size = 1, color) {
        this._position = position
        this._rotationY = 0
        this._size = size
        this._color = color

        this._parent
        this._children = []
        this._hierarchyIndex = 0

        this._matrix

        // Components
        this._meshRenderer
    }

    get position() {
        return this._position
    }

    set position(value) {
        this._position = value
    }

    get rotationY() {
        return this._rotationY
    }

    set rotationY(value) {
        this._rotationY = value
    }

    get size() {
        return this._size
    }

    set size(value) {
        this._size = value
    }

    get color() {
        return this._color
    }

    set color(value) {
        this._color = value
    }

    get mesh() {
        return this._mesh
    }

    get material() {
        return this._material
    }

    set material(material) {
        this._material = material
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

    get meshRenderer() {
        return this._meshRenderer
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

    render(baseMatrix) {
        gl.useProgram(this._material.shaderProgram)
    }

    _isChildRecursive(maybeChild) {
        if (this._children.indexOf(maybeChild) >= 0) {
            return true;
        }

        for (let i = 0; i < this._children.length; i++) {
            return this._children[i]._isChildRecursive(maybeChild)
        }
    }

}


