import { Sprite, TilingSprite, AnimatedSprite } from "pixi.js";

export default resources => {    
  const getSprite = name => new Sprite(resources[`./images/${name}`].texture);
  
  const newGalaxy = () => new TilingSprite(resources['./images/nb-texture-1.png'].texture, 2048, 2048);

  const mainNebula = getSprite('nebula-splash.jpg');
  const splashWithAction = getSprite('nebula-splash-with-action.jpg');
  //const splashOver = getSprite('splash-over.png');

  const twinMoon = getSprite('twin-moons.png');
  const sheet = Object.keys(resources.nbi.textures).reduce(
    (collector, key) => ({...collector, [key]: resources.nbi.textures[key]})
  , {});

  const explosionTextures =  Object.keys(resources.explosion.textures).reduce(
    (collector, key) => [...collector, resources.explosion.textures[key]], []
  );

  const titleAsset = () => new Sprite(sheet['nebula-inspector']);
  const newExplosion = () => new AnimatedSprite(explosionTextures);

  return {
    newGalaxy, twinMoon, sheet, titleAsset, newExplosion, resources,
    mainNebula, splashWithAction
  };
}