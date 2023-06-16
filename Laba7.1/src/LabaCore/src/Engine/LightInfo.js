class LightInfo extends GameObject {
    constructor(position, rotation) {
        super(position, rotation)

        this.size = 5
        this.type = 0
        LightInfo.INSTANCES.push(this)
    }
}

LightInfo.INSTANCES = []