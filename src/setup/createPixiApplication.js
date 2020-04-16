import {Application, utils} from "pixi.js";
import { empty } from "../utils/callbagCollectors";

export default (config) => {  
  const {pixiConfig = {}, loaderFrom = empty, getRoot = empty, autoAdd = false} = config;

  utils.skipHello();  
  const app = new Application(pixiConfig);
  const addApp = () => getRoot().appendChild(app.view);
  const loader = loaderFrom(app);
  const assetsLoaded = new Promise(result => loader.load(result));
  autoAdd && addApp();

  return { app, addApp, loader, assetsLoaded };
}