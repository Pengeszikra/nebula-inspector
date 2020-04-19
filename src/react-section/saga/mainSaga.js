import { take } from 'redux-saga/effects';
import animationFrames from 'callbag-animation-frames';
import { forEach, takeWhile, filter } from '../../utils/callbagCollectors';
import { ROAD_TO, SPLASH_FADE_OUT } from '../state-management/gameReducer';

let scrolling = false;

const scrollUpGalaxy = galaxy => 
  animationFrames 
    |> filter( _ => scrolling)
    |> takeWhile( _ => !!galaxy)
    |> forEach(time => galaxy.tilePosition.set(0, - time / 10));

export default function * mainSaga(mainArea, asset) {
  const { newGalaxy, sheet, mainNebula } = asset;
  
  const galaxy = newGalaxy();
  galaxy.tint = 0x55FFFF;
  galaxy.alpha = 4;
  mainArea.addChild(galaxy);
  scrollUpGalaxy(galaxy);
  
  yield take(SPLASH_FADE_OUT);
  mainArea.visible = true;
  scrolling = true;  
  yield take(ROAD_TO);
  scrolling = false;
}