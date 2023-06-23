class BoxCollider extends GameObject {
    constructor(position, rotation, scale){
        super(position, rotation, scale);
        BoxCollider.COLLIDERS.push(this);
    }
    updatePoints() {
        for(let i = 0; i < this._points.length; i++)glMatrix.vec3.translateMat4(this._points[i], this._points[i], this._matrix);
    }
    contains(globalPoint) {
        const localPoint = glMatrix.vec3.create();
        glMatrix.vec3.sub(localPoint, globalPoint, this._globalPosition);
        const hWidth = this._scale[0] * 0.5;
        const hHeight = this._scale[1] * 0.5;
        const hDepth = this._scale[2] * 0.5;
        return localPoint[0] >= -hWidth && localPoint[0] <= hWidth && localPoint[1] >= -hHeight && localPoint[1] <= hHeight && localPoint[2] >= -hDepth && localPoint[2] <= hDepth;
    }
    isCollisionWith(collider) {
        for(let i = 0; i < this._points.length; i++){
            if (collider.contains(this._points[i])) return true;
        }
        return false;
    }
}
BoxCollider.COLLIDERS = [];

//# sourceMappingURL=index.dc4874ec.js.map
