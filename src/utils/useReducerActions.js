import {useReducer} from 'react';

export default (reducer, initialState = {}, actionsObject) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const actions = Object.entries(actionsObject).reduce(
      (actionsSet, [key, action]) => ({...actionsSet, [key]:payload => dispatch(action(payload)) })
    , {});
  return {state, dispatch, ...actions};
}