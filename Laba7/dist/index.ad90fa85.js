function length(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
}
function normalize(vector) {
    const l = length(vector);
    return l == 0 ? {
        x: 0,
        y: 0,
        z: 0
    } : {
        x: vector.x / l,
        y: vector.y / l,
        z: vector.z / l
    };
}
function move(from, to, speed) {
    const delta = {
        x: to.x - from.x,
        y: to.y - from.y,
        z: to.z - from.z
    };
    const l = length(delta);
    if (l == 0) return from;
    const direction = normalize(delta);
    const x = from.x + direction.x * speed * l;
    const y = from.y + direction.y * speed * l;
    const z = from.z + direction.z * speed * l;
    return {
        x: x,
        y: y,
        z: z
    };
}
function cameraScript() {}
class CameraController {
    constructor(object){
        this._object = object;
        this._rot = {
            x: 0.0,
            y: 0.0
        };
    }
    update() {
        const h = input.getKey("A") ? -1 : input.getKey("D") ? 1.0 : 0.0;
        const right = {
            x: Math.cos(this._rot.x) * h,
            y: 0.0,
            z: -Math.sin(this._rot.x) * h
        };
        const v = input.getKey("S") ? -1 : input.getKey("W") ? 1.0 : 0.0;
        const forward = {
            x: Math.sin(this._rot.x) * Math.cos(this._rot.y) * v,
            y: Math.sin(this._rot.y) * v,
            z: Math.cos(this._rot.x) * Math.cos(this._rot.y) * v
        };
        let direction = {
            x: right.x + forward.x,
            y: right.y + forward.y,
            z: right.z + forward.z
        };
        direction = normalize(direction);
        const x = direction.x * 0.05;
        const y = -direction.y * 0.05;
        const z = -direction.z * 0.05;
        this._object.moveGlobal(x, y, z);
        this._object.rotation = [
            -this._rot.y,
            -this._rot.x,
            0
        ];
        if (input.mouse.isHoldButton) this._looking();
    }
    _looking() {
        this._rot.x += input.mouse.delta.x * 0.01;
        this._rot.y += input.mouse.delta.y * 0.01;
    }
}

//# sourceMappingURL=index.ad90fa85.js.map
