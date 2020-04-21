import { take, call, race, put, select } from 'redux-saga/effects';
import { GAME_ONE, GAME_TWO, GAME_THREE, takeScore, TAKE_SCORE } from '../state-management/gameReducer';
import playNebulaInspector from '../../-prepare-to-remove-/playNebulaInspector';
import { Rectangle } from 'pixi.js';

const dificulties = [
  {fireRate: 0,      gap: 2000, ace: 0,    maxSpeed:  7, paralaxWait:  1000 },
  {fireRate: 0.01,   gap:  800, ace: 0.05, maxSpeed: 10, paralaxWait:  4000 },
  {fireRate: 0.015,  gap:  500, ace: 0.1,  maxSpeed: 14, paralaxWait: 12000 },
];

export default function * nebulaGameSaga (gameArea, asset) {
  const [level1, level2, level3] = dificulties;
  const dispatch = yield select(({dispatch}) => dispatch);
  const earnScore = point => takeScore(point) |> dispatch;
  const play = playNebulaInspector({earnScore}, asset, gameArea, () => {});
  const {payload} = yield take(GAME_ONE);
  gameArea.visible = true;
  
  yield call(play, dificulties[payload]);
  yield call(dispatch, takeScore(500));
  yield takeScore(777) |> put;
  
}