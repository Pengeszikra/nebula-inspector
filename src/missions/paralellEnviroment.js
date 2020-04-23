import { Container, Sprite, Point, filters, SpriteMaskFilter } from "pixi.js";
import {
  always, middleware, trace, jsonToString, wait,
  fromIter, forEach, take, merge, map, filter, 
  sample, interval, fromEvent, mergeWith, takeWhile,
  debounce, animationFrames, fromFunction, fromPromise, takeToFinally, 
} from "../utils/callbagCollectors";
import addSprite, { centerPivot } from "../utils/addSprite";
import sheetKeys from "../setup/sheetKeys";
import { allInvaders, enviroment } from "../setup/sheetSets";
import { easeInOutQuad, easeInOutQuint } from "../utils/easing";
import { AdjustmentFilter } from '@pixi/filter-adjustment';
import { story } from "../utils/callbagCollectors";
import layersFactory from "../utils/layersFactory";
import { takeScore, roadTo } from "../react-section/state-management/gameReducer";


const pickOne = array => array[array.length * Math.random() | 0];

const fillLayer = (stage, asset, layer, config) => {
  const {sheet} = asset;
  const {getSize, getVertical} = config;

  addSprite(layer, true)(
    sheet[enviroment |> pickOne], 
    1500 - layer.position.x, 
    Math.random() * 600,
    [.2, .4, .7, 1] |> pickOne
  )
};

  // https://pixijs.io/pixi-filters/tools/demo/ 
  // https://ihatetomatoes.net/how-to-work-with-images-and-pixi-js/


const colorMatrix = [
  //R  G  B  A
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
];

export default (emitter, asset, stage, galaxy, [layer1, layer2, layer3], gap, paralaxWait, config, stillPlay) => {  

  const scroll = time => {
    galaxy.tilePosition.set(- time * .1, 0);
    layer1.position.x = - time * .2;
    layer2.position.x = - time * .3;
    layer3.position.x = - time * .4;
  };

  animationFrames 
    |> takeToFinally(stillPlay,  _ => roadTo('main') |> emitter)
    |> forEach(scroll);
  

  const cmFilter1 = new filters.ColorMatrixFilter();
  cmFilter1.matrix = [...colorMatrix];
  layer1.filters = [    
    new filters.BlurFilter(4),
    cmFilter1
  ];
  cmFilter1.sepia(true);
  cmFilter1.hue(40);
  

  const cmFilter2 = new filters.ColorMatrixFilter();
  cmFilter2.matrix = [...colorMatrix];
  layer2.filters = [
    new filters.BlurFilter(2),
    cmFilter2
  ];
  cmFilter2.sepia(true);
  cmFilter2.hue(45);

  const cmFilter3 = new filters.ColorMatrixFilter();
  cmFilter3.matrix = [...colorMatrix];
  layer3.filters = [
    cmFilter3
  ];
  cmFilter3.sepia(true);
  cmFilter3.hue(50);
  
  
  const generateEnviroment = (layer, rate, config) => interval(rate) 
    |> take(500)
    |> wait(paralaxWait)
    |> takeWhile(stillPlay)
    |> forEach( _ => fillLayer(stage, asset, layer, config));

  generateEnviroment(
    layer1, 700, 
    {
      getVertical: _ => Math.random() * 600,
      getSize    : _ => [.2, .4, .7] |> pickOne
    }
  );

  generateEnviroment(
    layer2, 1000, 
    {
      getVertical: _ => Math.random() |> easeInOutQuint * 600,
      getSize    : _ => [.4, .7, 1] |> pickOne
    }
  );

  generateEnviroment(
    layer3, 1500, 
    {
      getVertical: _ => Math.random() |> easeInOutQuint * 600,
      getSize    : _ => [.5, .8, 1.2] |> pickOne
    }
  );
}