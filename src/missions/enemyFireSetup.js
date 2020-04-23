import addSprite from "../utils/addSprite";
import { story } from "../utils/callbagCollectors";
import { explodeSetup } from "./explodeSetup";
import { mantaGoingToDie } from "./mantaGoingToDie";

export const enemyFireSetup = (state, asset, areas, getManta) => ({position:{x,y}}, vector) => {  
  console.log('-- enemy fire setup - some thing is wrong --')
  console.log(state, asset, areas, getManta)
  console.log(x, y, vector)
  const {buletArea} = areas;
  const {sheet} = asset;
  const bulet = addSprite(buletArea, true)(sheet[sheetKeys.blueSun], x, y, .05);
  const explode = explodeSetup(state, asset, areas);
  const manta = getManta ? getManta() : {position:{x:-10000, y:-10000}};

  console.log(buletArea, sheet, bulet, explode, manta)


    
  const buletVector = {x: vector.x * 3, y: vector.y * 3};
  
  function * flyingBulet(speed) {
    try {
      while(bulet.position.x > -100) {
        bulet.position.x += buletVector.x;
        bulet.position.y += buletVector.y;      

        if (manta.containsPoint(bulet.position)) {
          explode(bulet, .5);
          explode(manta, .5);
          bulet.destroy();
          for (let frame of mantaGoingToDie(manta, explode)) yield frame;        
          yield false;    
        }       
        
        yield true;            
      }
      explode(bulet, .5);
      bulet.destroy();
      yield false;
    } catch(err) { yield false };      
  }

  story(flyingBulet(15));
}