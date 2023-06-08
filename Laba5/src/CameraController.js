const input = new Input()

function length(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z)
}

function normalize(vector) {
    const l = length(vector)
    return l == 0 ? {x: 0, y: 0, z: 0} : {x: vector.x / l, y: vector.y / l, z: vector.z / l}
}

function move(from, to, speed) {
    const delta = {
        x: to.x - from.x,
        y: to.y - from.y,
        z: to.z - from.z,
    }
    
    const l = length(delta)
    if(l == 0) {
        return from
    }
    
    const direction = normalize(delta)
    const x = from.x + direction.x * speed * l
    const y = from.y + direction.y * speed * l
    const z = from.z + direction.z * speed * l
    return {x: x, y: y, z: z}
}

function looking() {
    input.update()

    camera.rot = {
        x: camera.rot.x + input.mouse.delta.x * 0.01,
        y: camera.rot.y + input.mouse.delta.y * 0.01,
    }
}

function cameraScript() {
    const h = input.getKey("A") ? -1 : input.getKey("D") ? 1 : 0
    const right = {
        x: Math.cos(camera.rot.x) * Math.cos(camera.rot.y) * h,
        y: Math.sin(camera.rot.y) * h * 0,
        z: -Math.sin(camera.rot.x) * Math.cos(camera.rot.y) * h,
    }

    const v = input.getKey("S") ? -1 : input.getKey("W") ? 1 : 0
    const forward = {
        x: Math.sin(camera.rot.x) * Math.cos(camera.rot.y) * v,
        y: Math.sin(camera.rot.y) * v,
        z: Math.cos(camera.rot.x) * Math.cos(camera.rot.y) * v,
    }

    let direction = {
        x: right.x + forward.x,
        y: right.y + forward.y,
        z: right.z + forward.z,
    }

    // console.log(direction)
    direction = normalize(direction)
    // console.log(direction)
  
    camera.pos.x += direction.x * 0.05
    camera.pos.y -= direction.y * 0.05
    camera.pos.z -= direction.z * 0.05

    // camera.pos = move(camera.pos, cameraTarget.pos, 0.1)
    if (input.mouse.isHoldButton) {
        looking()
    }
}