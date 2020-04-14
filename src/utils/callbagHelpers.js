import { fromIter, forEach, take, merge, map, filter } from "callbag-basics";
import sample from "callbag-sample";
import interval from "callbag-interval";
import fromEvent from "callbag-from-event";
import mergeWith from "callbag-merge-with";
import takeWhile from "callbag-take-while";
import { debounce } from "callbag-debounce";
import animationFrames from "callbag-animation-frames";
import fromFunction from "callbag-from-function";
import fromPromise from "callbag-from-promise";
import last from "callbag-last";

const empty = () => {};
const always = value => map(() => value);
const middleware = action => map(value => {action(value); return value});
const trace = console.log |> middleware;
const jsonToString = json => {
  try {
    return JSON.stringify(json, null, 2);
  } catch(err) {
    return json;
  }  
};

// |> takeWhile((_ => galaxy.alpha <=10) |> atLast(_=>galaxy.alpha = 100)) 
export const atLast = lastAction => until => data => { 
  if (!until()) lastAction(data); 
  return until;
};

export {
  empty, always, middleware, trace, jsonToString,
  fromIter, forEach, take, merge, map, filter, last,
  sample, interval, fromEvent, mergeWith, takeWhile,
  debounce, animationFrames, fromFunction, fromPromise  
}