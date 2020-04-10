import {Sprite} from "pixi.js";

export default (app, resources) => (imgId, x=0, y=0, scale=1) => {  
  const mob = new Sprite(resources[imgId].texture);
  mob.scale.set(scale);
  mob.position.set(x, y);
  app.stage.addChild(mob);
  return mob;
}