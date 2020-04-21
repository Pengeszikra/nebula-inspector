import React, { useState, useEffect, useRef, forwardRef } from "react";
import { divFactory, factory } from "react-slash";
import gameReducer, {initialState, setOfActions, assetReady, saveDispatch} from "./state-management/gameReducer";
import MainMenu from "./component/MainMenu";
import useReducerActions from "../utils/useReducerActions";
import createPixiApplication from "../setup/createPixiApplication";
import { nebulaConfig } from "../setup/nebulaConfig";
import useSagaReducer from "use-saga-reducer";
import { rootSaga } from "./state-management/rootSaga";

const [Page] = factory(<main />, 'game-size-mock');
const [ScoreBoard] = divFactory('score-board');

export default () => {
  const [state, dispatch] = useSagaReducer(rootSaga, gameReducer, initialState);
  const mount = useRef(null);
      
  const initialize = dispatch => () => {
    const getRoot = () => mount.current;
    const {app, assetsLoaded} = createPixiApplication({...nebulaConfig, getRoot});
    assetsLoaded.then(({resources}) => {
      assetReady({app, resources}) |> dispatch;
      saveDispatch(dispatch) |> dispatch;
    });
  };
  
  useEffect(dispatch |> initialize, [mount]);
    
  const {menuLines, phase, isGamePlay, score} = state;

  return (
    <Page>
      <div ref={mount} className="game-view" />
      {phase === 'main' && <MainMenu menuLines={menuLines} dispatch={dispatch} />}
      {isGamePlay && <ScoreBoard>SCORE: {score}</ScoreBoard>}
    </Page>
  );
};