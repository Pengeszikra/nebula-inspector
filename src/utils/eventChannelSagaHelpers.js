import { take, call, put, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

export function * eventChannelSaga (eventChannelHandler) {
  const channel = yield call(eventChannelHandler);
  while (true) {
    const result = yield channel |> take;
    yield result |> put;
  }  
}

export const forkEventChannel = eventChannelHandler => fork(eventChannelSaga, eventChannelHandler);

export const emitterToFlow = (flow, ...params) => () => eventChannel( emitter => flow(emitter, ...params) );

export const forkFlowWithEmitter = (flow, ...params) => emitterToFlow(flow, ...params) |> forkEventChannel;