import { take, put, fork, call, all } from 'redux-saga/effects';
import { EXIT_FROM_GAME, startBuilder, ASSET_READY, ROAD_TO } from './gameReducer';
import createElements from '../../setup/createElements';
import { Container } from 'pixi.js';
import animationFrames from 'callbag-animation-frames';
import { forEach } from 'callbag-basics';

export function * rootSaga () {  
  const {app, asset, resources} = yield call(saveAssetSaga);
  const {stage} = app;

  const layers = Array.from({length: 5},  _ => new Container());
  const [
    splashArea, 
    mainArea, 
    gameArea, 
    finishArea, 
    builderArea
  ] = layers;
  layers.forEach(layer => stage.addChild(layer));
 
  yield all([
    fork(roadHandlerSaga),
    fork(showSplashSaga, splashArea, asset),
    fork(showMainSaga, mainArea, asset),
  ]);
}

function * saveAssetSaga () {
  const {payload:{app, resources}} = yield take(ASSET_READY);
  const asset = createElements(resources);
  return {app, asset, resources};
}

function * roadHandlerSaga () {
  const {payload:target} = yield take(ROAD_TO);
}

function * showSplashSaga(stage, asset) {
  const {splashWithAction} = asset; 
  stage.addChild(splashWithAction);  
}

const scrollUpGalaxy = galaxy => 
  animationFrames 
    |> forEach(time => galaxy.tilePosition.set(0, - time / 10));

function * showMainSaga(mainArea, asset) {
  const { newGalaxy, sheet, mainNebula } = asset;
  const galaxy = newGalaxy();
  galaxy.tint = 0x55FFFF;
  mainArea.addChild(galaxy);
  galaxy.alpha = 4;
  scrollUpGalaxy(galaxy);
}