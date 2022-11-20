//https://github.com/gkjohnson/three-mesh-bvh/blob/master/example/characterMovement.js

import {CharacterController} from "./characterController";

const KEYS = {
    'ArrowUp': 'Forward',
    'ArrowDown': 'Backward',
    'ArrowLeft': 'Left',
    'ArrowRight': 'Right',
    'Space': 'Up',
    'KeyW': 'Forward',
    'KeyS': 'Backward',
    'KeyA': 'Left',
    'KeyD': 'Right',
    'ControlLeft': 'Control',
    'ControlRight': 'Control',
}

export class PlayerController extends CharacterController{
    constructor(character, ground) {
        super(character, ground)
        this.speed = 40

        window.addEventListener('keydown', this.onKeyDown.bind(this))
        window.addEventListener('keyup', this.onKeyUp.bind(this))
    }

    onKeyDown(ev) {
        const code = KEYS[ev.code]
        if (code && !this.movement.includes(code)) {
            this.movement.push(code)
        }
    }

    onKeyUp(ev) {
        const code = KEYS[ev.code]
        if (!code) return

        const index = this.movement.indexOf(code);
        if (index > -1) {
          this.movement.splice(index, 1);
        }
    }

    update(delta, controls) {
        if(!this.movement.includes('Control')) {
            super.update(delta, controls);
        }

        // adjust the camera
        controls.object.position.sub( controls.target );
        controls.target.copy( this.character.mesh.position );
        controls.object.position.add( this.character.mesh.position );
        if(this.movement.includes('Control')) {
            if(this.movement.includes('Left')) {
                controls.rotate(0.02)
            }
            if(this.movement.includes('Right')) {
                controls.rotate(-0.02)
            }
        }
        this.character.update()
    }

    dispose() {
        window.removeEventListener('keydown', this.onKeyDown.bind(this))
        window.removeEventListener('keyup', this.onKeyUp.bind(this))
    }
}