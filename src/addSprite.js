import {Sprite} from "pixi.js";

export const centerPivot = mob => mob.pivot.set(mob.width / 2, mob.height / 2);

export default (parent = stage, isCentered = false) => (sprite, x = 0, y = 0, scale = 1) => {  
  const mob = sprite instanceof Sprite ? sprite : new Sprite(sprite);
  parent.addChild(mob);
  isCentered && centerPivot(mob);  
  mob.position.set(x, y)
  mob.scale.set(scale);
  mob.calculateBounds();
  return mob;
};