import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { fromIter, forEach, pipe, take, merge, map, filter } from "callbag-basics";
import sample from "callbag-sample";
import interval from "callbag-interval";
import fromEvent from "callbag-from-event";
import mergeWith from "callbag-merge-with";
import takeWhile from "callbag-take-while";
import { debounce } from "callbag-debounce";
import animationFrames from "callbag-animation-frames";

export default () => render(<PlayWithBags />, document.getElementById('root'));

const mapTo = p => map( () => p );

const PlayWithBags = () => {

  const [content, setContent] = useState('-- callbag --');
  const log = p => setContent(d => d ? [d,p].join('\n') :  p );

  const middleware = action => map(p => {action(p); return p});
  const trace = console.log |> middleware;
  
  const maneuver = () => {}

  const gamePlay = () => 
    animationFrames
    |> take(2)
    |> mergeWith( fromEvent(document, 'keydown') |> filter(({key}) => key) |> map(({key}) => `press: ${key}`) )
    |> mergeWith( fromEvent(document, 'click') |> mapTo('fire') )
    |> takeWhile( action => action != "fire")
    |> forEach(log)

  // merge
  const stream = () =>   
    merge(
      interval(200) |> sample(fromIter([11, 22, 'emit enemy'])),
      interval(200) |> take(6),    
      fromEvent(document, 'click') |> mapTo('click'),      
    )
    |> takeWhile(() => true) 
    |> forEach(log)

  // mergeWith
  const stream2 = () => 
    interval(200) 
    |> sample(fromIter([44, 55, 'emit enemy']))
    |> mergeWith(interval(200) |> take(6))  
    |> mergeWith( fromEvent(document, 'keydown') |> filter(({key}) => key) |> map(({key}) => `press: ${key}`) )
    |> mergeWith( fromEvent(document, 'click') |> mapTo('fire') )
    |> mergeWith( animationFrames |> take(10))
    |> takeWhile(() => true) 
    |> forEach(log)

  useEffect(gamePlay, []);  

  return <main><pre>{content}</pre></main>;
};