import { Sprite, Point } from "pixi.js";
import {
  always, middleware, trace, jsonToString,
  fromIter, forEach, take, merge, map, filter, 
  sample, interval, fromEvent, mergeWith, takeWhile,
  debounce, animationFrames, fromFunction, fromPromise,
  saga,
  wait
} from "./utils/callbagCollectors";
import addSprite, { centerPivot } from "./addSprite";
import sheetKeys from "./setup/sheetKeys";
import { allInvaders } from "./setup/sheetSets";

const enemyFireSetup = (state, asset, stage) => ({position:{x,y}}, vector) => {
  const {sheet} = asset;  
  const bulet = addSprite(stage, true)(sheet[sheetKeys.blueSun], x, y, .05);
  const explode = explodeSetup(state, asset, stage);
  
  const buletVector = {x: vector.x * 3, y: vector.y * 3};
  
  function * flyingBulet(speed) {
    while(bulet.position.x > -100) {
      bulet.position.x += buletVector.x;
      bulet.position.y += buletVector.y;      
      yield true;
    }
    explode(bulet, .5);
    bulet.destroy();
    yield false;
  }

  saga(flyingBulet(15));
}

const invadersSetup = (state, asset, stage, buletArea, rocketArea) => ({fireRate, ace, maxSpeed }, getManta) => {
  const {sheet} = asset;
  const enemyFire = enemyFireSetup(state, asset, buletArea);
  const explode = explodeSetup(state, asset, stage);

  const invaderKeys = allInvaders;
  const invaderName = invaderKeys[Math.random() * invaderKeys.length | 0];
  const invader = addSprite(stage, true)(sheet[invaderName], 1100, Math.random() * 600, .5 );
  const manta = getManta ? getManta() : {position:{x:-10000, y:-10000}};
    
  function * invaderAttack(speed) {
    let vector = {x: -speed, y: ace ? Math.random() * 8 - 4 : 0 };
    while(invader.position.x > -500) {
      if (invader.containsPoint(manta.position)) {
        explode(invader, .5);
        explode(manta, .5);
        invader.destroy();
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
  }

  saga(invaderAttack(2 + Math.random() * maxSpeed));
}

const explodeSetup = (state, asset, stage) => ({position}, speed = 1) =>  {
  const {newExplosion} = asset;
  
  const explosion = stage.addChild(newExplosion());
  explosion.position = position;  
  centerPivot(explosion);
  explosion.play();
  explosion.animationSpeed = speed;
  explosion.loop = true;
  explosion.onLoop = () => explosion.destroy();
}

const fireSetup = (state, asset, stage) => ({position:{x,y}}) => {
  const {sheet} = asset;
  const rocket = addSprite(stage, true)(sheet.rocket, x, y, .5);
  const explode = explodeSetup(state, asset, stage);

  function * flyingRocker(speed) {
    while(rocket.position.x < 850) {
      rocket.position.x += speed;
      yield true;
    }
    // explode(rocket, .5);
    rocket.destroy();
    yield false;
  }

  saga(flyingRocker(20));
}

const mantaSetup = (state, asset, stage, rocketArea) => {
  const fire = fireSetup(state, asset, rocketArea);
  const explode = explodeSetup(state, asset, stage);

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
  stage.addChild(buletArea);
  stage.addChild(invaderArea);  
  stage.addChild(rocketArea);
  
  const ship = mantaSetup(state, asset, stage, rocketArea);
  const getShip = () => ship;

  const scroll = time => galaxy.tilePosition.set(- time / 10, 0);
 
  const gameOver = () => ship.alpha > 0;
 
  animationFrames 
    |> takeWhile(gameOver)
    |> forEach(scroll);
  
  interval(gap)
    // |> take(1000)
    |> wait(2500)
    |> takeWhile(gameOver)
    |> forEach( _ => invadersSetup(state, asset, invaderArea, buletArea, rocketArea)(config, getShip));
}