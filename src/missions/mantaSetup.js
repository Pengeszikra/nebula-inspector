import addSprite from "../utils/addSprite";
import { story } from "../utils/callbagCollectors";

export const mantaSetup = (fireSetup, explodeSetup) => (state, asset, areas) => {
  const {stage, playerArea} = areas;
  const fire = fireSetup(explodeSetup)(state, asset, areas);
  const explode = explodeSetup(state, asset, areas);

  const {sheet} = asset;  
  const manta = addSprite(stage, true)(sheet.manta, -500, 250, .4);
    
  const maneuver = ({data:{global:{x, y}}}) => manta.position.set(x, y);

  function * mantaIsReadyToAction (speed) {
    while(manta.position.x < 100) {      
      manta.position.x += speed;
      yield true;
    }

    stage.interactive = true;
    stage.on('mousemove', maneuver);
    manta.interactive = true;
    manta.buttonMode = true;
    manta.cursor = 'none';
    manta.on('pointerup', () => fire(manta));    
    yield false;    
  }
  
  story(mantaIsReadyToAction(5));

  return manta;
}