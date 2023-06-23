class VertexArray {
    constructor(){
        this._vertexBuffers = [];
        this._layoutBuffers = [];
        this._buffers = [];
    }
    addVertexBuffer(vertexBuffer) {
        this._vertexBuffers.push(vertexBuffer);
    }
    setIndexBuffer(indexBuffer) {
        this._indexBuffer = indexBuffer;
    }
    bind() {
        this._vertexBuffers.forEach((vertexBuffer)=>{
            vertexBuffer.bind();
        });
        this._indexBuffer.bind();
    }
    unbind() {
        this._vertexBuffers.forEach((vertexBuffer)=>{
            vertexBuffer.unbind();
        });
        this._indexBuffer.unbind();
    }
}
class VertexArrayElement {
    constructor(vertexBuffer){
        this._vertexBuffer = vertexBuffer;
        this._locations = locations;
    }
    get vertexBuffer() {
        return this._vertexBuffer;
    }
    get locations() {
        return this._locations;
    }
}

//# sourceMappingURL=index.5a4e0cb1.js.map
