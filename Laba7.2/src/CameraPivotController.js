class CameraPivotController {
    constructor(object) {
        this._object = object

        this._rot = {x: 0.0, y: 0.0}
    }

    update() {
        const h = input.getKey("A") ? -1.0 : input.getKey("D") ? 1.0 : 0.0
        const right = {
            x: Math.cos(this._rot.x) * h,
            y: 0.0,
            z: -Math.sin(this._rot.x) * h,
        }
    
        const v = input.getKey("S") ? -1.0 : input.getKey("W") ? 1.0 : 0.0
        const forward = {
            x: Math.sin(this._rot.x) * Math.cos(this._rot.y) * v,
            y: Math.sin(this._rot.y) * v,
            z: Math.cos(this._rot.x) * Math.cos(this._rot.y) * v,
        }
    
        let direction = {
            x: right.x + forward.x,
            y: right.y + forward.y,
            z: right.z + forward.z,
        }
    
        direction = normalize(direction)

        const x = direction.x * 0.05
        const y = -direction.y * 0.05
        const z = -direction.z * 0.05

        this._object.parent.rotation = [-this._rot.y, -this._rot.x, 0]

        if (input.mouse.isHoldButton) {
            this._looking()
        }
    }

    _looking() {
        this._rot.x += input.mouse.delta.x * 0.01
        this._rot.y += input.mouse.delta.y * 0.01

        const clamp = (value, min, max) => value < min ? min : value > max ? max : value
        const deg2Rad = (deg) => deg * Math.PI / 180

        this._rot.y = clamp(this._rot.y, deg2Rad(15), deg2Rad(75))
    }
}