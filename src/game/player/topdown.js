import * as THREE from 'three'
import { SPEED, RADIUS } from './constants.js'

const nextPosition = new THREE.Vector3()

export function updateTopDown(player, delta) {
  const moveSpeed = SPEED * delta
  const groundPos = player._groundPos

  if (player.keys.forward || player.keys.backward) {
    const zDirection = (player.keys.forward ? -1 : 0) + (player.keys.backward ? 1 : 0)
    nextPosition.set(groundPos.x, 1.7, groundPos.z + zDirection * moveSpeed)
    if (!player.labyrinth.verifCollision(nextPosition, RADIUS)) groundPos.z += zDirection * moveSpeed
  }

  if (player.keys.left || player.keys.right) {
    const xDirection = (player.keys.left ? -1 : 0) + (player.keys.right ? 1 : 0)
    nextPosition.set(groundPos.x + xDirection * moveSpeed, 1.7, groundPos.z)
    if (!player.labyrinth.verifCollision(nextPosition, RADIUS)) groundPos.x += xDirection * moveSpeed
  }

  player.camera.position.set(groundPos.x, 30, groundPos.z)
  player.camera.lookAt(groundPos.x, 0, groundPos.z)
}
