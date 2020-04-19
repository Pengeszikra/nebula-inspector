import { take, select, put, call } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import { ROAD_TO, getPhase, roadTo } from '../react-section/state-management/gameReducer';
import { animationFrames, wait, takeWhile, forEach, fromIter, sample, middleware } from '../utils/callbagCollectors';
import { easeOutQuad } from '../utils/easing';

const fadeOutProcess = frame => [...Array.from({length:frame}, (_, i) => easeOutQuad((frame - i) / frame) ), 0];

const fadeOut = () => eventChannel(emmiter => {
  animationFrames
    |> sample(fromIter(30 |> fadeOutProcess))
    |> wait(1000)
    |> middleware( alpha => { if (alpha <= 0) emmiter(END); })
    |> forEach(alpha => emmiter(alpha))
  
  return () => {};
});

export default function * roadHandlerSaga ({
  splashArea, 
  mainArea, 
  gameArea, 
  finishArea, 
  builderArea
}, asset) {  
  splashArea.visible = true;

  const fadeOutChannel = yield call(fadeOut, null);
  try {
    while(true) {
      let alpha = yield take(fadeOutChannel)
      console.log(`alpha: ${alpha}`)
    }
  } finally {
    console.log('at last')
  }

  console.log('-- over --');

  const {payload:target} = yield take(ROAD_TO);  
  const phase = yield select(getPhase);
  console.log(phase);
}