import { Sprite, Point, Container } from "pixi.js";
import {
  always, middleware, trace, jsonToString,
  fromIter, forEach, take, merge, map, filter, 
  sample, interval, fromEvent, mergeWith, takeWhile,
  debounce, animationFrames, fromFunction, fromPromise,
  story, wait
} from "./../utils/callbagCollectors";
import addSprite, { centerPivot } from "./../utils/addSprite";
import { allInvaders, allShape } from "../setup/sheetSets";
import sheetKeys from "../setup/sheetKeys";

const toolSetup = (state, asset, areas, backToMain, stillWorking) => {
  const {stage, layer1, layer2, layer3} = areas;
  const {sheet} = asset;

  let index = 0;  
  let zoom = 1;
  let toolTexture = allShape[0];  
  let tool = new Container();
  stage.addChild(tool);

  const setTool = (i, z) => {
    index = i;
    toolTexture = allShape[i];  
    zoom = z;
    tool.removeChildren();
    addSprite(tool, true)(sheet[toolTexture], 0, 0, z);
    tool.calculateBounds();
  }

  setTool(11, .4);

  const toolDown = layer => {
    const {x, y} = tool;
    console.log(layer, x, y);
    const copy = addSprite(layer, true)(sheet[toolTexture], x, y, zoom);
  };
  

  const drag = ({data:{global:{x, y}}}) => tool.position.set(x, y);

  stage.interactive = true;
  stage.on('mousemove', drag);
  tool.interactive = true;
  tool.buttonMode = true;
  tool.interactiveChildren = true;
  tool.on('pointerdown', () => toolDown(layer3) )

  fromEvent(document, 'keydown') |> takeWhile(stillWorking) |> forEach( ({key}) => {
    console.log(key)
    switch(key) {
      case '+': return setTool(Math.min(index + 1, allShape.length), zoom);
      case '-': return setTool(Math.max(index - 1, 0), zoom);
      case '1': return setTool(index, .2);
      case '2': return setTool(index, .4);
      case '3': return setTool(index, .7);
      case '4': return setTool(index, 1);
      case '5': return setTool(index, 1.5);
      case 'z': return layer3.removeChildren(layer3.children.length - 1);
      case ' ': return toolDown(layer3);
      case 'Escape': 
        console.log('end of building')
        stage.position.set(-10000,-20000);
        tool.interactive = false;
        stage.interactive = false;
        stage.visible = false;
        backToMain();
        ;break;
    }
  })

  return tool;
}

export default (state, asset, stage, backToMain) => ({gap, ...config}) => {  
  const { newGalaxy } = asset;
  const galaxy = newGalaxy();
  galaxy.alpha = 3;
  galaxy.tint = 0x55FFCC;
  stage.visible = true;
  stage.addChild(galaxy);

  const layer1 = new Container();
  const layer2 = new Container();
  const invaderArea = new Container(); 
  const buletArea = new Container();
  const rocketArea = new Container();
  const layer3 = new Container();
  const explodingArea = new Container();

  stage.addChild(buletArea, invaderArea,  rocketArea,  explodingArea, layer1, layer2, layer3);
  
  const areas = {stage, buletArea, invaderArea, rocketArea, explodingArea, layer1, layer2, layer3};

  let stillWorking = () => stage.position.x === 0;
  
  const ship = toolSetup(state, asset, areas, backToMain, stillWorking);
 
  const scroll = time => {
    galaxy.tilePosition.set(- time / 30, 0)
    
  };
  animationFrames 
    |> takeWhile(stillWorking)
    |> forEach(scroll);
};