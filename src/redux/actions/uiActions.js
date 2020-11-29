import { actionType } from './actionType';
import Helper from '../../lib/helper';

export function setLanguage(lang) {
  Helper.updateDeviceLanguageToStorage(lang);
  return {
    type: actionType.ui.setLanguage,
    payload: lang
  }
}

export function showCamera(show) {
  return {
    type: actionType.ui.showCamera,
    payload: show
  }
}

export function setProfilePhoto(photo) {
  return {
    type: actionType.ui.setProfilePhoto,
    payload: photo
  }
}

// 20201119 JustCode: For Crashlytics
export function setCrashlytics(enable) {
  return {
    type: actionType.ui.setCrashlytics,
    payload: enable
  }
}
