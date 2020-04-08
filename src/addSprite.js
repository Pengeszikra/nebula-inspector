import {Sprite} from "pixi.js";

export default (app, resources) => (imgId, x=0, y=0) => {
  console.log(app, imgId, resources);
  const mob = new Sprite(resources[imgId].texture);
  mob.scale.set(.4);
  mob.position.set(x, y);
  app.stage.addChild(mob);
  return mob;
}