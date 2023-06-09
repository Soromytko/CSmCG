function bindGUI() {
    document.getElementById("sceneRange").addEventListener("input", (event) => {
        scene.rotation = [0, event.target.value / 50, 0]
    })

    document.getElementById("pedestalRange").addEventListener("input", (event) => {
        pedestal.rotation = [0, event.target.value / 50, 0]
        // pedestal.rotation = new Float32Array(0, event.target.value / 50, 0)
    })

    document.getElementById("redRange").addEventListener("input", (event) => {
        redCube.rotation = [0, event.target.value / 50, 0]
    })

    document.getElementById("greenRange").addEventListener("input", (event) => {
        greenCube.rotation = [0, event.target.value / 50, 0]
    })

    document.getElementById("blueRange").addEventListener("input", (event) => {
        blueCube.rotation = [0, event.target.value / 50, 0]
    })

    document.getElementById("ambientRange").addEventListener("input", (event) => {
        ambientIntensity = event.target.value
    })

    document.getElementById("diffuseRange").addEventListener("input", (event) => {
        diffuseIntensity = event.target.value * 10
    })

    document.getElementById("specularRange").addEventListener("input", (event) => {
        specularIntensity = event.target.value
    })

    document.getElementById("lightSizeRange").addEventListener("input", (event) => {
        lightSize = event.target.value * 10
    })

    document.getElementById("lightXRange").addEventListener("input", (event) => {
        const x = event.target.value * 10 - 5 // [-5, 5]
        lightCube.globalPosition = [x, lightCube.globalPosition[1], lightCube.globalPosition[2]]
    })

    document.getElementById("lightYRange").addEventListener("input", (event) => {
        const y = event.target.value * 10 - 5 // [-5, 5]
        lightCube.globalPosition = [lightCube.globalPosition[0], y, lightCube.globalPosition[2]]
    })

    document.getElementById("lightZRange").addEventListener("input", (event) => {
        const z = event.target.value * 10 - 5 // [-5, 5]
        lightCube.globalPosition = [lightCube.globalPosition[0], lightCube.globalPosition[1], z]
    })

    document.getElementById("mixRange").addEventListener("input", (event) => {
        mixingTextures = event.target.value
    })

    document.getElementById("shaderSelector").addEventListener("change", (event) => {
        const setShader = function(shader) {
            plane.meshRenderer.material.shader = shader
        }

        const model = event.target.value
        if (model == "Standard") {
            setShader(SHADERS.standard)
            console.log("Standard shader is set")
        } else if (model == "Phong (Texture)") {
            setShader(SHADERS.phongTexture)
            console.log("Phong (Texture) shader is set")
        } else if (model == "Simple") {
            setShader(SHADERS.simple)
            console.log("Simple shader is set")
        } else if (model == "Lambert") {
            setShader(SHADERS.lambert)
            console.log("Lambert shader is set")
        } else if (model == "Phong") {
            setShader(SHADERS.phong)
            console.log("Phong shader is set")
        } else if (model == "Guro") {
            setShader(SHADERS.guro)
            console.log("Guro shader is set")
        }
        else {
            console.log("Unknown model: ", model)
        }
    })
}