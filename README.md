# Development process of introductory game task
This short game development task given from Play'n GO company: 

work title : **Nebula Inspector**

![splash screen space ship from nebula inspector](/sources/images/shileld.png)

*flagship of invader fleet*

# Declarative vs. Imperative programming

I will try to made this demo with declarative methodologi, There is a  [good example about FN game development](https://cheesecakelabs.com/blog/functional-programming-game-js/), but he right about the short deadline.

```js
const set = parameter => value => target => { target[parameter] = value; return value };
const setScale = set('scale');
const setPositionX = set('position')('x');
const setRotation = set('rotation');
const calc = calculus => parameter => value => target => {

};

const state = {
  inspector: {
    art: 'manta', 
    transform: setScale(.3) |> setRotation(22), // ship => {ship.scale(.3); return ship}
    origo: {x, y},
    dimension:{width, height},
    interaction: ship => 
  }
  invaders : [
    {
      id: 'invader433', 
      art:'drones', 
      transform: {},
      origo: {x, y},
      dimension:{width, height}, 
      movements:{

      }, 
      behaviour: mob => until(.3) |> fastForward |> until(.5) |> verticalRandom |> ramForward
      added: 383298 
    }
  ],
  terrain: {
    layers: [
      {
        id: 'layerOne',
        speedMultiplier: 3,
        checkCollosion: () => {}, 
        // or
        isCollosion: true,        
        obstacles: [
          {
            id: 'obstacle3443',
            art: 'obstacle-1',
            transformMatrix: [],
            dimension: {widt, height}
          }
        ]        
      }      
    ]
  }
}
```
*mix asset handling with state*

```js
  const alfa = {
    ...gravitonDefault
    deploy: mob => deployRandomPosition,
    behaviour: mob => 
      rail
      |> arm(doubleLaser) 
      |> until(.3) |> fastForward 
      |> until(.5) |> fire(3) |> verticalRandom 
      |> ramForward
  }
```
*Behaviour is rail chained functions compose for descript invader full lifecycle*

```js
  const rail = mob => [mob, ask, {id: mobId}]
  const arm = ([mob, ask, config]) => weapon => [mob, ask, {...config, weapon}]
  const until = ([mob, ask, config]) => delay => [mob, ask, {...config, delay}]
  const fastForward = ([mob, ask, config]) => {    
    const extra = ... ; 
    return [mob, ask, {...config, ...extra}];
  }

  // ask are sources of outer information like other mobs position and so like

  const fire = ([mob, ask, config]) => amount => {    
    const {radar, ship:{origo}} = ask;
    const extra = ... ; 
    return [mob, ask, {...config, ...extra}];
  }
```
*that rail goes input of lifeCycle generator which are process any mob*

```js
function * lifeCycle(rail) {

}

const lifeCycleProcessor = () => {
  // process lifeCycle
}
```
*implementation plan of lifeCycle*

```js
  const player = {
    behavior: ship => 
      rail      
      |> scoreCounting |> set(0)
      |> arm(dualRocket)
      |> arm(shield)
      |> animation(forward |> action(INTERACTION_ON))
      |> onPointerDown(launchRocket |> OnHit(gainScore |> ))
      |> onScreenPress(maneuver)
      |> checkCollosion(terrain |> invaders |> projectiles)
      |> onHullExploding(finalExplosions |> action(GAME_OVER))
  }
```
*behaviour of player*

**2nd solution this behavior is a callbag** *maybe that is much easier than generator counterpart*

> question: why need reducer ?

```js
const saga = generator => animationFrames
  |> sample(fromIter(generator))
  |> takeWhile(isMoving => isMoving)
  |> forEach(_ => {});
```
*callbag based generator use aka saga*

```js
const mantaSetup = (state, asset, areas) => {
  const {stage} = areas;
  const fire = fireSetup(state, asset, areas);
  const explode = explodeSetup(state, asset, areas);

  const {sheet} = asset;
  const manta = addSprite(stage, true)(sheet.manta, -500, 250, .4);
    
  const maneuver = ({data:{global:{x, y}}}) => manta.position.set(x, y);

  function * mantaIsReadyToAction (speed) {
    while(manta.position.x < 100) {      
      manta.position.x += speed
      yield true
    }
    manta.interactive = true;
    manta.buttonMode = true;
    manta.on('pointerdown', () => fire(manta))
    stage.interactive = true;
    stage.on('mousemove', maneuver);
    yield false
  }

  saga(mantaIsReadyToAction(5));

  return manta;
}
```
*usefull saga example*

### I was spend to much time for implement smooth turning

```js
export const smoothTurn = (turnAngle, maxTurning = 1) => {
  const steps = turnAngle / maxTurning | 0 + 1;
  return Array(steps).fill(turnAngle / steps);
}

        if (!turning.length && Math.random() < ace) { 
          vector.y = Math.random() * 8 - 4; 
          turning = smoothTurn(vector.y * 4, .1);
        }
        
        invader.angle = turning.length ? - turning.pop() : invader.angle;
```
*smooth turn relevant parts*

# Prepare 

### about functional programming paradigm

### Why I prefered callbag?
It is lightweight reactive/streaming programming utils, which give strength of made well organized flow.

## Blender for asset creation
I chosed [blender](https://www.blender.org/), becouse I had a lot of spaceship modell in my backpack. 
The new render mode: EEVEE give real time render with emission.
This reason blender is great oprion for quick original asset creation.
Sprite sheet generation a quite problematic parts of creation

### pipeline setup for VS code 
[Important stepp is, turn off](https://github.com/maestrow/pipeline-operator-in-js-howto): ```javascript.validate.enable : false```

# Building 

### Stack
  - javascript  
  - [pixijs](https://www.pixijs.com/)
  - typesript ```I'm afraid run out of time to try this```
  - parcel bundler  
  - [callbags](https://egghead.io/articles/comparing-callbags-to-rxjs-for-reactive-programming)
  - react
  - eslint
  - jest

### setup : ```yarn```
### build : ```yarn build```
### development: ```yarn start```
### test : ```yarn test```
### watch test : ```yarn watch```