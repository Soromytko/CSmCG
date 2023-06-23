class Input {
    constructor() {
        if (Input._instance) {
            return Input._instance
        }

        this._keys = {
            down: {},
            hold: {},
            up: {},
        }
        this._mouse = {
            pos: {
                x: 0,
                y: 0,
            },
            delta: {
                x: 0,
                y: 0,
            },
            isHoldButton: false,

            _oldPos: {
                x: 0,
                y: 0,
            },
        }

        this._bindInput()
        this._bindMouse()

        Input._instance = this
    }

    get mouse() {
        return this._mouse
    }

    getKey(key) {
        key = key.toUpperCase()
        // if (this._keys.hold[key]) console.log(key, "is pressed")
        return this._keys.hold[key]
    }

    setKeyEvent(key, event) {

    }

    update() {
        this._mouse.delta = {
            x: this._mouse.pos.x - this._mouse._oldPos.x,
            y: this._mouse.pos.y - this._mouse._oldPos.y,
        }
        this._mouse._oldPos = {
            x: this._mouse.pos.x,
            y: this._mouse.pos.y,
        }
    }

    _bindInput() {
        window.onkeyup = function(e) {
            const key = e.key.toUpperCase()
            Input._instance._keys.hold[key] = false
        }
    
        window.onkeydown = function(e) {
            const key = e.key.toUpperCase()
            Input._instance._keys.hold[key] = true
        }

        
    }

    _bindMouse() {
        const canvas = document.getElementById('canvas')
        canvas.onmousedown = function(e) {
            const input = Input._instance
            input.mouse.isHoldButton = true
            input._mouse.pos = {
                x: e.clientX,
                y: e.clientY,
            }
            input._mouse._oldPos = {
                x: e.clientX,
                y: e.clientY,
            }
        }
        canvas.onmouseup = function(e) {
            Input._instance.mouse.isHoldButton = false
        }
        canvas.onmousemove = function(e) {
            Input._instance.mouse.pos = {
                x: e.clientX,
                y: e.clientY,
            }
        }
        canvas.onmouseleave = function(e) {
            Input._instance.mouse.isHoldButton = false
        }
    }
}