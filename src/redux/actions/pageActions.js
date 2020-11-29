import { actionType } from './actionType';
import Helper from '../../lib/helper';

// 20200825 JustCode - Firebase Auth Implementation
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';

export function pageSearchSetUserWord(userWord) {
  return {
    type: actionType.page.pageSearchSetUserWord,
    payload: userWord
  }
}

export function pageSearchSetError(error) {
  return {
    type: actionType.page.pageSearchSetError,
    payload: error
  }
}

export function pageSearchSetLoading(loading) {
  return {
    type: actionType.page.pageSearchSetLoading,
    payload: loading
  }
}

export function pageSearchShowCamera(show) {
  return {
    type: actionType.page.pageSearchShowCamera,
    payload: show
  }
}

export function pageSearchSetState(state) {
  return {
    type: actionType.page.pageSearchSetState,
    payload: state
  }
}

export function pageFavLoadList(session) { // 20200926 JustCode - Firebase FireStore Implementation
  return function(dispatch) {
    dispatch({type: actionType.page.pageFavLoadListPending, payload: null});

    Helper.getFavList('', session) // 20200926 JustCode - Firebase FireStore Implementation
    .then(result => {
      dispatch({
        type: actionType.page.pageFavLoadListFulfilled,
        payload: result
      });
    })
    .catch(err => {
      dispatch({
        type: actionType.page.pageFavLoadListRejected,
        payload: err
      });
    });
  }
}

export function pageFavDetailSetError(error) {
  return {
    type: actionType.page.pageFavDetailSetError,
    payload: error
  }
}

export function pageFavDetailSetLoading(loading) {
  return {
    type: actionType.page.pageFavDetailSetLoading,
    payload: loading
  }
}

export function pageFavDetailSetState(state) {
  return {
    type: actionType.page.pageFavDetailSetState,
    payload: state
  }
}

// 20200825 JustCode - Firebase Auth Implementation
export function pageLoginSetEmail(email) {
  return {
    type: actionType.page.pageLoginSetEmail,
    payload: email
  }
}

export function pageLoginSetPassword(password) {
  return {
    type: actionType.page.pageLoginSetPassword,
    payload: password
  }
}

export function pageLoginSetError(error) {
  return {
    type: actionType.page.pageLoginSetError,
    payload: error
  }
}

export function pageLoginAuth(email, password, localizedStrings, callback) {
  return function(dispatch) {
    dispatch({type: actionType.page.pageLoginAuthPending, payload: null});

    auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      dispatch({
        type: actionType.page.pageLoginAuthFulfilled,
        payload: null
      });

      // Perform callback if defined and return error object as null
      callback && callback(null);
    })
    .catch(error => {
      dispatch({
        type: actionType.page.pageLoginAuthRejected,
        payload: localizedStrings && localizedStrings.error ? localizedStrings.error.loginFailed : error.message
      });

      callback && callback(error);
    });
  }
}

export function pageLoginSignUp(email, password, localizedStrings, callback) {
  return function(dispatch) {
    dispatch({type: actionType.page.pageLoginSignUpPending, payload: null});

    auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      dispatch({
        type: actionType.page.pageLoginSignUpFulfilled,
        payload: null
      });

      // Perform callback if defined and return error object as null
      callback && callback(null);
    })
    .catch(error => {
      let errorMsg = localizedStrings.error.signupError;
      switch(error.code) {
        case 'auth/email-already-in-use':
          errorMsg = localizedStrings.error.signUpEmailInUse;
          break;

        case 'auth/invalid-email':
          errorMsg = localizedStrings.error.signUpEmailInvalid;
          break;
      }
      dispatch({
        type: actionType.page.pageLoginSignUpRejected,
        payload: localizedStrings && localizedStrings.error ? errorMsg : error.message
      });

      callback && callback(error);
    });
  }
}

export function pageLoginLogout(callback) {
  return function(dispatch) {
    dispatch({type: actionType.page.pageLoginLogoutPending, payload: null});

    auth()
    .signOut()
    .then(() => {
      dispatch({
        type: actionType.page.pageLoginLogoutFulfilled,
        payload: null
      });

      // Perform callback if defined and return error object as null
      callback && callback(null);
    })
    .catch(error => {
      dispatch({
        type: actionType.page.pageLoginLogoutRejected,
        payload: null
      });

      callback && callback(error);
    });
  }
}

export function pageLoginForgetPwd(email, callback) {
  return function(dispatch) {
    dispatch({type: actionType.page.pageLoginForgetPwdPending, payload: null});

    auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      dispatch({
        type: actionType.page.pageLoginForgetPwdFulfilled,
        payload: null
      });

      // Perform callback if defined and return error object as null
      callback && callback(null);
    })
    .catch(error => {
      dispatch({
        type: actionType.page.pageLoginForgetPwdRejected,
        payload: error.message
      });

      callback && callback(error);
    });
  }
}

export function pageLoginGoogleAuth(localizedStrings, callback) {
  return function(dispatch) {
    dispatch({type: actionType.page.pageLoginGoogleAuthPending, payload: null});

    // Get the users ID token
    GoogleSignin
    .signIn()
    .then(token => {
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(token.idToken);

      auth()
      .signInWithCredential(googleCredential)
      .then(() => {
        dispatch({
          type: actionType.page.pageLoginGoogleAuthFulfilled,
          payload: null
        });

        // Perform callback if defined and return error object as null
        callback && callback(null);
      })
      .catch(error => {
        dispatch({
          type: actionType.page.pageLoginGoogleAuthRejected,
          payload: localizedStrings && localizedStrings.error ? localizedStrings.error.loginFailed : error.message
        });

        callback && callback(error);
      });
    })
    .catch(error => {
      dispatch({
        type: actionType.page.pageLoginGoogleAuthRejected,
        payload: localizedStrings && localizedStrings.error ? localizedStrings.error.loginFailed : error.message
      });

      callback && callback(error);
    });
  }
}