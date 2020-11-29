import { ActionType } from 'redux-promise-middleware';

export const actionType = {
  ui: {
    setLanguage:                  'UI_SETLANGUAGE',
    showCamera:                   'UI_SHOWCAMERA',
    setProfilePhoto:              'UI_SETPROFILEPHOTO',
    setCrashlytics:               'UI_SETCRASHLYTICS', // 20201119 JustCode: For Crashlytics
  },
  page: {
    pageSearchSetUserWord:        'PAGESEARCH_SETUSERWORD',
    pageSearchSetError:           'PAGESEARCH_SETERROR',
    pageSearchSetLoading:         'PAGESEARCH_SETLOADING',
    pageSearchShowCamera:         'PAGESEARCH_SHOWCAMERA',
    pageSearchSetState:           'PAGESEARCH_SETSTATE',

    pageFavLoadListPending:       `PAGEFAV_LOADLIST${ActionType.Pending}`,
    pageFavLoadListFulfilled:     `PAGEFAV_LOADLIST${ActionType.Fulfilled}`,
    pageFavLoadListRejected:      `PAGEFAV_LOADLIST${ActionType.Rejected}`,

    pageFavDetailSetError:        'PAGEFAVDETAIL_SETERROR',
    pageFavDetailSetLoading:      'PAGEFAVDETAIL_SETLOADING',
    pageFavDetailSetState:        'PAGEFAVDETAIL_SETSTATE',

    // 20200825 JustCode - Firebase Auth Implementation
    pageLoginSetEmail:            'PAGELOGIN_SETEMAIL',
    pageLoginSetPassword:         'PAGELOGIN_SETPASSWORD',
    pageLoginSetError:            'PAGELOGIN_SETERROR',

    pageLoginAuthPending:         `PAGELOGIN_AUTH${ActionType.Pending}`,
    pageLoginAuthFulfilled:       `PAGELOGIN_AUTH${ActionType.Fulfilled}`,
    pageLoginAuthRejected:        `PAGELOGIN_AUTH${ActionType.Rejected}`,

    pageLoginSignUpPending:       `PAGELOGIN_SIGNUP${ActionType.Pending}`,
    pageLoginSignUpFulfilled:     `PAGELOGIN_SIGNUP${ActionType.Fulfilled}`,
    pageLoginSignUpRejected:      `PAGELOGIN_SIGNUP${ActionType.Rejected}`,

    pageLoginLogoutPending:       `PAGELOGIN_LOGOUT${ActionType.Pending}`,
    pageLoginLogoutFulfilled:     `PAGELOGIN_LOGOUT${ActionType.Fulfilled}`,
    pageLoginLogoutRejected:      `PAGELOGIN_LOGOUT${ActionType.Rejected}`,

    pageLoginForgetPwdPending:    `PAGELOGIN_FORGETPWD${ActionType.Pending}`,
    pageLoginForgetPwdFulfilled:  `PAGELOGIN_FORGETPWD${ActionType.Fulfilled}`,
    pageLoginForgetPwdRejected:   `PAGELOGIN_FORGETPWD${ActionType.Rejected}`,

    pageLoginGoogleAuthPending:   `PAGELOGIN_GOOGLEAUTH${ActionType.Pending}`,
    pageLoginGoogleAuthFulfilled: `PAGELOGIN_GOOGLEAUTH${ActionType.Fulfilled}`,
    pageLoginGoogleAuthRejected:  `PAGELOGIN_GOOGLEAUTH${ActionType.Rejected}`,
  },
  // 20200825 JustCode - Firebase Auth Implementation
  session: {
    sessionSetAuthenticated:      'SESSION_SETAUTHENTICATED'
  }
}