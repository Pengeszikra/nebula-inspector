import { Sprite } from "pixi.js";
import {
  always, middleware, trace, jsonToString,
  fromIter, forEach, take, merge, map, filter, 
  sample, interval, fromEvent, mergeWith, takeWhile,
  debounce, animationFrames, fromFunction, fromPromise,
  saga,
  wait
} from "./utils/callbagHelpers";
import addSprite, { centerPivot } from "./addSprite";
import sheetKeys from "./setup/sheetKeys";

const radar = {

};

const enemyFireSetup = (state, asset, stage) => ({position:{x,y}}, vector) => {
  const {sheet} = asset;
  const bulet = addSprite(stage, true)(sheet.partickleViolet, x, y, .5);
  const explode = explodeSetup(state, asset, stage);
  
  vector.x *= 2;
  vector.y *= 2;

  function * flyingBulet(speed) {
    while(bulet.position.x > -100) {
      bulet.position.x += vector.x;
      bulet.position.y += vector.y;
      yield true;
    }
    explode(bulet, .5);
    bulet.destroy();
    yield false;
  }

  saga(flyingBulet(15));
}

const invadersSetup = (state, asset, stage) => {
  const {sheet} = asset;
  const fire = enemyFireSetup(state, asset, stage)

  const invaderKeys = [
    sheetKeys.alien1 ,
    sheetKeys.alien2 ,
    sheetKeys.alien3 ,
    sheetKeys.battleShip ,
    sheetKeys.BlockadeRunner ,
    sheetKeys.crawler ,
    sheetKeys.delta ,
    sheetKeys.drones ,
    sheetKeys.dualGun ,
    sheetKeys.fighter ,
    sheetKeys.graviton ,
    sheetKeys.gunner ,
    sheetKeys.meteorLike ,
    sheetKeys.partickleViolet ,
    sheetKeys.particleGreen ,
    sheetKeys.projectile2 ,
    sheetKeys.projectile3 ,
    sheetKeys.racer ,
    sheetKeys.rower ,
    sheetKeys.shileld ,
    sheetKeys.speeder ,
    sheetKeys.supporter ,
    sheetKeys.tieTransporter ,
    sheetKeys.transporter ,
    sheetKeys.zorak ,    
  ]
  const invaderName = invaderKeys[Math.random() * invaderKeys.length | 0];
  const invader = addSprite(stage, true)(sheet[invaderName], 1100, Math.random() * 600, .5 );

  function * invaderAttack(speed) {
    let vector = {x: -speed, y: Math.random() * 8 - 4 }
    while(invader.position.x > -500) {
      invader.position.x += vector.x;
      invader.position.y += vector.y;
      if (Math.random() < .04) { vector.y = Math.random() * 8 - 4; }
      if (Math.random() < .02) { fire(invader, vector); }
      invader.angle = - vector.y * 4;
      yield true;
    }
    invader.destroy();
    yield false;
  }

  saga(invaderAttack(2 + Math.random() * 15));
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

  interval(500)
    |> take(2000)
    |> wait(3000)
    |> forEach(_ => invadersSetup(state, asset, stage));    

  mantaSetup(state, asset, stage);
}