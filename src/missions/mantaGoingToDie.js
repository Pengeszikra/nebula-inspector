export function * mantaGoingToDie (manta, explode) {
  manta.tint = 0xAA0000;        
  manta.removeAllListeners();
  manta.parent.removeAllListeners();
  
  try {
    while (manta.position.y < 900 && manta.width < 500) {
      manta.position.x += 4;
      manta.position.y += 5;
      manta.angle += 7;
      manta.alpha = Math.random() * 200;
      manta.width *= 1.005;
      manta.height *= 1.005;
      yield true;
    }
    explode({position:{x:manta.position.x, y:600}}, .5);
    manta.alpha = 0;
    yield false;
  } catch(err) { yield false };   
}