import addSprite from "../utils/addSprite";
import { story } from "../utils/callbagCollectors";

export const fireSetup = (explodeSetup) => (state, asset, areas) => ({position:{x,y}}) => {
  const {rocketArea, invaderArea} = areas;
  const {sheet} = asset;
  const rocket = addSprite(rocketArea, true)(sheet.rocket, x, y, .5);
  const explode = explodeSetup(state, asset, areas);
  const {earnScore} = state;

  function * flyingRocket(speed) {
    while(rocket.position.x < 850) {
      rocket.position.x += speed;
      for (let invader of invaderArea.children) {
        if (rocket.containsPoint(invader.position)) {
          explode(invader, 0.5);
          earnScore(50);
          invader.destroy();
        }
      }
      yield true;
    }
    rocket.destroy();
    yield false;
  }

  story(flyingRocket(20));
}