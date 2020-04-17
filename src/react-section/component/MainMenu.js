import React from "react";
import { divFactory } from "react-slash";
import { gameOne, gameTwo, gameThree, startBuilder, exitFromGame } from "../state-management/gameReducer";

const [MenuWrapper, MenuButton] = divFactory('main-menu--wrapper', 'main-menu--button');

const MenuButtons = ({buttons, dispatch}) => buttons.map( 
  ({title, linkAction}, key) => 
    <MenuButton key={key} onClick={ _ => linkAction() |> dispatch }>{title}</MenuButton>
);
 
export default ({menuLines, dispatch}) => (
  <MenuWrapper>
    <MenuButtons buttons={menuLines} dispatch={dispatch} />
  </MenuWrapper>      
);
