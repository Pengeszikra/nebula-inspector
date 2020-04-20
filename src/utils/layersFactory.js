import { Container } from "pixi.js";

export default (length = 1) => Array.from({length},  _ => new Container());
