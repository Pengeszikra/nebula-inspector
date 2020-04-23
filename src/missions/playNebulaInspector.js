import { Container, Sprite, Point, filters, SpriteMaskFilter } from "pixi.js";
import {
  always, middleware, trace, jsonToString, wait,
  fromIter, forEach, take, merge, map, filter, 
  sample, interval, fromEvent, mergeWith, takeWhile,
  debounce, animationFrames, fromFunction, fromPromise, takeToFinally, 
} from "../utils/callbagCollectors";
import addSprite, { centerPivot } from "../utils/addSprite";
import sheetKeys from "../setup/sheetKeys";
import { allInvaders, enviroment } from "../setup/sheetSets";
import { easeInOutQuad, easeInOutQuint } from "../utils/easing";
import { AdjustmentFilter } from '@pixi/filter-adjustment';
import { story } from "../utils/callbagCollectors";
import layersFactory from "../utils/layersFactory";
import { takeScore, roadTo } from "../react-section/state-management/gameReducer";
import paralellEnviroment from "./paralellEnviroment";
import { mantaGoingToDie } from "./mantaGoingToDie";
import { mantaSetup } from "./mantaSetup";
import { fireSetup } from "./fireSetup";
import { explodeSetup } from "./explodeSetup";

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

export default (emitter, asset, stage, {gap, paralaxWait, ...config}) => {  
  const { newGalaxy } = asset;

  const state = {
    earnScore: point => point |> takeScore |> emitter,
  }
   
  const galaxy = galaxyFadeIn(stage, newGalaxy);

  const layers = layersFactory(8);
  const [layer1, layer2, buletArea, invaderArea, rocketArea, playerArea, explodingArea, layer3] = layers;
  stage.addChild(...layers);
  
  const areas = {stage, buletArea, invaderArea, rocketArea, explodingArea, playerArea};
  
  const ship = mantaSetup(fireSetup, explodeSetup)(state, asset, areas);
  const getShip = () => ship;
  const stillPlay = () => getShip() && getShip().alpha > 0;

  interval(gap)
    |> take(1000)
    |> wait(2500)
    |> takeWhile(stillPlay)
    |> forEach( _ => invadersSetup(state, asset, areas)(config, getShip));

  paralellEnviroment(emitter, asset, stage, galaxy, [layer1, layer2, layer3], gap, paralaxWait, config, stillPlay);

  const clean = () => {
    console.log('- nebula game play cleaner -')
  };
  
  return clean;
}