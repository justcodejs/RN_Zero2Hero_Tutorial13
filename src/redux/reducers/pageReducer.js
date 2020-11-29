import {actionType} from '../actions/actionType';
import { fromJS } from 'immutable';

function initialState() {
  return fromJS({
    search: {
      userWord: '', 
      errorMsg: '', 
      loading: false, 
      definition: null, 
      showCamera: false,
      showWordList: false, 
      recogonizedText: null
    },
    fav : {
      favList: [], 
      errorMsg: '', 
      loading: false, 
      loaded: false
    },
    favDetail: {
      errorMsg: '', 
      loading: false, 
      definition: null
    },
    // 20200825 JustCode - Firebase Auth Implementation
    login: {
      email: '',
      password: '',
      errorMsg: '', 
      loading: false, 
      loaded: false
    }
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

reducer.prototype[actionType.page.pageSearchSetUserWord] = (state, action) => {
  return state.setIn('search.userWord'.split('.'), action.payload);
}

reducer.prototype[actionType.page.pageSearchSetError] = (state, action) => {
  return state.setIn('search.errorMsg'.split('.'), action.payload);
}

reducer.prototype[actionType.page.pageSearchSetLoading] = (state, action) => {
  return state.setIn('search.loading'.split('.'), action.payload);
}

reducer.prototype[actionType.page.pageSearchShowCamera] = (state, action) => {
  return state.setIn('search.showCamera'.split('.'), action.payload);
}

reducer.prototype[actionType.page.pageSearchSetState] = (state, action) => {
  let keys = Object.keys(action.payload);

  if(keys.length <= 0)
    return state;

  let newState = state;

  for(let idx=0; idx < keys.length; idx++) {
    newState = newState.setIn(['search', keys[idx]], action.payload[keys[idx]]);
  }
  
  return newState;
}

reducer.prototype[actionType.page.pageFavLoadListPending] = (state, action) => {
  return state.setIn('fav.loading'.split('.'), true)
              .setIn('fav.loaded'.split('.'), false)
              .setIn('fav.favList'.split('.'), [])
              .setIn('fav.errorMsg'.split('.'), '');
}

reducer.prototype[actionType.page.pageFavLoadListRejected] = (state, action) => {
  return state.setIn('fav.loading'.split('.'), false)
              .setIn('fav.loaded'.split('.'), false)
              .setIn('fav.favList'.split('.'), [])
              .setIn('fav.errorMsg'.split('.'), action.payload);
}

reducer.prototype[actionType.page.pageFavLoadListFulfilled] = (state, action) => {
  return state.setIn('fav.loading'.split('.'), false)
              .setIn('fav.loaded'.split('.'), true)
              .setIn('fav.favList'.split('.'), action.payload)
              .setIn('fav.errorMsg'.split('.'), '');
}

reducer.prototype[actionType.page.pageFavDetailSetError] = (state, action) => {
  return state.setIn('favDetail.errorMsg'.split('.'), action.payload);
}

reducer.prototype[actionType.page.pageFavDetailSetLoading] = (state, action) => {
  return state.setIn('favDetail.loading'.split('.'), action.payload);
}

reducer.prototype[actionType.page.pageFavDetailSetState] = (state, action) => {
  let keys = Object.keys(action.payload);

  if(keys.length <= 0)
    return state;

  let newState = state;

  for(let idx=0; idx < keys.length; idx++) {
    newState = newState.setIn(['favDetail', keys[idx]], action.payload[keys[idx]]);
  }
  
  return newState;
}

// 20200825 JustCode - Firebase Auth Implementation
reducer.prototype[actionType.page.pageLoginSetEmail] = (state, action) => {
  return state.setIn('login.email'.split('.'), action.payload);
}

reducer.prototype[actionType.page.pageLoginSetPassword] = (state, action) => {
  return state.setIn('login.password'.split('.'), action.payload);
}

reducer.prototype[actionType.page.pageLoginSetError] = (state, action) => {
  return state.setIn('login.errorMsg'.split('.'), action.payload);
}

reducer.prototype[actionType.page.pageLoginAuthPending] = (state, action) => {
  return state.setIn('login.errorMsg'.split('.'), '')
              .setIn('login.loading'.split('.'), true)
              .setIn('login.loaded'.split('.'), false);
}

reducer.prototype[actionType.page.pageLoginAuthFulfilled] = (state, action) => {
  return state.setIn('login.errorMsg'.split('.'), '')
              .setIn('login.loading'.split('.'), false)
              .setIn('login.loaded'.split('.'), true);
}

reducer.prototype[actionType.page.pageLoginAuthRejected] = (state, action) => {
  return state.setIn('login.errorMsg'.split('.'), action.payload)
              .setIn('login.loading'.split('.'), false)
              .setIn('login.loaded'.split('.'), false);
}

reducer.prototype[actionType.page.pageLoginSignUpPending] = (state, action) => {
  return state.setIn('login.errorMsg'.split('.'), '')
              .setIn('login.loading'.split('.'), true)
              .setIn('login.loaded'.split('.'), false);
}

reducer.prototype[actionType.page.pageLoginSignUpFulfilled] = (state, action) => {
  return state.setIn('login.errorMsg'.split('.'), '')
              .setIn('login.loading'.split('.'), false)
              .setIn('login.loaded'.split('.'), true);
}

reducer.prototype[actionType.page.pageLoginSignUpRejected] = (state, action) => {
  return state.setIn('login.errorMsg'.split('.'), action.payload)
              .setIn('login.loading'.split('.'), false)
              .setIn('login.loaded'.split('.'), false);
}

reducer.prototype[actionType.page.pageLoginLogoutPending] = (state, action) => {
  return state.setIn('login.errorMsg'.split('.'), '')
              .setIn('login.loading'.split('.'), true)
              .setIn('login.loaded'.split('.'), false);
}

reducer.prototype[actionType.page.pageLoginLogoutFulfilled] = (state, action) => {
  return state.setIn('login.errorMsg'.split('.'), '')
              .setIn('login.loading'.split('.'), false)
              .setIn('login.loaded'.split('.'), true);
}

reducer.prototype[actionType.page.pageLoginLogoutRejected] = (state, action) => {
  return state.setIn('login.errorMsg'.split('.'), '')
              .setIn('login.loading'.split('.'), false)
              .setIn('login.loaded'.split('.'), false);
}

reducer.prototype[actionType.page.pageLoginForgetPwdPending] = (state, action) => {
  return state.setIn('login.errorMsg'.split('.'), '')
              .setIn('login.loading'.split('.'), true)
              .setIn('login.loaded'.split('.'), false);
}

reducer.prototype[actionType.page.pageLoginForgetPwdFulfilled] = (state, action) => {
  return state.setIn('login.errorMsg'.split('.'), '')
              .setIn('login.loading'.split('.'), false)
              .setIn('login.loaded'.split('.'), true);
}

reducer.prototype[actionType.page.pageLoginForgetPwdRejected] = (state, action) => {
  return state.setIn('login.errorMsg'.split('.'), action.payload)
              .setIn('login.loading'.split('.'), false)
              .setIn('login.loaded'.split('.'), false);
}

reducer.prototype[actionType.page.pageLoginGoogleAuthPending] = (state, action) => {
  return state.setIn('login.errorMsg'.split('.'), '')
              .setIn('login.loading'.split('.'), true)
              .setIn('login.loaded'.split('.'), false);
}

reducer.prototype[actionType.page.pageLoginGoogleAuthFulfilled] = (state, action) => {
  return state.setIn('login.errorMsg'.split('.'), '')
              .setIn('login.loading'.split('.'), false)
              .setIn('login.loaded'.split('.'), true);
}

reducer.prototype[actionType.page.pageLoginGoogleAuthRejected] = (state, action) => {
  return state.setIn('login.errorMsg'.split('.'), action.payload)
              .setIn('login.loading'.split('.'), false)
              .setIn('login.loaded'.split('.'), false);
}