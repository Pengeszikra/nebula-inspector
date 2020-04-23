import { take, call, race, put, select, delay, actionChannel, fork } from 'redux-saga/effects';
import { GAME_ONE, GAME_TWO, GAME_THREE, takeScore, TAKE_SCORE, gameOver } from '../state-management/gameReducer';

import { animationFrames, take as maxAmount, forEach, middleware, trace, interval, takeWhile, takeToFinally, empty } from '../../utils/callbagCollectors';
// import { eventChannel } from 'redux-saga';
import { forkEventChannel, emitterToFlow, forkFlowWithEmitter } from '../../utils/eventChannelSagaHelpers';
import playNebulaInspector from '../../missions/playNebulaInspector';

const dificulties = [
  {fireRate: 0,      gap: 2000, ace: 0,    maxSpeed:  7, paralaxWait:  1000 },
  {fireRate: 0.01,   gap:  800, ace: 0.05, maxSpeed: 10, paralaxWait:  4000 },
  {fireRate: 0.015,  gap:  500, ace: 0.1,  maxSpeed: 14, paralaxWait: 12000 },
];

export default function * nebulaGameSaga (gameArea, asset) {
  const [level1, level2, level3] = dificulties;
  const {payload} = yield take(GAME_ONE);
  gameArea.visible = true;

  yield forkFlowWithEmitter(playNebulaInspector, asset, gameArea, dificulties[payload]);
}