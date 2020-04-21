import { take, put, fork, call, all } from 'redux-saga/effects';
import { startBuilder, roadTo, splashFadeOut } from './gameReducer';
import createElements from '../../setup/createElements';
import { Container, Rectangle } from 'pixi.js';
import layersFactory from '../../utils/layersFactory';

import splashSaga from '../saga/splashSaga';
import mainSaga from '../saga/mainSaga';
import assetSaga from '../saga/assetSaga';
import roadHandlerSaga from '../saga/roadHandlerSaga';
import nebulaGameSaga from '../saga/nebulaGameSaga';
import finishSaga from '../saga/finishSaga';
import builderSaga from '../saga/builderSaga';
import { fadeOutPromise } from '../../utils/fadeOut';

export function * rootSaga () {    
  const {app, asset, resources} = yield call(assetSaga);
  const {stage} = app;

  const layers = layersFactory(5);
  const [ splashArea, mainArea, gameArea, finishArea, builderArea ] = layers;
  for(let layer of layers) {
    layer.visible = false;
    stage.addChild(layer);
  };
  
  yield all([
    fork(roadHandlerSaga, { splashArea, mainArea, gameArea, finishArea, builderArea }, asset),
    fork(splashSaga, splashArea, asset),
    fork(mainSaga, mainArea, asset),
    fork(nebulaGameSaga, gameArea, asset),
    fork(finishSaga, finishArea, asset),
    fork(builderSaga, builderArea, asset),
  ]);

  splashArea.visible = true;
  yield call(fadeOutPromise, splashArea, 30, 500);
  yield splashFadeOut() |> put;
  
}