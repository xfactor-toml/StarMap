import { Vector3 } from "three";

export function toScreenPosition(renderer, obj, camera, devicePixelRatio: number) {
  var vector = new Vector3();

  var widthHalf = 0.5 * renderer.getContext().canvas.width;
  var heightHalf = 0.5 * renderer.getContext().canvas.height;

  obj.updateMatrixWorld();
  vector.setFromMatrixPosition(obj.matrixWorld);
  vector.project(camera);

  vector.x = (vector.x * widthHalf) + widthHalf;
  vector.y = - (vector.y * heightHalf) + heightHalf;

  return {
    x: vector.x / devicePixelRatio,
    y: vector.y / devicePixelRatio
  };

}