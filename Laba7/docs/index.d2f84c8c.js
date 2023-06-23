class Mesh {
    constructor(){
        this._vertexArray = [];
        this._vertices = [];
        this._normals = [];
        this._indices = [];
        this._uv = [];
    }
    get vertices() {
        return this._vertices;
    }
    set vertices(value) {
        this._vertices = value;
    }
    get normals() {
        return this._normals;
    }
    set normals(value) {
        this._normals = value;
    }
    get uv() {
        return this._uv;
    }
    set uv(value) {
        this._uv = value;
    }
    get indices() {
        return this._indices;
    }
    set indices(value) {
        this._indices = value;
    }
    get vertexArray() {
        return this._vertexArray;
    }
    build() {
        this._createBuffers();
    }
    _createBuffers() {
        const vertexPositionBuffer = new VertexBuffer(this._vertices);
        vertexPositionBuffer.setLayoutBuffer(new LayoutBuffer([
            new Attribute(0, 3, gl.FLOAT, gl.FALSE, 0, 0)
        ]));
        const vertexNormalBuffer = new VertexBuffer(this._normals);
        vertexNormalBuffer.setLayoutBuffer(new LayoutBuffer([
            new Attribute(1, 3, gl.FLOAT, gl.FALSE, 0, 0)
        ]));
        const uvBuffer = new VertexBuffer(this._uv);
        uvBuffer.setLayoutBuffer(new LayoutBuffer([
            new Attribute(2, 2, gl.FLOAT, gl.FALSE, 0, 0)
        ]));
        const indexBuffer = new IndexBuffer(this._indices);
        this._vertexArray = new VertexArray();
        this._vertexArray.addVertexBuffer(vertexPositionBuffer);
        this._vertexArray.addVertexBuffer(vertexNormalBuffer);
        this._vertexArray.addVertexBuffer(uvBuffer);
        this._vertexArray.setIndexBuffer(indexBuffer);
    }
}

//# sourceMappingURL=index.d2f84c8c.js.map
