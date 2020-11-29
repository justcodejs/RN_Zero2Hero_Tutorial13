import {actionType} from '../actions/actionType';
import { fromJS } from 'immutable';

function initialState() {
  return fromJS({
    showCamera: false,
    lang: 'en',
    profilePhoto: require('../../../assets/icon.png'),
    enableCrashlytics: null  // 20201119 JustCode: For Crashlytics
  });
}

export default function reducer(state=initialState(), action) {
  if(typeof reducer.prototype[action.type] === "function") {
    return reducer.prototype[action.type](state, action);
  }
  else {
    return state;
  }
}

reducer.prototype[actionType.ui.showCamera] = (state, action) => {
  return state.set('showCamera', action.payload);
}

reducer.prototype[actionType.ui.setLanguage] = (state, action) => {
  return state.set('lang', action.payload);
}

reducer.prototype[actionType.ui.setProfilePhoto] = (state, action) => {
  return state.set('profilePhoto', action.payload);
}

reducer.prototype[actionType.ui.setCrashlytics] = (state, action) => {
  return state.set('enableCrashlytics', action.payload);
}
