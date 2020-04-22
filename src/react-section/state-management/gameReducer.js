import { actionCreator } from "react-slash";
import { empty } from "../../utils/callbagCollectors";

export const [NEXT_ROUND, nextRound] = actionCreator('next-round');
export const [GAME_OVER, gameOver] = actionCreator('game-over');
export const [ESCAPE_FROM_ACTION, escapeFromAction] = actionCreator('escape-from-action');

export const [LAUNCH_GAME, launchGame] = actionCreator('launch-game');
export const [GAME_ONE, gameOne] = actionCreator('game-one');
export const [GAME_TWO, gameTwo] = actionCreator('game-two');
export const [GAME_THREE, gameThree] = actionCreator('game-three');
export const [START_BUILDER, startBuilder] = actionCreator('start-builder');
export const [EXIT_FROM_GAME, exitFromGame] = actionCreator('exit-from-game');
export const [TAKE_SCORE, takeScore] = actionCreator('take-score');
export const [SAVE_DISPATCH, saveDispatch] = actionCreator('save-dispatch');

export const [SPLASH_FADE_OUT, splashFadeOut] = actionCreator('splash-fade-out');
export const [ASSET_READY, assetReady] = actionCreator('asset-ready');

export const [ROAD_TO, roadTo] = actionCreator('road-to');

export default (state, {type, payload}) => {
  // console.log(type, payload)
  switch (type) {
    case ASSET_READY: return {...state, isAssetReady: true};
    case SPLASH_FADE_OUT: return {...state, phase: 'main', isGamePlay: false };
    case GAME_ONE: return {...state, phase: GAME_ONE, isGamePlay: true };
    case GAME_TWO: return {...state, phase: GAME_TWO, isGamePlay: true };
    case GAME_THREE: return {...state, phase: GAME_THREE, isGamePlay: true };
    case GAME_OVER: return {...state, phase: 'final', isGamePlay: false };
    case START_BUILDER: return {...state, phase: 'builder', isGamePlay: false};
    case TAKE_SCORE: return {...state, score: state.score + payload};
    // case EXIT_FROM_GAME: return {...state, phase: 'main', isGamePlay: false};
    case SAVE_DISPATCH: return {...state, dispatch: payload};

    default: return state;
  }
};

export const setOfActions = {
  nextRound,
  gameOver,
  escapeFromAction,
  gameOne,
  gameTwo,
  gameThree,
  startBuilder,
  exitFromGame,
  splashFadeOut,
  assetReady,
  launchGame,
};

export const initialState = {
  phase: 'splash',
  isAssetReady: false,
  isGamePlay: false,
  gameVersion: 0,
  score: 0,
  dispatch: empty,
  menuLines : [
    {title: 'GAME 1',  linkAction: _ => gameOne(0)},
    {title: 'GAME 2',  linkAction: _ => gameOne(1)},
    {title: 'GAME 3',  linkAction: _ => gameOne(2)},
    {title: 'BUILDER', linkAction: startBuilder},
    {title: 'EXIT',    linkAction: exitFromGame},
  ],
};

export const getPhase = state => state.phase;