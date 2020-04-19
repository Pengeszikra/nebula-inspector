import { animationFrames, wait, forEach, fromIter, sample, middleware } from './callbagCollectors';
import { easeOutQuad } from './easing';

export const fadeOutData = time => [...Array.from({length:time}, (_, i) => easeOutQuad((time - i) / time) ), 0];

export const fadeOutPromise = (view, time, delay = 0) => new Promise( resolve =>  
  animationFrames
    |> sample(fromIter(time |> fadeOutData))
    |> wait(delay)
    |> middleware(alpha => {if (alpha ===0) resolve()})
    |> forEach(alpha => view.alpha = alpha)  
);

