import {Application, utils, Sprite, TilingSprite, filters,  AnimatedSprite, BLEND_MODES} from "pixi.js";
import addSprite from "./addSprite";
import hitTest from "./hitTest";

export default () => {
  utils.skipHello();  
  const root = document.getElementById('root');
  const pixiApplicationConfig = {  width: 800, height: 600 };
  const app = new Application(pixiApplicationConfig);
  root.appendChild(app.view);
 
  const loadAssets = (loader, resources) => {    
    const bg = new TilingSprite(resources['./images/nb-texture-1.png'].texture, 2048, 2048);
    app.stage.addChild(bg);
    bg.tint = 0x55FFFF

    const layer1 = addSprite(app, resources)('./images/twin-moons.png', 0, 0);        

    layer1.scale.set(.9);
    let xp = 0, xp2 = 0, xp3 = 0, bp=0;    
    const speed = 5;
    const scroll = () => {
      layer1.position.set(xp + 1000, 0);
      bg.tilePosition.set(bp, 0);
      bp -= speed * .4;
      xp -= speed;
      xp2 -= speed * 1.3;
      xp3 -= speed * 1.7
      if (xp < -2300) {
        xp = 0, xp2 = 0, xp3 = 0;
      } 
      requestAnimationFrame( scroll );
    }
    requestAnimationFrame( scroll );

    loadSheet(resources);
  }

  app.loader.add([
    './images/twin-moons.png',
    './images/gun-pod.png',
    './images/nbi-sprite-sheet.png',
    './images/nb-texture-1.png',   
  ])
  .add('nbi','./images/nbi-sprite-sheet-1.json')
  .add('explosion','./images/explosion.json')
  .load(loadAssets);
  
  const loadSheet = resource => {
    const sheet = Object.keys(resource.nbi.textures).reduce(
      (collect, key) => ({...collect, [key]: resource.nbi.textures[key]})
    , {});

    // explosion
    const explosionTextures =  Object.keys(resource.explosion.textures).reduce(
      (collect, key) => [...collect, resource.explosion.textures[key]], []);

    const add = (name, x = 0, y = 0, scale = 1, parent = app.stage) => {
      const mob = new Sprite(sheet[name]);
      parent.addChild(mob);
      mob.position.set(x, y)
      mob.scale.set(scale);
      return mob;
    }
    
    const title = add('nebula-inspector')
    title.position.set(100,50)

    const base = new Sprite();
    app.stage.addChild(base)


    const ship = add('manta')
    ship.position.set(50, 300)
    ship.scale.set(.4);

    

    const shoot = side => {
      const rocket = add('rocket')
      rocket.position.set(ship.position.x, ship.position.y + side)
      rocket.scale.set(.4);

      const shoot = () => {
        rocket.position.x += 12;
        if (rocket.position.x > 700) {          
          const bumm = new AnimatedSprite(explosionTextures);
          app.stage.addChild(bumm)
          bumm.position = rocket.position
          bumm.position.x -= 50
          bumm.position.y -= 50
          bumm.play()
          bumm.animationSpeed = .5;
          bumm.tint = Math.random() * 0xFFFFFF
          bumm.loop = true;
          bumm.onLoop = () => bumm.destroy();
          
          rocket.destroy();
          return;
        };
        requestAnimationFrame(shoot)
      }
      requestAnimationFrame(shoot) 
    }

    ship.interactive = true;
    ship.buttonMode = true;

    let side = 10;
    const releaseRocket = () => {
      side = side !== 10 ? 10: 70;
      shoot(side)
    }
    
    ship.on('pointerdown', releaseRocket);
    
    app.stage.interactive = true;

    app.stage.on('mousemove', ({data:{global:{x, y}}}) => ship.position.set(x, y))

    
    const sKeys = Object.keys(sheet);

    const enemyes = sKeys.map(
      mob => add(mob, 100 * (Math.random() * sKeys.length), 400 - (Math.random() * 200), .8, base)
    );

    base.filters = [new filters.BlurFilter(2)];

    

    let ep = 1000;
    const enemyMoves = () => {
      ep -= 7;
      base.position.x = ep;
      if (ep < -7500) ep = 1000;
      requestAnimationFrame(enemyMoves)
    }
    requestAnimationFrame(enemyMoves)

    // target practices 

    const targets = [
      add('shileld', 300, 350, 1),
      add('graviton', 500, 200, 0.5),
      add('drones', 300, 300, .2)
    ]

    const destroy = ({position:{x,y}}) => {
      const bumm = new AnimatedSprite(explosionTextures);
      app.stage.addChild(bumm)
      bumm.position.set(x + (Math.random() * 100) - 50, y + (Math.random() * 100) - 50)
      bumm.rotation = Math.random()
      bumm.play()      
      bumm.animationSpeed = .6;
      bumm.loop = true;
      bumm.onLoop = () => bumm.destroy();
    }

    const collosionDetection = () => {
      targets.map(target => {
        if (hitTest(ship, target) && Math.random() > .9) {
          destroy(ship)          
        }
      })
      requestAnimationFrame(collosionDetection)
    }

    requestAnimationFrame(collosionDetection)

    app.stage.addChild(title)

  };
}


