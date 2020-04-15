import React, { useState, useEffect } from "react";
import createApp from "./setup/createPixiApplication";
import { TilingSprite, Sprite } from "pixi.js";
import createElements from "./setup/createElements";
import { nebulaConfig } from "./setup/nebulaConfig";
import gameReducer, { 
  initialState, splashFadeOut, fireRocket, GAME_OVER, gameOver, 
  ASSET_READY, assetReady, SPLASH_FADE_OUT, nextRound, 
  gameOne, gameTwo, gameThree, exitFromGame, GAME_ONE, GAME_TWO, GAME_THREE 
} from "./gameReducer";
import {
  always, middleware, trace, jsonToString,
  fromIter, forEach, take, merge, map, filter,
  sample, interval, fromEvent, mergeWith, takeWhile,
  debounce, animationFrames, fromFunction, fromPromise
} from "./utils/callbagCollectors";
import addSprite from "./utils/addSprite";
import { divFactory } from "react-slash";
import playNebulaInspector from "./playNebulaInspector";
import levelBuilder from "./levelBuilder";

let state = initialState;
let asset = null;

const {app:{stage}, assetsLoaded} = createApp(nebulaConfig);

const addStage = stage |> addSprite;

const renderSplash = () => {
  const {splashWithAction } = asset;
  addStage(splashWithAction);
  animationFrames 
    |> filter(time => time > 2000)
    |> takeWhile(time => time < 2500) 
    |> forEach(() => splashWithAction.alpha -= .035)
}

const renderMain = () => {
  const { galaxy, sheet, mainNebula } = asset;  
  const mainPage = new Sprite();
  galaxy.alpha = 4;
  animationFrames 
    |> takeWhile( _ => state.phase === 'main')
    |> forEach(time => galaxy.tilePosition.set(0, - time / 10))
  
  addSprite(mainPage)(galaxy);
  const title = new Sprite(sheet['nebula-inspector']);
  addSprite(mainPage)(title, 120, 50);
  addStage(mainPage);
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
  }
}

const [MainMenu, MenuButton] = divFactory('main-menu', 'menu-button');

const setupAssets = ({resources}) => assetReady(resources);

export default () => {
  const [route, setRoute] = useState(null);
  useEffect(() => 
    fromPromise(assetsLoaded.then(setupAssets))
      |> mergeWith( interval(2500) |> take(1) |> always(splashFadeOut()))
      |> filter(({type}) => !!type)
      |> forEach(action => {
        state = gameReducer(state, action);
        setRoute(state.phase);
        routeReducer(state, action);
      }
  ), []);

  const dificulties = [
    {fireRate: 0,      gap: 2000, ace: 0,    maxSpeed:  7, paralaxWait:  1000 },
    {fireRate: 0.01,   gap:  800, ace: 0.05, maxSpeed: 10, paralaxWait:  4000 },
    {fireRate: 0.015,  gap:  500, ace: 0.1,  maxSpeed: 14, paralaxWait: 12000 },
  ]

  const play = level => () => {
    state = gameReducer(state, gameOne());
    setRoute(GAME_ONE);

    const [level1, level2, level3] = dificulties;

    switch(level) {
      case 1: level1 |> playNebulaInspector(state, asset, stage); break;
      case 2: level2 |> playNebulaInspector(state, asset, stage); break;
      case 3: level3 |> playNebulaInspector(state, asset, stage); break;
      case 4: level2 |> levelBuilder(state, asset, stage); break;
    }    
  };

  const exit = () => {
    stage.children[1].destroy();
    stage.children[0].alpha = 1;
    setRoute('splash')
  }

  return route === 'main' && (
    <MainMenu>
      <MenuButton onClick={play(1)}>GAME 1</MenuButton>
      <MenuButton onClick={play(2)}>GAME 2</MenuButton>
      <MenuButton onClick={play(3)}>GAME 3</MenuButton>
      <MenuButton onClick={play(4)}>BUILDER</MenuButton>
      <MenuButton onClick={exit}>EXIT</MenuButton>
    </MainMenu>
  )
}  
