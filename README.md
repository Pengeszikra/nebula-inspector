# Development process of intrudoctary game task
This short game development task given from Play'n GO company: 

work title : **Nebula Inspector**

![splash screen space ship from nebula inspector](/sources/images/shileld.png)

*flagship of invader fleet*

# Declarative vs. Imperative programming

Jó kérdés, hogy megéri-e az imperative programozást ráerőltetni a pixi.js -es alkalmazásra, aminek 
eredetileg OOP koncepciója van? Szerintem ha sikerül jól összerakni az asset kezelést a pure funkciókkal 
összerakott vezérléssel, akkor deklaratív és tesztelhető módon lehetne vezérelni mind a mozgásokat, mind
az interakcióak.

Itt egy [jó leírás a funkcionális játékprogram fejlesztésről](https://cheesecakelabs.com/blog/functional-programming-game-js/), de igaza van abban, hogy egy határidős feljesztésben nem túl szerencsés belevágni a funkcionális programozásba. De ez egy olyan példaprogram, amit a tervek szerint referenciának is használhatok, szóval szerintem nem lövök mellé azzal, hogy ezt az utat választom.

tehát a reakthoz hasonlóan egy (később talán 2) ```state```-et használok, és a callbag folyamatok ```action```-okon és ```reducer```-ekenn keresztül ezeket módosítják.

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
      attack: {

      }
      added: 383298 
    }
  ],
  terrain: {
    layers: [
      {
        id: 'layerOne',
        speedMultiplier: 3,
        checkCollosion: () => {}, // or
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
