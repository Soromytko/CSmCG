function bindGUI() {
    document.getElementById("sceneRange").addEventListener("input", (event) => {
        scene.rotation.y = event.target.value / 60
    })

    document.getElementById("pedestalRange").addEventListener("input", (event) => {
        pedestal.rotation.y = event.target.value / 60
    })

    document.getElementById("redRange").addEventListener("input", (event) => {
        redCube.rotation.y = event.target.value / 50
    })

    document.getElementById("greenRange").addEventListener("input", (event) => {
        greenCube.rotation.y = event.target.value / 50
    })

    document.getElementById("blueRange").addEventListener("input", (event) => {
        blueCube.rotation.y = event.target.value / 50
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
        lightCube.position.x = event.target.value * 10 - 5 // [-5, 5]
    })

    document.getElementById("lightYRange").addEventListener("input", (event) => {
        lightCube.position.y = event.target.value * 10 - 5 // [-5, 5]
    })

    document.getElementById("lightZRange").addEventListener("input", (event) => {
        lightCube.position.z = event.target.value * 10 - 5 // [-5, 5]
    })

    document.getElementById("lightingModelSelect").addEventListener("change", (event) => {
        const setShader = function(shader) {
            redCube.meshRenderer.material.shader = shader
            greenCube.meshRenderer.material.shader = shader
            blueCube.meshRenderer.material.shader = shader
            plane.meshRenderer.material.shader = shader
        }

        const model = event.target.value
        if (model == "Phong (Texture)") {
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
        } else if (model == "Texture") {
            setShader(SHADERS.texture)
            console.log("Texture shader is set")
        }
        else {
            console.log("Unknown model: ", model)
        }
    })
}