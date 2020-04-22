import { Container, Sprite, Point, filters, SpriteMaskFilter } from "pixi.js";
import {
  always, middleware, trace, jsonToString, wait,
  fromIter, forEach, take, merge, map, filter, 
  sample, interval, fromEvent, mergeWith, takeWhile,
  debounce, animationFrames, fromFunction, fromPromise, 
} from "../utils/callbagCollectors";
import addSprite, { centerPivot } from "../utils/addSprite";
import sheetKeys from "../setup/sheetKeys";
import { allInvaders, enviroment } from "../setup/sheetSets";
import { easeInOutQuad, easeInOutQuint } from "../utils/easing";
import { AdjustmentFilter } from '@pixi/filter-adjustment';
import { story, storyWhile } from "../utils/callbagCollectors";
import layersFactory from "../utils/layersFactory";

function * mantaGoingToDie (manta, explode) {
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

const enemyFireSetup = (state, asset, areas, getManta) => ({position:{x,y}}, vector) => {
  const {buletArea} = areas;
  const {sheet} = asset;
  const bulet = addSprite(buletArea, true)(sheet[sheetKeys.blueSun], x, y, .05);
  const explode = explodeSetup(state, asset, areas);
  const manta = getManta ? getManta() : {position:{x:-10000, y:-10000}};
  
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

export const smoothTurn = (turnAngle, maxTurning = 1) => {
  const steps = turnAngle / maxTurning | 0 + 1;
  return Array(steps).fill(turnAngle / steps);
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
      let turning = [];
      while(invader.position.x > -500) {
        if (invader.containsPoint(manta.position)) {
          explode(invader, .5);
          explode(manta, .5);
          invader.destroy();
          for (let frame of  mantaGoingToDie(manta, explode)) yield frame;
          yield false;      
        }

        invader.position.x += vector.x;
        invader.position.y += vector.y;
        if (Math.random() < ace) { vector.y = Math.random() * 8 - 4 }
        if (Math.random() < fireRate) { enemyFire(invader, vector); }
        invader.angle = - vector.y * 4;
        yield true;
      }
      invader.destroy();
      yield false;
    } catch(err) { yield false };
  }

  story(invaderAttack(2 + Math.random() * maxSpeed));
}

const explodeSetup = (state, asset, areas) => ({position}, speed = 1) =>  {
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

const fireSetup = (state, asset, areas) => ({position:{x,y}}) => {
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
    // explode(rocket, .5);
    rocket.destroy();
    yield false;
  }

  story(flyingRocket(20));
}

const mantaSetup = (state, asset, areas) => {
  const {stage, playerArea} = areas;
  const fire = fireSetup(state, asset, areas);
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

const pickOne = array => array[array.length * Math.random() | 0];

const fillLayer = (stage, asset, layer, config) => {
  const {sheet} = asset;
  const {getSize, getVertical} = config;

  addSprite(layer, true)(
    sheet[enviroment |> pickOne], 
    1500 - layer.position.x, 
    Math.random() * 600,
    [.2, .4, .7, 1] |> pickOne
  )
};

const galaxyFadeIn = (stage, newGalaxy) => {  
  const galaxy = newGalaxy();  
  galaxy.tint = 0x55FFFF;
  galaxy.alpha = 0;
  galaxy.interactive = true;
  stage.addChild(galaxy);

  animationFrames 
    |> takeWhile( _ => galaxy.alpha < 5 ) 
    |> forEach( _ => galaxy.alpha += 0.03);
  
  return galaxy;
};

export default (state, asset, stage, backToMain) => ({gap, paralaxWait, ...config}) => {  
  const { newGalaxy } = asset;
   
  const galaxy = galaxyFadeIn(stage, newGalaxy);

  const layers = layersFactory(8);
  const [layer1, layer2, buletArea, invaderArea, rocketArea, playerArea, explodingArea, layer3] = layers;
  layers.forEach(layer => stage.addChild(layer));

  
  const areas = {stage, buletArea, invaderArea, rocketArea, explodingArea, playerArea};
  
  const ship = mantaSetup(state, asset, areas);
  const getShip = () => ship;

  const stillPlay = () => getShip() && getShip().alpha > 0;

  const scroll = time => {
    galaxy.tilePosition.set(- time * .1, 0);
    layer1.position.x = - time * .2;
    layer2.position.x = - time * .3;
    layer3.position.x = - time * .4;
  };

  animationFrames 
    |> takeWhile(stillPlay)
    |> forEach(scroll);
  
  interval(gap)
    |> take(1000)
    |> wait(2500)
    |> takeWhile(stillPlay)
    |> forEach( _ => invadersSetup(state, asset, areas)(config, getShip));

  // https://pixijs.io/pixi-filters/tools/demo/ 
  // https://ihatetomatoes.net/how-to-work-with-images-and-pixi-js/

  const colorMatrix = [
    //R  G  B  A
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];

  const cmFilter1 = new filters.ColorMatrixFilter();
  cmFilter1.matrix = [...colorMatrix];
  layer1.filters = [    
    new filters.BlurFilter(4),
    cmFilter1
  ];
  cmFilter1.sepia(true);
  cmFilter1.hue(40);
  

  const cmFilter2 = new filters.ColorMatrixFilter();
  cmFilter2.matrix = [...colorMatrix];
  layer2.filters = [
    new filters.BlurFilter(2),
    cmFilter2
  ];
  cmFilter2.sepia(true);
  cmFilter2.hue(45);

  const cmFilter3 = new filters.ColorMatrixFilter();
  cmFilter3.matrix = [...colorMatrix];
  layer3.filters = [
    cmFilter3
  ];
  cmFilter3.sepia(true);
  cmFilter3.hue(50);
  
  
  const generateEnviroment = (layer, rate, config) => interval(rate) 
    |> take(500)
    |> wait(paralaxWait)
    |> takeWhile(stillPlay)
    |> forEach( _ => fillLayer(stage, asset, layer, config));

  generateEnviroment(
    layer1, 700, 
    {
      getVertical: _ => Math.random() * 600,
      getSize    : _ => [.2, .4, .7] |> pickOne
    }
  );

  generateEnviroment(
    layer2, 1000, 
    {
      getVertical: _ => Math.random() |> easeInOutQuint * 600,
      getSize    : _ => [.4, .7, 1] |> pickOne
    }
  );

  generateEnviroment(
    layer3, 1500, 
    {
      getVertical: _ => Math.random() |> easeInOutQuint * 600,
      getSize    : _ => [.5, .8, 1.2] |> pickOne
    }
  );

  function * handleFinish () {
    while (stillPlay()) {
      yield true;
    }
    yield true
    // stage.position.set(-1000, -1000);
    // stage.visible = false;
    backToMain();
    yield false;
  }

  story(handleFinish())  
}