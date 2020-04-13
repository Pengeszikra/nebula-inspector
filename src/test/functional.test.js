import { set, deepGet, deepSet } from "../utils/job";

const setScale = set('scale');
const setPositionX = deepSet('position', 'x');
const setRotation = set('rotation');

test ('ordinary set scale test', () => {
  const data = { scale: 1 };
  setScale(.2)(data);
  expect(data).toEqual({scale: .2})  
});

test ('pipe operator set scale test', () => {
  const data = { scale: 1 };
  data |> setScale(.2);
  expect(data).toEqual({scale: .2})
});


test ('chain set test', () => {
  const data = {};
  data |> setScale(5) |> setRotation(8) 
  expect(data).toEqual({scale: 5, rotation: 8});
});

test ('deepGet parameters test', () => {
  const data = {position:{x: {speed: {foo:22}, vector: 1}}};
  const result = data |> deepGet('position', 'x', 'speed');
  expect(result).toEqual({foo:22})
  const short = {alfa: 76};
  expect( short |> deepGet('alfa')).toBe(76)  
});

test ('set position x test', () => {
  const data = {position:{x: 1}};
  data |> deepSet('position','x')(2);
  expect(data).toEqual({position:{x: 2}});
  const short = {alfa: 76};
  short |> deepSet('alfa')(8)
  expect(short).toEqual({alfa:8});
});