import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import createApp from "../setup/createPixiApplication";
import { TilingSprite, Sprite } from "pixi.js";
import createElements from "../setup/createElements";
import { nebulaConfig } from "../setup/nebulaConfig";
import gameReducer, { 
  initialState, splashFadeOut, fireRocket, GAME_OVER, gameOver, 
  ASSET_READY, assetReady, SPLASH_FADE_OUT, nextRound, 
  gameOne, gameTwo, gameThree, exitFromGame, GAME_ONE, GAME_TWO, GAME_THREE 
} from "../gameReducer";
import {
  always, middleware, trace, jsonToString,
  fromIter, forEach, take, merge, map, filter,
  sample, interval, fromEvent, mergeWith, takeWhile,
  debounce, animationFrames, fromFunction, fromPromise
} from "./utils/callbagHelpers";
import { deepSet, set } from "../utils/job";
import addSprite from "./addSprite";
import { divFactory } from "react-slash";

export default () => render(<NebulaInspector />, document.getElementById('react'));

let state = initialState;
let asset = null;

const {app:{stage}, assetsLoaded} = createApp(nebulaConfig);

const addStage = stage |> addSprite;

const renderSplash = () => {
  const { galaxy, sheet, splashWithAction } = asset;
  addStage(splashWithAction);
  console.log('-- renderSplash --')
  animationFrames 
    |> filter(time => time > 2000)
    |> takeWhile(time => time < 2500) 
    |> forEach(() => splashWithAction.alpha -= .035)
}

const renderMain = () => {
  const { galaxy, sheet, titleAsset, splash } = asset;  
  const mainPage = new Sprite();
  addSprite(mainPage)(splash);
  const title = new Sprite(sheet['nebula-inspector']);
  addSprite(mainPage)(title, 120, 50);
  addStage(mainPage);

  console.log('-- renderMain --')
}

const routeReducer = (state, {type, payload}) => {
  switch (type) {
    case ASSET_READY:       
      asset = createElements(payload);
      renderSplash();
      break;
    case SPLASH_FADE_OUT:
      renderMain();
      break;
    case GAME_ONE:
    case GAME_TWO:
    case GAME_THREE:
      playNebulaInspector(state, asset, stage);
      break;
  }
}

const PlayWithBags = () => {
  const [content, setContent] = useState('-- callbag --');
  const log = p => setContent(d => d ? [d,p].join('\n') :  p );
  
  const stillPlaying = ({type}) => type != GAME_OVER;
 
  const gamePlay = () => 
    fromPromise(assetsLoaded.then(({resources}) => assetReady(resources)))
    // |> mergeWith( animationFrames |> take(12) |> map(time => nextRound(time)))
    |> mergeWith( interval(2500) |> take(1) |> always(splashFadeOut()))
    |> mergeWith( fromEvent(document, 'keydown') |> filter(({key}) => key) |> map(({key}) => `press: ${key}`) )
    |> mergeWith( fromEvent(document, 'click') |> always(fireRocket()))
    |> map(p => p == 'press: x' ? gameOver() : p )
    |> middleware(p => stillPlaying(p) ? null : log('-- end of session --'))  
    |> takeWhile( stillPlaying )
    |> middleware(p => log(jsonToString(p)))
    |> filter(({type}) => !!type)
    |> forEach(action => {      
      state = gameReducer(state, action)
      // state |> jsonToString |> log      
      routeReducer(state, action)
    })

  useEffect(gamePlay, []);  

  return (
    <main><pre>{content}</pre></main>  
  );
};

const [MainMenu, MenuButton] = divFactory('main-menu', 'menu-button');

const setupAssets = ({resources}) => assetReady(resources);

const NebulaInspector = () => {
  const [route, setRoute] = useState(null);
  useEffect(() => 
    fromPromise(assetsLoaded.then(setupAssets))
      |> mergeWith( interval(2500) |> take(1) |> always(splashFadeOut()))
      |> filter(({type}) => !!type)
      |> forEach(action => {
        const {phase} = gameReducer(state, action);
        setRoute(phase);
        routeReducer(state, action);
      }
  ), []);

  const play = () => {
    setRoute(GAME_ONE);
    playNebulaInspector(state, asset, stage)
  };

  return route === 'main' && (
    <MainMenu>
      <MenuButton onClick={play}>Game 1</MenuButton>
      <MenuButton onClick={play}>Game 2</MenuButton>
      <MenuButton onClick={play}>Game 3</MenuButton>
      <MenuButton>Exit</MenuButton>
    </MainMenu>
  )
}  
