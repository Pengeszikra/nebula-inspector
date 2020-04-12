import {Application, utils} from "pixi.js";

const nil = ()=>{};

export default (config) => {  
  const {pixiConfig = {}, loaderFrom = nil, getRoot = nil, autoAdd = false} = config;

  utils.skipHello();  
  const app = new Application(pixiConfig);
  const addApp = () => getRoot().appendChild(app.view);
  const loader = loaderFrom(app);
  const assetsLoaded = new Promise(result => loader.load(result));
  autoAdd && addApp();

  return { app, addApp, loader, assetsLoaded };
}