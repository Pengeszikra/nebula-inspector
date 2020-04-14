import { Sprite } from "pixi.js";
import {
  always, middleware, trace, jsonToString,
  fromIter, forEach, take, merge, map, filter, 
  sample, interval, fromEvent, mergeWith, takeWhile,
  debounce, animationFrames, fromFunction, fromPromise
} from "./utils/callbagHelpers";
import addSprite from "./addSprite";

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
}

// |> mergeWith(interval(2000) |> take(1) |> always('-- 2000 --') |> trace)    