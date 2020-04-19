# Redux Saga as main side effect coordinator in react hook application

As I created the first iteration of my demo game task, I was faced many hard controlled effects, because my plan is mix pixi with react, and that couse lot of problem, which I handled by callbags.

## 2nd iteration
I was found a great library call: **useSagaReducer** which one is help to use redux-saga whitout redux. Now with help of saga I can handle pixi states without mix with react state, that way seems much cleaner to me.

## Synchronize react parts with pixi

```js
  const {payload:route} = yield take(routeTo);  
  const phase = yield select(getPhase);
```