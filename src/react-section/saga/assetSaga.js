import { take } from 'redux-saga/effects';
import { ASSET_READY } from '../state-management/gameReducer';
import createElements from '../../setup/createElements';

export default function * assetSaga () {
  const {payload:{app, resources}} = yield take(ASSET_READY);
  const asset = createElements(resources);
  return {app, asset, resources};
}