import { Sprite, Point } from "pixi.js";
import {
  always, middleware, trace, jsonToString,
  fromIter, forEach, take, merge, map, filter, 
  sample, interval, fromEvent, mergeWith, takeWhile,
  debounce, animationFrames, fromFunction, fromPromise,
  saga,
  wait
} from "./utils/callbagCollectors";
import addSprite, { centerPivot } from "./utils/addSprite";
import sheetKeys from "./setup/sheetKeys";
import { allInvaders } from "./setup/sheetSets";

function * mantaGoingToDie (manta, explode) {
  manta.tint = 0xAA0000;        
  manta.removeAllListeners();
  manta.parent.removeAllListeners();        
  
  while (manta.position.y < 900) {
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
  yield true;
}

const enemyFireSetup = (state, asset, areas, getManta) => ({position:{x,y}}, vector) => {
  const {buletArea} = areas;
  const {sheet} = asset;  
  const bulet = addSprite(buletArea, true)(sheet[sheetKeys.blueSun], x, y, .05);
  const explode = explodeSetup(state, asset, areas);
  const manta = getManta ? getManta() : {position:{x:-10000, y:-10000}};
  
  const buletVector = {x: vector.x * 3, y: vector.y * 3};
  
  function * flyingBulet(speed) {
    while(bulet.position.x > -100) {
      bulet.position.x += buletVector.x;
      bulet.position.y += buletVector.y;      

      if (manta.containsPoint(bulet.position)) {
        explode(bulet, .5);
        explode(manta, .5);
        bulet.destroy();
        for(let frame of  mantaGoingToDie(manta, explode)) yield frame;        
        yield false;    
      }
      
      yield true;            
    }
    explode(bulet, .5);
    bulet.destroy();
    yield false;
  }

  saga(flyingBulet(15));
}

const invadersSetup = (state, asset, areas) => ({fireRate, ace, maxSpeed }, getManta) => {
  const {invaderArea} = areas;
  const {sheet} = asset;
  const enemyFire = enemyFireSetup(state, asset, areas, getManta);
  const explode = explodeSetup(state, asset, areas);

  const invaderKeys = allInvaders;
  const invaderName = invaderKeys[Math.random() * invaderKeys.length | 0];
  const invader = addSprite(invaderArea, true)(sheet[invaderName], 1100, Math.random() * 600, .5 );
  const manta = getManta ? getManta() : {position:{x:-10000, y:-10000}};
    
  function * invaderAttack (speed) { 
    try {
      let vector = {x: -speed, y: ace ? Math.random() * 8 - 4 : 0 };    
      while(invader.position.x > -500) {
        if (invader.containsPoint(manta.position)) {
          explode(invader, .5);
          explode(manta, .5);
          invader.destroy();
          for(let frame of  mantaGoingToDie(manta, explode)) yield frame;
          yield false;      
        }

        invader.position.x += vector.x;
        invader.position.y += vector.y;
        if (Math.random() < ace) { vector.y = Math.random() * 8 - 4; }
        if (Math.random() < fireRate) { enemyFire(invader, vector); }
        invader.angle = - vector.y * 4;
        yield true;
      }
      invader.destroy();
      yield false;
    } catch(err) { yield false };
  }

  saga(invaderAttack(2 + Math.random() * maxSpeed));
}

const explodeSetup = (state, asset, areas) => ({position}, speed = 1) =>  {
  const {explodingArea} = areas;
  const {newExplosion} = asset;
  const explosion = explodingArea.addChild(newExplosion());
  explosion.position = position;  
  centerPivot(explosion);
  explosion.play();
  explosion.animationSpeed = speed;
  explosion.loop = true;
  explosion.onLoop = () => explosion.destroy();
}

const fireSetup = (state, asset, areas) => ({position:{x,y}}) => {
  const {rocketArea, invaderArea} = areas;
  const {sheet} = asset;
  const rocket = addSprite(rocketArea, true)(sheet.rocket, x, y, .5);
  const explode = explodeSetup(state, asset, areas);

  function * flyingRocker(speed) {
    while(rocket.position.x < 850) {
      rocket.position.x += speed;
      for(let invader of invaderArea.children) {
        if (rocket.containsPoint(invader.position)) {
          explode(invader, 0.5);
          invader.destroy();
        }
      }
      yield true;
    }
    // explode(rocket, .5);
    rocket.destroy();
    yield false;
  }

  saga(flyingRocker(20));
}

const mantaSetup = (state, asset, areas) => {
  const {stage} = areas;
  const fire = fireSetup(state, asset, areas);
  const explode = explodeSetup(state, asset, areas);

  const {sheet} = asset;
  const manta = addSprite(stage, true)(sheet.manta, -500, 250, .4);
    
  const maneuver = ({data:{global:{x, y}}}) => manta.position.set(x, y);

  function * mantaIsReadyToAction (speed) {
    while(manta.position.x < 100) {      
      manta.position.x += speed
      yield true
    }
    manta.interactive = true;
    manta.buttonMode = true;
    manta.cursor = 'none';
    manta.on('pointerdown', () => fire(manta))
    stage.interactive = true;
    stage.on('mousemove', maneuver);
    yield false
  }

  saga(mantaIsReadyToAction(5));

  return manta;
}

const galaxyFadeIn = (stage, galaxy) => {  
  galaxy.alpha = 0;
  galaxy.interactive = true;
  animationFrames 
    |> takeWhile( _ => galaxy.alpha < 2 ) 
    |> forEach( _ => galaxy.alpha += 0.03);
};

export default (state, asset, stage) => ({gap, ...config}) => {  
  const { galaxy } = asset;
  
  addSprite(stage)(galaxy); 
  galaxyFadeIn(stage, galaxy);

  const invaderArea = new Sprite(); 
  const buletArea = new Sprite();
  const rocketArea = new Sprite();
  const explodingArea = new Sprite();

  stage.addChild(buletArea);
  stage.addChild(invaderArea);  
  stage.addChild(rocketArea);
  stage.addChild(explodingArea);

  const areas = {stage, buletArea, invaderArea, rocketArea, explodingArea};
  
  const ship = mantaSetup(state, asset, areas);
  const getShip = () => ship;

  const stillPlay = () => getShip() && getShip().alpha > 0;
 
  const scroll = time => galaxy.tilePosition.set(- time / 10, 0);
  animationFrames 
    |> takeWhile(stillPlay)
    |> forEach(scroll);
  
  interval(gap)
    |> take(1000)
    |> wait(2500)
    |> takeWhile(stillPlay)
    |> forEach( _ => invadersSetup(state, asset, areas)(config, getShip));
}