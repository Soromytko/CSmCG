function bindInput() {
    const canvas = document.getElementById('canvas')
    canvas.onmousedown = function(e) {
        isLooking = true
        cursor.oldPos = {
            x: e.clientX,
            y: e.clientY,
        }
    }
    canvas.onmouseup = function(e) {
        isLooking = false
        console.log(isLooking)
    }
    canvas.onmousemove = function(e) {
        cursor.pos = {
            x: e.clientX,
            y: e.clientY,
        }
    }

    window.onkeydown = function(e) {
        const key = e.key.toUpperCase()
        switch(key) {
            case "A": {
                cameraTarget.pos.x -= 0.1
                return
            }
            case "D": {
                cameraTarget.pos.x += 0.1
                return
            }
            case "Q": {
                cameraTarget.pos.y -= 0.1
                return
            }
            case "E": {
                cameraTarget.pos.y += 0.1
                return
            }
            case "S": {
                cameraTarget.pos.z += 0.1
                return
            }
            case "W": {
                cameraTarget.pos.z -= 0.1
                return
            }
        }        
    }
}

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

    document.getElementById("yellowRange").addEventListener("input", (event) => {
        yellowCube.rotation.y = event.target.value / 50
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
            yellowCube.meshRenderer.material.shader = shader
            blueCube.meshRenderer.material.shader = shader
            plane.meshRenderer.material.shader = shader
        }

        const model = event.target.value
        if (model == "Simple") {
            setShader(SHADERS.simple)
            console.log("Simple material is set")
        } else if (model == "Lambert") {
            setShader(SHADERS.lambert)
            console.log("Lambert material is set")
        } else if (model == "Phong") {
            setShader(SHADERS.phong)
            console.log("Phong material is set")
        } else if (model == "Guro") {
            setShader(SHADERS.guro)
            console.log("Guro material is set")
        }
        else {
            console.log("Unknown model: ", model)
        }
    })
}