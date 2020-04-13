import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import createApp from "./setup/createPixiApplication";
import { TilingSprite, Sprite } from "pixi.js";
import createElements from "./setup/createElements";
import { nebulaConfig } from "./setup/nebulaConfig";
import gameReducer, { initialState, splashFadeOut, fireRocket, GAME_OVER, gameOver, ASSET_READY, assetReady, SPLASH_FADE_OUT } from "./gameReducer";
import {
  always, middleware, trace, jsonToString,
  fromIter, forEach, take, merge, map, filter,
  sample, interval, fromEvent, mergeWith, takeWhile,
  debounce, animationFrames, fromFunction, fromPromise
} from "./utils/callbagHelpers";

let state = initialState;
let asset = null;

export default () => render(<PlayWithBags />, document.getElementById('react'));
const {app:{stage}, assetsLoaded} = createApp(nebulaConfig);

const add = (sprite, x = 0, y = 0, scale = 1, parent = stage) => {  
  const mob = sprite instanceof Sprite ? sprite : new Sprite(sprite);
  parent.addChild(mob);
  mob.position.set(x, y)
  mob.scale.set(scale);
  return mob;
};

const renderSplash = () => {
  const { galaxy, sheet } = asset;
  add(galaxy);
  add(sheet.moon, 200, 100);  
  add(sheet.transporter, 400, 100, .5);
}

const renderMain = () => {
  const { galaxy, sheet, titleAsset } = asset;
  add(galaxy);
  add(sheet['nebula-inspector'], 100, 50);
  add(sheet.button, 50, 300, .7)
  add(sheet.button, 230, 300, .7)
  add(sheet.button, 400, 300, .7)
  add(sheet.button, 630, 300, .7)
}

const gameRender = (state, {type, payload}) => {
  switch (type) {
    case ASSET_READY:       
      asset = createElements(payload);
      console.log(asset)
      renderSplash();
      break;
    case SPLASH_FADE_OUT:
      renderMain();
      break;
  }
}

const PlayWithBags = () => {
  const [content, setContent] = useState('-- callbag --');
  const log = p => setContent(d => d ? [d,p].join('\n') :  p );
  
  const stillPlaying = ({type}) => type != GAME_OVER;
 
  const gamePlay = () => 
    fromPromise(assetsLoaded.then(({resources}) => assetReady(resources)))
    // |> mergeWith( animationFrames |> take(12) )
    |> mergeWith( interval(2000) |> take(1) |> always(splashFadeOut()))
    |> mergeWith( fromEvent(document, 'keydown') |> filter(({key}) => key) |> map(({key}) => `press: ${key}`) )
    |> mergeWith( fromEvent(document, 'click') |> always(fireRocket()))
    |> map(p => p == 'press: x' ? gameOver() : p )
    |> middleware(p => stillPlaying(p) ? null : log('-- end of session --'))  
    |> takeWhile( stillPlaying )
    |> middleware(p => log(jsonToString(p)))
    |> filter(({type}) => !!type)
    |> forEach(action => {      
      state = gameReducer(state, action)
      state |> jsonToString |> log
      gameRender(state, action)
    })

  useEffect(gamePlay, []);  

  return <main><pre>{content}</pre></main>;
};