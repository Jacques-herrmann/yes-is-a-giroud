
import {Box3, Line3, Matrix4, Vector3} from "three";

const G = -30 // gravity
const TMP_V = new Vector3()
const TMP_V2 = new Vector3()
const DIR = new Vector3()
const TMP_B = new Box3()
const TMP_M = new Matrix4()
const TMP_L = new Line3()

const UP = new Vector3(0, 1, 0)

export class CharacterController {
    constructor(character, ground) {
        this.character = character
        this.characterIsOnGround = false
        this.speed = 40

        this.ground = ground
        this.movement = []
    }

    handleMovement(angle, delta) {
        if(this.movement.includes('Forward')) {
            TMP_V.set(0, 0, -1).applyAxisAngle(UP, angle)
            this.character.mesh.position.addScaledVector(TMP_V, this.speed * delta)
            // this.character.direction.lerp(TMP_V, 0.1)
        }
        if(this.movement.includes('Backward')) {
            TMP_V.set(0, 0, 1).applyAxisAngle(UP, angle)
            this.character.mesh.position.addScaledVector(TMP_V, this.speed * delta)
            // this.character.direction.lerp(TMP_V, 0.1)
        }
        if(this.movement.includes('Left')) {
            TMP_V.set(-1, 0, 0).applyAxisAngle(UP, angle)
            this.character.mesh.position.addScaledVector(TMP_V, this.speed * delta)
            // this.character.direction.lerp(TMP_V, 0.1)
        }
        if(this.movement.includes('Right')) {
            TMP_V.set(1, 0, 0).applyAxisAngle(UP, angle)
            this.character.mesh.position.addScaledVector(TMP_V, this.speed * delta)
            // this.character.direction.lerp(TMP_V, 0.1)
        }
        if(this.movement.includes('Up') && this.characterIsOnGround) {
            // TMP_V.set(1, 0, 0).applyAxisAngle(UP, angle)
            this.character.velocity.y = 10.0;
        }
    }

    update(delta, controls) {
        if(this.character.mesh.position.y < -1) {
            this.character.receiveDamage(this.character.life)
            return
        }
        const old = new Vector3().copy(this.character.mesh.position)

        this.character.velocity.y += this.characterIsOnGround ? 0: delta * G
        this.character.velocity.y *= this.character.velocity.y > 0 ? 1  : 1.01
        this.character.mesh.position.addScaledVector(this.character.velocity, delta)

        this.handleMovement(controls.getAzimuthalAngle(), delta) // TODO not for enemy
        this.character.mesh.updateMatrixWorld()

        // adjust player position based on collisions
        TMP_B.makeEmpty()
        TMP_M.copy(this.ground.matrixWorld).invert()
        TMP_L.copy(this.character.segment)

        // get the position of the capsule in the local space of the collider
        TMP_L.start.applyMatrix4( this.character.mesh.matrixWorld ).applyMatrix4(TMP_M);
        TMP_L.end.applyMatrix4( this.character.mesh.matrixWorld ).applyMatrix4(TMP_M);

        // get the axis aligned bounding box of the capsule (player collider)
        // TMP_B.copy(this.character.collider)
        TMP_B.expandByPoint(TMP_L.start)
        TMP_B.expandByPoint(TMP_L.end)

        TMP_B.min.addScalar(- this.character.radius)
        TMP_B.max.addScalar( this.character.radius)
        this.ground.geometry.boundsTree.shapecast( {
            intersectsBounds: box => box.intersectsBox( TMP_B ),
            intersectsTriangle: tri => {
                // check if the triangle is intersecting the capsule and adjust the
                // capsule position if it is.
                const triPoint = TMP_V;
                const capsulePoint = TMP_V2;

                const distance = tri.closestPointToSegment(TMP_L, triPoint, capsulePoint);
                if ( distance < this.character.radius ) {

                    const depth = this.character.radius - distance;
                    DIR.copy(capsulePoint.sub( triPoint ).normalize());

                    TMP_L.start.addScaledVector( DIR, depth );
                    TMP_L.end.addScaledVector( DIR, depth );
                }
            }
        });

        // get the adjusted position of the capsule collider in world space after checking
        // triangle collisions and moving it. this.character.colliderInfo.segment.start is assumed to be
        // the origin of the player model.
        const newPosition = TMP_V;
        newPosition.copy( TMP_L.start ).applyMatrix4( this.ground.matrixWorld );

        // check how much the collider was moved
        const deltaVector = TMP_V2;
        deltaVector.subVectors( newPosition, this.character.mesh.position );
        // if the player was primarily adjusted vertically we assume it's on something we should consider ground
        this.characterIsOnGround = deltaVector.y > Math.abs( delta * this.character.velocity.y * this.character.radius );

        const offset = Math.max( 0.0, deltaVector.length() - 1e-5 );
        deltaVector.normalize().multiplyScalar( offset );

        // adjust the player model
        this.character.mesh.position.add( deltaVector );

        const dir = new Vector3().subVectors(old, this.character.mesh.position).setY(0).normalize().multiplyScalar(-1)
        if(dir.length()) {
            dir.add(this.character.mesh.position)
            dir.add(new Vector3(0, this.character.collider.min.y, 0))
            this.character.mesh.lookAt(dir)
            this.character.direction.copy(dir)
        }

        if (!this.characterIsOnGround) {
            deltaVector.normalize();
            this.character.velocity.addScaledVector( deltaVector, - deltaVector.dot( this.character.velocity ) );
        } else {
            this.character.velocity.set( 0, 0, 0 );
        }
    }
}