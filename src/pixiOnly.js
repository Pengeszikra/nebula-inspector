import {Application, utils, Sprite} from "pixi.js";
import addSprite from "./addSprite";

export default () => {
  utils.skipHello();  
  const pixiApplicationConfig = {  resizeTo: window };
  const app = new Application(pixiApplicationConfig);
  document.body.appendChild(app.view);
  console.log('--- pixijs simple scroll test ---')
 
  const loadAssets = (loader, resources) => {    
    // console.log(resources);
    const layer1 = addSprite(app, resources)('./images/twin-moons.png', 0, 0);        
    const layer2 = addSprite(app, resources)('./images/gun-pod.png', 0, 0);        
    layer1.scale.set(.9);
    layer2.scale.set(.8);
    let xp = 0, xp2 = 0;    
    const speed = 5;
    const scroll = () => {
      layer1.position.set(xp + 1000, 0);
      layer2.position.set(xp2 + 1400, 0);
      xp -= speed;
      xp2 -= speed * 1.3;
      xp > -2500 && requestAnimationFrame( scroll );
    }
    requestAnimationFrame( scroll );
  }

  app.loader.add([
    './images/twin-moons.png',
    './images/gun-pod.png'

  ]).load(loadAssets);
}