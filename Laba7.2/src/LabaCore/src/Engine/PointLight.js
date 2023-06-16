class PointLight extends GameObject {
    constructor(position, size = 5.0, color = {r: 1.0, g: 1.0, b: 1.0}) {
        super(position)
        this._size = size
        this._color = color

        PointLight.INSTANCES.push(this)
    }

    get position() {
        return this._position
    }

    set position(value) {
        this._position = value
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
    
}

PointLight.INSTANCES = []
PointLight.GET_POSITION_ARRAY = function() {
    const result = []
    PointLight.INSTANCES.forEach(pointLight => {
        result.push(pointLight.position.x)
        result.push(pointLight.position.y)
        result.push(pointLight.position.z)
    })
    return result
}