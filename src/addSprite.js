import {Sprite} from "pixi.js";

export default (parent = stage) => (sprite, x = 0, y = 0, scale = 1) => {  
  const mob = sprite instanceof Sprite ? sprite : new Sprite(sprite);
  parent.addChild(mob);
  mob.position.set(x, y)
  mob.scale.set(scale);
  return mob;
};