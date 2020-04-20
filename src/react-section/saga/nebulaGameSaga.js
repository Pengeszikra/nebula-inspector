import { take, call } from 'redux-saga/effects';
import { GAME_ONE } from '../state-management/gameReducer';
import playNebulaInspector from '../../-prepare-to-remove-/playNebulaInspector';

const dificulties = [
  {fireRate: 0,      gap: 2000, ace: 0,    maxSpeed:  7, paralaxWait:  1000 },
  {fireRate: 0.01,   gap:  800, ace: 0.05, maxSpeed: 10, paralaxWait:  4000 },
  {fireRate: 0.015,  gap:  500, ace: 0.1,  maxSpeed: 14, paralaxWait: 12000 },
];

export default function * nebulaGameSaga (gameArea, asset) {
  const [level1, level2, level3] = dificulties;

  const play = playNebulaInspector({}, asset, gameArea, () => {});

  yield take(GAME_ONE);
  gameArea.visible = true;
  yield call(play, level1);
}