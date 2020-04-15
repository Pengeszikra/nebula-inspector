import { Sprite, Point } from "pixi.js";
import {
  always, middleware, trace, jsonToString,
  fromIter, forEach, take, merge, map, filter, 
  sample, interval, fromEvent, mergeWith, takeWhile,
  debounce, animationFrames, fromFunction, fromPromise,
  saga,
  wait
} from "./utils/callbagCollectors";
import addSprite, { centerPivot } from "./utils/addSprite";
import sheetKeys from "./setup/sheetKeys";
import { allInvaders } from "./setup/sheetSets";

const toolDown = (tool, shape, layer) => {    
  const {x, y, width, height} = tool;
  const copy = addSprite(layer, true)(shape, x, y);
  copy.width = width;
  copy.height = height;
}

const toolSetup = (state, asset, areas) => {
  const {stage, layer1, layer2, layer3} = areas;
  const {sheet} = asset;

  let toolTexture = sheetKeys.redBlock;
  const tool = addSprite(stage, true)(sheet[toolTexture], -500, 250, .4);
    
  const drag = ({data:{global:{x, y}}}) => tool.position.set(x, y);

  function * toolIsReadyToAction (speed) {
    tool.interactive = true;
    tool.buttonMode = true;
    tool.on('pointerdown', () => toolDown(tool, sheet[toolTexture], layer3) )
    stage.interactive = true;
    stage.on('mousemove', drag);

    yield false
  }

  saga(toolIsReadyToAction(5));

  return tool;
}

export default (state, asset, stage) => ({gap, ...config}) => {  
  const { galaxy } = asset;
  // galaxy.tint = 0xFFFFFF;
  
  addSprite(stage)(galaxy); 

  const layer1 = new Sprite();
  const layer2 = new Sprite();
  const invaderArea = new Sprite(); 
  const buletArea = new Sprite();
  const rocketArea = new Sprite();
  const layer3 = new Sprite();
  const explodingArea = new Sprite();

  stage.addChild(buletArea, invaderArea,  rocketArea,  explodingArea, layer1, layer2, layer3);
  
  const areas = {stage, buletArea, invaderArea, rocketArea, explodingArea, layer1, layer2, layer3};
  
  const ship = toolSetup(state, asset, areas);

  const underBuilding = () => true;
 
  const scroll = time => {
    galaxy.tilePosition.set(- time / 30, 0)
    
  };
  animationFrames 
    |> takeWhile(underBuilding)
    |> forEach(scroll);

};