import { take, race } from 'redux-saga/effects';
import animationFrames from 'callbag-animation-frames';
import { forEach, takeWhile, filter } from '../../utils/callbagCollectors';
import { ROAD_TO, SPLASH_FADE_OUT, GAME_ONE, GAME_TWO, GAME_THREE, START_BUILDER, EXIT_FROM_GAME } from '../state-management/gameReducer';
import sheetKeys from '../../setup/sheetKeys';
import { Sprite } from 'pixi.js';

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

  const title = new Sprite(sheet[sheetKeys.nebulaInspector]);
  mainArea.addChild(title);
  title.position.set(120, 50);
  title.interactive = true;
  title.buttonMode = true;
  title.on('pointerup', console.log)

  yield race([
    take(GAME_ONE),
    take(GAME_TWO),
    take(GAME_THREE),
    take(START_BUILDER),
    take(EXIT_FROM_GAME),
  ]);
  
  title.position.y = -1000;
  scrolling = false;
}