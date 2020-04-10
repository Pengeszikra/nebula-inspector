import {Application, utils, Sprite} from "pixi.js";
import addSprite from "./addSprite";

export default () => {
  utils.skipHello();  
  const root = document.getElementById('root');
  console.log(root)
  const pixiApplicationConfig = {  width: 800, height: 600 };
  const app = new Application(pixiApplicationConfig);
  root.appendChild(app.view);
  console.log('--- pixijs simple scroll test ---')
 
  const loadAssets = (loader, resources) => {    
    // console.log(resources);
    const layer1 = addSprite(app, resources)('./images/twin-moons.png', 0, 0);        
    const layer2 = addSprite(app, resources)('./images/gun-pod.png', 0, 0);    
    const ships = addSprite(app, resources)('./images/eeve-render.png', 0, 0);            
    layer1.scale.set(.9);
    layer2.scale.set(.8);
    ships.scale.set(.5);
    let xp = 0, xp2 = 0, xp3 = 0;    
    const speed = 5;
    const scroll = () => {
      layer1.position.set(xp + 1000, 0);
      layer2.position.set(xp2 + 1400, 0);
      ships.position.set(xp3 + 1200, -500);
      xp -= speed;
      xp2 -= speed * 1.3;
      xp3 -= speed * 1.7
      if (xp < -2300) {
        xp = 0, xp2 = 0, xp3 = 0;
      } 
      requestAnimationFrame( scroll );
    }
    requestAnimationFrame( scroll );
  }

  app.loader.add([
    './images/twin-moons.png',
    './images/gun-pod.png',
    './images/eeve-render.png',
  ]).load(loadAssets);
}