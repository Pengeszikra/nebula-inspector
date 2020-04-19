import { Container } from "pixi.js";

export default (length = 1, stage = null) => {
  const layers = Array.from({length},  _ => new Container());
  stage && layers.forEach(layer => stage.addChild(layer));
  return layers;
};