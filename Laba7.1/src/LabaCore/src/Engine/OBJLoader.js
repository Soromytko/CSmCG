class OBJLoader {
    constructor() {

    }

    get vertices() {
        return this._vertices
    }

    get normals() {
        return this._normals
    }

    get indices() {
        return this._indices
    }

    async load(url) {
        const objText = await loadFile(url)

        // const objFile = new OBJFile(objText)
        // const output = objFile.parse()
        // console.log(output)

        var mesh = new OBJ.Mesh(objText)

        this._vertices = mesh.vertices
        this._normals = mesh.vertexNormals
        this._indices = mesh.indices

        // console.log(this._vertices)
        // console.log(this._normals)
        // console.log(this._indices)
        // console.log(mesh)

        // console.log(obj)
        // this._parseOBJ(objText)
        // this._parse(objText)
    }

    _parse(text) {
        const lines = text.split('\n')
        lines.forEach(line => {
            line = line.trim()  // удалить начальные и конечные пробелы строки
            if (line === "" || line.startsWith("#")) {
                return
            }

            if (line.startsWith("v ")) {
                const values = line.split("v ")[1].split(" ") // все значения после "v "
                // console.log("v", values)
            } else if (line.startsWith("vt")) {
                const values = line.split("vt ")[1].split(" ") // все значения после "vt "
                // console.log("vt", values)
            } else if (line.startsWith("vn")) {
                const values = line.split("vn ")[1].split(" ") // все значения после "vn "
                // console.log("vn", values)
            } else if (line.startsWith("f ")) {
                const values = line.split("f ")[1].split(" ") // все значения после "f "\
                console.log("f", values)
            }
            
        })
    }

    _parseOBJ(text) {
 
        const keywords = {
        };
       
        const keywordRE = /(\w*)(?: )*(.*)/;
        const lines = text.split('\n');
        for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
          const line = lines[lineNo].trim();
          if (line === '' || line.startsWith('#')) {
            continue;
          }
          const m = keywordRE.exec(line);
          if (!m) {
            continue;
          }
          const [, keyword, unparsedArgs] = m;
          const parts = line.split(/\s+/).slice(1);
          const handler = keywords[keyword];
          if (!handler) {
            console.warn('unhandled keyword:', keyword, 'at line', lineNo + 1);
            continue;
          }
          handler(parts, unparsedArgs);
        }
      }
}




