import { Sprite } from "pixi.js";
import {
  always, middleware, trace, jsonToString,
  fromIter, forEach, take, merge, map, filter, 
  sample, interval, fromEvent, mergeWith, takeWhile,
  debounce, animationFrames, fromFunction, fromPromise,
  saga
} from "./utils/callbagHelpers";
import addSprite, { centerPivot } from "./addSprite";

const radar = {

};

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
    while(rocket.position.x < 700) {
      rocket.position.x += speed;
      yield true;
    }
    explode(rocket, .5);
    rocket.destroy();
    yield false;
  }

  saga(flyingRocker(20));
}


const mantaSetup = (state, asset, stage) => {
  const fire = fireSetup(state, asset, stage);
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
}

export default (state, asset, stage) => {
  const { galaxy } = asset;
  addSprite(stage)(galaxy)
  galaxy.alpha = 0;
  galaxy.interactive = true;
  animationFrames 
    |> takeWhile( _ => galaxy.alpha < 2 ) 
    |> forEach( _ => galaxy.alpha += 0.03);
   
  const scroll = time => galaxy.tilePosition.set(- time / 10, 0);
  
  animationFrames    
    |> forEach(scroll);

  mantaSetup(state, asset, stage);
}