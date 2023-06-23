class CoinsController {
    constructor(object) {
        this._object = object
    }

    update(car) {
        const object = this._object

        const random = (min, max) => (Math.random() * (max - min) + min)
        const min = -30     
        const max = +30     

        const delta = 2 * Math.PI / 180
        object._children.forEach(child => {
            child.rotate(0, delta, 0)
            if (glMatrix.vec3.distance(car.globalPosition, child.globalPosition) < 3) {
                const newPos = [random(min, max), 2, random(min, max)]
                child.globalPosition = newPos
                console.log("the coin is taken")
            }
        })
    }
}