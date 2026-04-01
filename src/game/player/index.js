import * as THREE from 'three'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
import { SPEED, RADIUS } from './constants.js'
import { setupKeyListeners } from './controls.js'
import { updateMovement } from './movement.js'
import { updateTopDown } from './topdown.js'

export class Player {
  static SPEED = SPEED
  static RADIUS = RADIUS

  constructor(camera, domElement, labyrinth) {
    this.camera = camera
    this.labyrinth = labyrinth

    this.controls = new PointerLockControls(camera, domElement)

    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    }

    this._direction = new THREE.Vector3()
    this._velocity = new THREE.Vector3()
    this._groundPos = new THREE.Vector3()
    this._savedQuaternion = new THREE.Quaternion()
    this.topDown = false

    this._setupKeyListeners()
  }

  reset(startPosition) {
    this.camera.position.copy(startPosition)
    this.topDown = false
  }

  lock() {
    this.controls.lock()
  }

  unlock() {
    this.controls.unlock()
  }

  get isLocked() {
    return this.controls.isLocked
  }

  toggleView() {
    if (!this.topDown) {
      // Sauvegarde la position au sol et l'orientation avant de basculer
      this._groundPos.set(this.camera.position.x, 0, this.camera.position.z)
      this._savedQuaternion.copy(this.camera.quaternion)
      this.topDown = true
      // On ne touche pas au pointer lock — lookAt() écrase la rotation chaque frame
    } else {
      this.topDown = false
      // Repositionne au sol et restaure l'orientation horizontale d'avant
      this.camera.position.set(this._groundPos.x, 1.7, this._groundPos.z)
      const euler = new THREE.Euler().setFromQuaternion(this._savedQuaternion, 'YXZ')
      euler.x = 0
      this.camera.quaternion.setFromEuler(euler)
    }
  }

  update(delta) {
    if (this.topDown) {
      updateTopDown(this, delta)
    } else {
      updateMovement(this, delta)
    }
  }

  _setupKeyListeners() {
    setupKeyListeners(this.keys)
  }
}
