import { actionCreator } from "react-slash";

export const initialState = {
  phase: 'splash',
  inspector: {x:0, y:0, maneuver: ship => ship.x += ship.speed, hull: 10, size: 3},
  rockets: [],
  enviroment: [],
  invaders: [],
  isAssetReady: false,
};

export const [NEXT_ROUND, nextRound] = actionCreator('next-round');
export const [INVADER_MANEUVER, invaderManeuver] = actionCreator('invader-maneuver');
export const [INSPECTOR_MANEUVER, inspectorManeuver] = actionCreator('inspector-maneuver');
export const [INVADER_EXPLODED, invaderExploded] = actionCreator('invader-exploded');
export const [INSPECTOR_EXPLODED, inspectorExploded] = actionCreator('inspector-exploded');
export const [FIRE_ROCKET, fireRocket] = actionCreator('fire-rocket');
export const [FORGET_ROCKET, forgetRocket] = actionCreator('forget-rocket');
export const [GAME_OVER, gameOver] = actionCreator('game-over');
export const [ESCAPE_FROM_ACTION, escapeFromAction] = actionCreator('escape-from-action');

export const [GAME_ONE, gameOne] = actionCreator('game-one');
export const [GAME_TWO, gameTwo] = actionCreator('game-two');
export const [GAME_THREE, gameThree] = actionCreator('game-three');
export const [EXIT_FROM_GAME, exitFromGame] = actionCreator('exit-from-game');
export const [SPLASH_FADE_OUT, splashFadeOut] = actionCreator('splash-fade-out');
export const [ASSET_READY, assetReady] = actionCreator('asset-ready');

export default (state, {type, payload}) => {
  switch (type) {
    case ASSET_READY: return {...state, isAssetReady: true};
    case SPLASH_FADE_OUT: return {...state, phase: 'main'};

    case GAME_ONE: return {...state, phase: GAME_ONE};
    case GAME_TWO: return {...state, phase: GAME_TWO};
    case GAME_THREE: return {...state, phase: GAME_THREE};
    case GAME_OVER: return {...state, phase: 'main'};

    case NEXT_ROUND: return {...state, inspector: {...state.inspector, x: state.inspector.x + state.inspector.speed}};
    case INVADER_MANEUVER: return {...state, inspector: {...state.inspector, maneuver: payload }};
    case FIRE_ROCKET: return {...state, rockets: [...state.rockets, 1]}
    default: return state;
  }
};