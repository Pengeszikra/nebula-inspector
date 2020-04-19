import { take, select, put, call } from 'redux-saga/effects';
import { ROAD_TO, getPhase, roadTo } from '../state-management/gameReducer';

export default function * roadHandlerSaga (
  {
    splashArea, 
    mainArea, 
    gameArea, 
    finishArea, 
    builderArea
  }, 
  asset
) {
  while (true) {
    const {payload:target} = yield take(ROAD_TO);  
    const phase = yield select(getPhase);
    console.log(`${phase} -> ${target}`);
  }
}