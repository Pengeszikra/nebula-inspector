import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { fromIter, forEach, pipe, take, merge, map, filter } from "callbag-basics";
import sample from "callbag-sample";
import interval from "callbag-interval";
import fromEvent from "callbag-from-event";
import mergeWith from "callbag-merge-with";
import takeWhile from "callbag-take-while";
import { debounce } from "callbag-debounce";
import animationFrames from "callbag-animation-frames";
import { actionCreator } from "react-slash";
import fromFunction from "callbag-from-function";
import fromPromise from "callbag-from-promise";
import createApp from "./setup/createPixiApplication";
import { TilingSprite } from "pixi.js";
import createElements from "./setup/createElements";
import { nebulaConfig } from "./setup/nebulaConfig";

export default () => render(<PlayWithBags />, document.getElementById('react'));

let asset = null;

const {app:{stage}, assetsLoaded} = createApp(nebulaConfig);

const initial = {
  phase: 'splash',
  inspector: {x:0, y:0, maneuver: ship => ship.x += ship.speed, hull: 10, size: 3},
  rockets: [],
  enviroment: [],
  invaders: [],
};

const [NEXT_ROUND, nextRound] = actionCreator('next-round');
const [INVADER_MANEUVER, invaderManeuver] = actionCreator('invader-maneuver');
const [INSPECTOR_MANEUVER, inspectorManeuver] = actionCreator('inspector-maneuver');
const [INVADER_EXPLODED, invaderExploded] = actionCreator('invader-exploded');
const [INSPECTOR_EXPLODED, inspectorExploded] = actionCreator('inspector-exploded');
const [FIRE_ROCKET, fireRocket] = actionCreator('fire-rocket');
const [FORGET_ROCKET, forgetRocket] = actionCreator('forget-rocket');
const [GAME_OVER, gameOver] = actionCreator('game-over');
const [ESCAPE_FROM_ACTION, escapeFromAction] = actionCreator('escape-from-action');

const [GAME_ONE, gameOne] = actionCreator('game-one');
const [GAME_TWO, gameTwo] = actionCreator('game-two');
const [GAME_THREE, gameThree] = actionCreator('game-three');
const [EXIT_FROM_GAME, exitFromGame] = actionCreator('exit-from-game');
const [SPLASH_FADE_OUT, splashFadeOut] = actionCreator('splash-fade-out');
const [ASSET_READY, assetReady] = actionCreator('asset-ready');

const mainPage = ({resources}) => {
  const { galaxy, titleAsset } = createElements(resources);
  stage.addChild(galaxy);
  const title = titleAsset();
  title.position.set(100, 50)
  stage.addChild(title);

  asset = resources;
    
  return assetReady();
};

let state = initial;
function gameReducer({type, payload}) {
  switch (type) {
    case SPLASH_FADE_OUT: return {...state, phase: 'main'};

    case GAME_ONE: return {...state, phase: GAME_ONE};
    case GAME_TWO: return {...state, phase: GAME_TWO};
    case GAME_THREE: return {...state, phase: GAME_THREE};
    case GAME_OVER: return {...state, phase: 'main'};

    case NEXT_ROUND: return {...state, inspector: {...state.inspector, x: state.inspector.x + state.inspector.speed}};
    case INVADER_MANEUVER: return {...state, inspector: {...state.inspector, maneuver: payload }};
    case FIRE_ROCKET: 
      console.log('-- missile on space ! --')
      return {...state, rockets: [...state.rockets, 1]}
    default: return state;
  }
}

const jsonToString = p => {
  try {
    return JSON.stringify(p, null, 2);
  } catch(err) {
    return p
  }  
};

const mapTo = p => map( () => p );

const PlayWithBags = () => {
  const [content, setContent] = useState('-- callbag --');
  const log = p => setContent(d => d ? [d,p].join('\n') :  p );

  const middleware = action => map(p => {action(p); return p});
  const trace = console.log |> middleware;
  
  const maneuver = () => {}

  const stillPlaying = ({type}) => type != GAME_OVER;
  
  const gamePlay = () => 
    fromPromise(assetsLoaded.then(mainPage))
    |> mergeWith( animationFrames |> take(12) )
    |> mergeWith( interval(2000) |> take(1) |> mapTo(splashFadeOut()))
    |> mergeWith( fromEvent(document, 'keydown') |> filter(({key}) => key) |> map(({key}) => `press: ${key}`) )
    |> mergeWith( fromEvent(document, 'click') |> mapTo(fireRocket()))
    |> map(p => p == 'press: x' ? gameOver() : p )
    |> middleware(p => stillPlaying(p) ? null : log('-- end of session --'))  
    |> takeWhile( stillPlaying )
    |> middleware(p => log(jsonToString(p)))
    |> filter(({type}) => type)
    |> forEach(action => {      
      state = gameReducer(action)      
      state |> jsonToString |> log
    })

  useEffect(gamePlay, []);  

  return <main><pre>{content}</pre></main>;
};