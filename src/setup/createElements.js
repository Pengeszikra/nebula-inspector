import { Sprite, TilingSprite, AnimatedSprite } from "pixi.js";

export default resources => {    
  const galaxy = new TilingSprite(resources['./images/nb-texture-1.png'].texture, 2048, 2048);
  galaxy.tint = 0x55FFFF

  const twinMoon = new Sprite(resources['./images/twin-moons.png'].texture);        
  const sheet = Object.keys(resources.nbi.textures).reduce(
    (collector, key) => ({...collector, [key]: resources.nbi.textures[key]})
  , {});

  const explosionTextures =  Object.keys(resources.explosion.textures).reduce(
    (collector, key) => [...collector, resources.explosion.textures[key]], []
  );

  const titleAsset = () => new Sprite(sheet['nebula-inspector']);
  const newExplosion = () => new AnimatedSprite(explosionTextures);

  return {galaxy, twinMoon, sheet, titleAsset, newExplosion, resources}
}