import React, { useState, useEffect, useRef } from "react";
import { divFactory, factory } from "react-slash";
import gameReducer, {initialState, setOfActions} from "./gameReducer";
import MainMenu from "./MainMenu";
import useReducerActions from "./utils/useReducerActions";
import createPixiApplication from "./setup/createPixiApplication";
import { nebulaConfig } from "./setup/nebulaConfig";

const [Page] = factory(<main />, 'game-size-mock');
const [GameView] = factory(<section />, 'game-view');

export default () => {
  const [asset, setAsset] = useState(null);
  const mount = useRef(null);
  const {
    state:{phase, menuLines}, 
    assetReady, splashFadeOut, dispatch
  } = useReducerActions(gameReducer, initialState, setOfActions);
    
  const initialize = () => {
    const getRoot = () => mount.current;
    const {app:{stage}, assetsLoaded} = createPixiApplication({...nebulaConfig, getRoot});
    assetsLoaded.then(({resources}) => setAsset(resources));
  };
  
  useEffect(initialize, [mount]);
 
  return (
    <Page>
      <GameView>
        <canvas ref={mount} />
      </GameView>
      <MainMenu menuLines={menuLines} dispatch={dispatch} />
      <pre>{phase} {`react <- callbag -> pixi

        maybe the use-saga-reduce is a great way to use saga again ?
      `} </pre>
    </Page>
  );
};