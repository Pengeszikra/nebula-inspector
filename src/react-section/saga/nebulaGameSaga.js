import { take, call, race, put, select, delay, actionChannel } from 'redux-saga/effects';
import { GAME_ONE, GAME_TWO, GAME_THREE, takeScore, TAKE_SCORE, gameOver } from '../state-management/gameReducer';
import playNebulaInspector from '../../-prepare-to-remove-/playNebulaInspector';
import { animationFrames, take as maxAmount, forEach, middleware, trace, interval, takeWhile, takeToFinally } from '../../utils/callbagCollectors';
import { eventChannel } from 'redux-saga';

const dificulties = [
  {fireRate: 0,      gap: 2000, ace: 0,    maxSpeed:  7, paralaxWait:  1000 },
  {fireRate: 0.01,   gap:  800, ace: 0.05, maxSpeed: 10, paralaxWait:  4000 },
  {fireRate: 0.015,  gap:  500, ace: 0.1,  maxSpeed: 14, paralaxWait: 12000 },
];

const callbagExample = () => eventChannel(emitter => {
  let stillRunning = true;
  let count = 100;
  interval(50)
    |> middleware( _ => count-- )
    |> takeToFinally( _ => count > 0,  _ => console.log('--- its over ---'))
    |> forEach(point => point |> takeScore |> emitter);

  return  _ => count <= 0;
});

export default function * nebulaGameSaga (gameArea, asset) {
  const [level1, level2, level3] = dificulties;
  const earnScore = point => takeScore(point);
  // const play = playNebulaInspector({earnScore}, asset, gameArea, () => {});
  const {payload} = yield take(GAME_ONE);
  gameArea.visible = true;

  
  // round of eventChannel 

  const play = playNebulaInspector({earnScore}, asset, gameArea, () => {});
  yield call(play, dificulties[payload]);

  const exampleChannel = yield call(callbagExample);
  while (true) {
    const result = yield take(exampleChannel);
    console.log(result)
    yield result |> put;
  }
}