import { take } from 'redux-saga/effects';
import { START_BUILDER } from '../state-management/gameReducer';
import levelBuilder from '../../-prepare-to-remove-/levelBuilder';

export default function * builderSaga (builderArea, asset) {
  yield take(START_BUILDER);  
  const level = {fireRate: 0.01,   gap:  800, ace: 0.05, maxSpeed: 10, paralaxWait:  4000 };
  level |> levelBuilder({}, asset, builderArea, () => {});
}