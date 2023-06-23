class CarController {
    constructor(object){
        this._object = object;
        this._move = 0;
    }
    update() {
        const object = this._object;
        for(let i = 0; i < BoxCollider.COLLIDERS.length; i++){
            const collider = BoxCollider.COLLIDERS[i];
            if (collider != object.collider) {
                if (object.collider.isCollisionWith(collider)) return;
            }
        }
        const clamp = (value, min, max)=>value < min ? min : value > max ? max : value;
        const moveTowards = (from, to, delta)=>from == to ? to : from < to ? clamp(from + delta, from, to) : clamp(from - delta, to, from);
        if (input.getKey("w")) this._move += 0.001;
        else if (input.getKey("s")) this._move -= 0.001;
        else this._move = moveTowards(this._move, 0, 0.001);
        if (input.getKey("q")) this._move = moveTowards(this._move, 0, 0.01);
        const direction = object.right;
        glMatrix.vec3.mul(direction, direction, [
            this._move,
            this._move,
            this._move
        ]);
        object.moveGlobal(direction[0], direction[1], direction[2]);
        let rotY = 0;
        if (input.getKey("a")) rotY += 1;
        if (input.getKey("d")) rotY -= 1;
        object.rotate(0.0, rotY * 0.01, 0.0);
    }
}

//# sourceMappingURL=index.3e05f1f8.js.map
