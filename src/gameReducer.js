import { actionCreator } from "react-slash";

export const initialState = {
  phase: 'splash',
  isAssetReady: false,
  isGamePlay: false,
  gameVersion: 0,
};

export const [NEXT_ROUND, nextRound] = actionCreator('next-round');
export const [GAME_OVER, gameOver] = actionCreator('game-over');
export const [ESCAPE_FROM_ACTION, escapeFromAction] = actionCreator('escape-from-action');

export const [GAME_ONE, gameOne] = actionCreator('game-one');
export const [GAME_TWO, gameTwo] = actionCreator('game-two');
export const [GAME_THREE, gameThree] = actionCreator('game-three');
export const [START_BUILDER, startBuilder] = actionCreator('start-builder');
export const [EXIT_FROM_GAME, exitFromGame] = actionCreator('exit-from-game');

export const [SPLASH_FADE_OUT, splashFadeOut] = actionCreator('splash-fade-out');
export const [ASSET_READY, assetReady] = actionCreator('asset-ready');

export default (state, {type, payload}) => {
  switch (type) {
    case ASSET_READY: return {...state, isAssetReady: true};
    case SPLASH_FADE_OUT: return {...state, phase: 'main', isGamePlay: false };
    case GAME_ONE: return {...state, phase: GAME_ONE, isGamePlay: true };
    case GAME_TWO: return {...state, phase: GAME_TWO, isGamePlay: true };
    case GAME_THREE: return {...state, phase: GAME_THREE, isGamePlay: true };
    case GAME_OVER: return {...state, phase: 'main', isGamePlay: false };

    default: return state;
  }
};