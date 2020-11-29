/**
 * @format
 */

import {AppRegistry, Text} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// 20200613 JustCode: Redux implementation
import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store/store';

// 20200626 JustCode: FCM implementation
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';

// 20200626 JustCode: FCM implementation
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  
  if(remoteMessage && remoteMessage.data && remoteMessage.data.msgType) {
    switch(remoteMessage.data.msgType) {
      case 'VersionUpgrade':
        AsyncStorage.setItem('nextVer', JSON.stringify(remoteMessage.data));
    }
  }
  console.log('Message handled in the background!', remoteMessage);
});

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

// 20200613 JustCode: Redux implementation
// 20200626 JustCode: FCM implementation
const ReduxApp = ({ isHeadless }) => {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    console.log('App launched by iOS in background. Ignore it!');
    return null;
  }
  
  return <Provider store={store}><App /></Provider>
}

// 20200613 JustCode: Redux implementation. Change App to ReduxApp
AppRegistry.registerComponent(appName, () => ReduxApp);
