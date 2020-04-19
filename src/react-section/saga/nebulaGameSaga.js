import { take } from 'redux-saga/effects';
import { GAME_ONE } from '../state-management/gameReducer';

export default function * nebulaGameSaga (gameArea, asset) {
  yield take(GAME_ONE);
}