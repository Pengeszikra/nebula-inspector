import React, { useState, useEffect, useRef } from "react";
import { divFactory, factory } from "react-slash";
import gameReducer, { gameOne, gameTwo, gameThree, startBuilder, exitFromGame } from "./gameReducer";
import MainMenu from "./MainMenu";

const [Page] = factory(<main />, 'game-size-mock');
const [GameView] = factory(<section />, 'game-view');

export default () => {
  const [asset, setAsset] = useState(null);
  const mount = useRef(null);
  const [state] = useReducerActions(gameReducer);
  // useEffect( _ => assetsLoaded.then(({resources}) => setAsset(resources)) , []);
  useEffect( _ => console.log(mount.current), [mount]);

  return (
    <Page>
      <GameView>
        <canvas ref={mount} />
      </GameView>
      <MainMenu />
    </Page>
  );
};