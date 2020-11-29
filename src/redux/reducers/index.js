import { combineReducers } from 'redux';
import ui from './uiReducer';
import page from './pageReducer';

// 20200825 JustCode - Firebase Auth Implementation
import session from './sessionReducer';

// if have a new reducer, add in to the list
export default combineReducers({
  ui,
  page,
  // 20200825 JustCode - Firebase Auth Implementation
  session
})