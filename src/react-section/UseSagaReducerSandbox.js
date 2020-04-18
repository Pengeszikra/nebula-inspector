import React, { useState, useEffect, useRef, forwardRef } from "react";
import { divFactory, factory } from "react-slash";
import gameReducer, {initialState, setOfActions, assetReady} from "./state-management/gameReducer";
import MainMenu from "./component/MainMenu";
import useReducerActions from "../utils/useReducerActions";
import createPixiApplication from "../setup/createPixiApplication";
import { nebulaConfig } from "../setup/nebulaConfig";
import useSagaReducer from "use-saga-reducer";
import { rootSaga } from "./state-management/rootSaga";

const [Page] = factory(<main />, 'game-size-mock');

export default () => {
  const [asset, setAsset] = useState(null);
  const [state, dispatch] = useSagaReducer(rootSaga, gameReducer, initialState);
  const mount = useRef(null);
      
  const initialize = dispatch => () => {
    const getRoot = () => mount.current;
    const {app, assetsLoaded} = createPixiApplication({...nebulaConfig, getRoot});
    assetsLoaded.then(({resources}) => {
      setAsset(resources);
      assetReady({app, resources}) |> dispatch;
    });
  };
  
  useEffect(dispatch |> initialize, [mount]);
    
  const {menuLines, phase} = state;

  return (
    <Page>
      <div ref={mount} className="game-view" />
      <MainMenu menuLines={menuLines} dispatch={dispatch} />

      <pre id="debug">{`phase: ${phase}\n\nasset: \n\t${asset && Object.keys(asset).join('\n\t')}
        
        now lets prove of useSagaReducer is worth or not
      `} </pre>
    </Page>
  );
};