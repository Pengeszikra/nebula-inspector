import { take, put } from 'redux-saga/effects';

export default function * splashSaga(splashArea, asset) {
  const {splashWithAction} = asset;
  splashArea.addChild(splashWithAction);
}