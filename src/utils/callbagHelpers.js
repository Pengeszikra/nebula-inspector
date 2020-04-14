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
import wait from "callbag-wait";
import duration from "callbag-duration-progress";
import delay from "callbag-delay";

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

const saga = generator => animationFrames
  |> sample(fromIter(generator))
  |> takeWhile(isMoving => isMoving)
  |> forEach(_ => {});

export {
  empty, always, middleware, trace, jsonToString,
  fromIter, forEach, take, merge, map, filter,
  sample, interval, fromEvent, mergeWith, takeWhile,
  debounce, animationFrames, fromFunction, fromPromise,
  saga, wait, duration, delay
}