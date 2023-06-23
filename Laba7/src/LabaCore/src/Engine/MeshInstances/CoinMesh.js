class CoinMesh extends Mesh {
    constructor() {
        super()

        if (CoinMesh.INSTANCE) {
            return CoinMesh.INSTANCE
        }

        const count = 25
        const delta = 360.0 / count * Math.PI / 180
        this._vertices.push(0.0)
        this._vertices.push(0.0)
        this._vertices.push(0.0)
        for (let i = 0; i < count; i++) {
            const angle = delta * i
            this._vertices.push(0.0)
            this._vertices.push(Math.cos(angle))
            this._vertices.push(Math.sin(angle))
        }
        // console.log(this._vertices)

        for(let i = 1; i < this._vertices.length / 3 - 1; i++) {
            this._indices.push(0)
            this._indices.push(i)
            this._indices.push(i + 1)
        }
        this._indices.push(0)
        this._indices.push(this._vertices.length / 3 - 1)
        this._indices.push(1)
        // console.log(this._indices)

        // const t = [0, 1, 2, 0, 2, 3]
        const t = [0, 1, 2, 0, 2, 3, 0, 3, 1]
        // console.log(t)
        // this._indices = t


        this._normals = new Array(this._vertices.length)
        this._uv = new Array(this._vertices.length)


        this._createBuffers()

        CoinMesh.INSTANCE = this
    }
}