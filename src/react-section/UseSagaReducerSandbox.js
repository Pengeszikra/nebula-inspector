import React, { useState, useEffect, useRef } from "react";
import { divFactory, factory } from "react-slash";
import gameReducer, {initialState, setOfActions, EXIT_FROM_GAME, startBuilder} from "./state-management/gameReducer";
import MainMenu from "./component/MainMenu";
import useReducerActions from "../utils/useReducerActions";
import createPixiApplication from "../setup/createPixiApplication";
import { nebulaConfig } from "../setup/nebulaConfig";
import useSagaReducer from "use-saga-reducer";
import { take, put } from 'redux-saga/effects';

const [Page] = factory(<main />, 'game-size-mock');
const [GameView] = factory(<section />, 'game-view');

function * rootSaga () {
  yield take(EXIT_FROM_GAME);
  console.log('root saga still works')
  yield put(startBuilder()); 
}

export default () => {
  const [asset, setAsset] = useState(null);
  const mount = useRef(null);
    
  const initialize = () => {
    const getRoot = () => mount.current;
    const {app:{stage}, assetsLoaded} = createPixiApplication({...nebulaConfig, getRoot});
    assetsLoaded.then(({resources}) => setAsset(resources));
  };
  
  useEffect(initialize, [mount]);
  const [state, dispatch] = useSagaReducer(rootSaga, gameReducer, initialState);
  const {menuLines, phase } = state;
 
  return (
    <Page>
      <GameView>
        <canvas ref={mount} />
      </GameView>
      <MainMenu menuLines={menuLines} dispatch={dispatch} />
      <pre>{`phase: ${phase}
        react <- callbag -> pixi
        maybe the use-saga-reduce is a great way to use saga again ?
      `} </pre>
    </Page>
  );
};