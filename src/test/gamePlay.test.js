import { set, deepGet, deepSet } from "../utils/job";

// http://vitiy.info/easing-functions-for-your-animations/

/*

  t – time elapsed from start of animation
  b – start value
  c – value change
  d – duration of animation

*/

// https://animejs.com/documentation/#motionPath

// https://gist.github.com/gre/1650294

const ease = (t, b, c, d) => {
  
};
const addVector = ({x, y}) => vector => {vector.x += x; vector.y += y; return vector};
const moveBy = moving => config => mob => mob |> set('origo')( mob.origo |> moving(config) );
const moveByVector = moveBy(addVector);
const scale = set('scale');

const state = {
  invaders: {
    alfa: {
      art:'drones',
      transform: scale(.3),
      origo: {x: 15, y: 300},
      dimension:{ width:100, height:20 },
      movements: mob => mob |> moveByVector({x: -5, y: 0}),      
    },
    beta : {

    },
  }
};

test ('deepGet selection test', () => {
  expect(
    state |> deepGet(...('invaders.alfa.art'.split('.')))
  ).toBe('drones');
});

test ('addVector test', () => {
  const data = {x: 44, y: -22};
  data |> addVector({x: 1, y: 2});
  expect(data).toEqual({x: 45, y: -20});
});

test ('invader straight animation', () => {
  const {invaders:{alfa}} = state;
  [{x: 10, y: 300}, {x: 5, y: 300}, {x: 0, y: 300}, {x: -5, y: 300}].forEach(
    result => {
      alfa |> alfa.movements;
      expect(alfa.origo).toEqual(result);    
    }
  );
});