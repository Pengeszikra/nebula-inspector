import addSprite, { centerPivot } from "../utils/addSprite";
import { story } from "../utils/callbagCollectors";

export const explodeSetup = (state, asset, areas) => ({position}, speed = 1) =>  {
  const {explodingArea} = areas;
  const {newExplosion} = asset;
  const explosion = explodingArea.addChild(newExplosion());
  explosion.angle = Math.random() * 360;
  explosion.position = position;  
  centerPivot(explosion);
  explosion.play();
  explosion.animationSpeed = speed;
  explosion.loop = true;
  explosion.onLoop = () => explosion.destroy();
}