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
import takeToFinally from "./takeToFinally";

export {  
  fromIter, forEach, take, merge, map, filter,
  sample, interval, fromEvent, mergeWith, takeWhile,
  debounce, animationFrames, fromFunction, fromPromise,
  wait, duration, delay, takeToFinally,
}

export const empty = () => {};
export const always = value => map(() => value);
export const middleware = action => map(value => {action(value); return value});
export const trace = console.log |> middleware;
export const jsonToString = json => {
  try {
    return JSON.stringify(json, null, 2);
  } catch(err) {
    return json;
  }  
};

export const story = generator => animationFrames
  |> sample(fromIter(generator))
  |> takeWhile(isMoving => isMoving)
  |> forEach(_ => {});

export const storyWhile = (until = _ => true) => generator => animationFrames
  |> sample(fromIter(generator))
  |> takeWhile(isMoving => isMoving && until)
  |> forEach(_ => {});