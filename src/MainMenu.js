import React from "react";
import { divFactory } from "react-slash";
import { gameOne, gameTwo, gameThree, startBuilder, exitFromGame } from "./gameReducer";

const [MenuWrapper, MenuButton] = divFactory('main-menu--wrapper', 'main-menu--button');

const menuLines = [
  {title: 'GAME 1',  linkAction: gameOne},
  {title: 'GAME 2',  linkAction: gameTwo},
  {title: 'GAME 3',  linkAction: gameThree},
  {title: 'BUILDER', linkAction: startBuilder},
  {title: 'EXIT',    linkAction: exitFromGame},
];

const MenuButtons = ({buttons}) => buttons.map( 
  ({title, linkAction}, key) => <MenuButton key={key} onClick={linkAction}>{title}</MenuButton>
);

export default () => (
  <MenuWrapper>
    <MenuButtons buttons={menuLines} />
  </MenuWrapper>      
);
