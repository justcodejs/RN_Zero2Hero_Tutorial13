/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  Linking,
  Alert, // 20200626 JustCode: FCM implementation
  Text,
  Platform
} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, 
         DrawerContentScrollView, 
         DrawerItemList, 
         DrawerItem
       } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Search from './src/screens/search';
import Fav from './src/screens/fav';
import Profile from './src/screens/profile';
import commonStyles from './commonStyles';

// 20200501 JustCode: Import the camera and file system module
import Camera, { Constants } from "./src/components/camera";
import RNFS from 'react-native-fs';

// 20200529 JustCode: Import the LocalizedStrings module and the locale text file
import Setting from './src/screens/setting';
import Helper from './src/lib/helper';
import LocalizedStrings from 'react-native-localization';
var localeFile = require('./locale.json');
let localizedStrings = new LocalizedStrings(localeFile);

// 20200613 JustCode: Redux implementation
import { connect } from 'react-redux';
import * as uiActions from './src/redux/actions/uiActions';

// 20200626 JustCode: FCM implementation
import messaging from '@react-native-firebase/messaging';
import * as pageActions from './src/redux/actions/pageActions';
import AsyncStorage from '@react-native-community/async-storage';
import VersionNumber from 'react-native-version-number';

var fcmUnsubscribe = null;
const navigationRef = React.createRef();

// 20200825 JustCode - Firebase Auth Implementation
import Login from './src/screens/login';
import * as sessionActions from './src/redux/actions/sessionActions';
import auth from '@react-native-firebase/auth';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
var fcmAuthUnsubscribe = null;

// 20200825 JustCode - Firebase Auth Implementation - For Google Sign In
import { GoogleSignin } from '@react-native-community/google-signin';

// 20200926 JustCode - Firebase FireStore Implementation
import firestore from '@react-native-firebase/firestore';
import { actionType } from './src/redux/actions/actionType';
var firestoreUnsubscribe = null;

// 20201119 JustCode: For Crashlytics
import crashlytics from '@react-native-firebase/crashlytics';

const Drawer = createDrawerNavigator();
// 20200613 JustCode: Redux implementation, connect TabNav to Redux
const DrawerNav = connect((state) => {
  return {
    ui: state.ui
  };
})((props) => {
  return (
    <Drawer.Navigator 
      initialRouteName="TabNav"
      drawerContent={
        drawerProps => <DrawerContent {...drawerProps} {...props} />
      }
    >
      {/* 20200529 JustCode: Change the hardcoded string to the localized string */}
      <Drawer.Screen name="TabNav" 
        component={TabNav}
        options={{title: localizedStrings.DrawerNav.Screens.Home}} 
      />
      <Drawer.Screen name="Profile" 
        component={Profile}
        options={{title: localizedStrings.DrawerNav.Screens.MyProfile}} 
      />
    </Drawer.Navigator>
  );
})

const DrawerContent = (props) => {
  return (
    <>
      <View style={commonStyles.drawerHeader}>
        <View style={{width: 100, alignSelf: 'center' }}>
          <Image source={props.ui.get('profilePhoto')} style={commonStyles.drawerProfilePhoto} />
          <TouchableOpacity style={commonStyles.profileCamera} 
            onPress={() => {
              props.dispatch(
                uiActions.showCamera(!props.ui.get('showCamera'))
              );
            }}
          >
            <Icon name="ios-camera" size={50} color="#22222288" />
          </TouchableOpacity>
        </View>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList activeBackgroundColor={'transparent'} {...props} />
        <DrawerItem
          label={localizedStrings.DrawerNav.Screens.About}
          onPress={() => Linking.openURL('https://www.justnice.net')}
        />
      </DrawerContentScrollView>
    </>
  );
}

const Tab = createBottomTabNavigator();
// 20200613 JustCode: Redux implementation, connect TabNav to Redux
const TabNav = connect((state) => {
  return {
    ui: state.ui
  };
})((props) => {
  return(
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'logo-react';

          if (route.name === 'Search') {
            iconName = 'ios-search';
          } else if (route.name === 'Fav') {
            iconName = focused ? 'ios-heart' : 'ios-heart-empty';
          } else if (route.name === 'Setting') {
            iconName = 'md-settings';
          }
          
          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        }
      })}
      tabBarOptions={{
        activeTintColor: 'white',
        inactiveTintColor: 'gray',
        activeBackgroundColor: '#219bd9',
        inactiveBackgroundColor: '#d6f9ff',
        safeAreaInsets: {bottom: 0},
        style: {height: 70},
        tabStyle: {paddingBottom: 15}
      }}
    >
      <Tab.Screen name="Search" 
        component={Search}
        options={{title: localizedStrings.TabNav.Tabs.Search}} />
      <Tab.Screen name="Fav" 
        component={Fav}
        options={{title: localizedStrings.TabNav.Tabs.Fav}} />
      <Tab.Screen name="Setting" 
        component={Setting}
        options={{title: localizedStrings.TabNav.Tabs.Setting}} />
    </Tab.Navigator>
  );
})

class App extends React.Component {
 
  // 20200502 JustCode
  // Create componentDidMount to check if there is any profile photo or not.
  componentDidMount() {
    // 20200825 JustCode - Firebase Auth Implementation
    fcmAuthUnsubscribe = auth().onAuthStateChanged(user => {
      this.props.dispatch(
        sessionActions.setAuthenticated(user)
      );
    });

    // 20200825 JustCode - Firebase Auth Implementation. For Google Sign In
    GoogleSignin.configure({
      webClientId: '313905376969-tq6oq6i5f19iusmlbtl1a4uuadugaorl.apps.googleusercontent.com',
    });

    // 20200626 JustCode: FCM implementation
    messaging()
    .requestPermission()
    .then(authStatus => {
      console.log('APN Status:', authStatus);

      if(authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
        messaging()
        .getToken()
        .then(token => {
          console.log('messaging.getToken: ', token)
        });

        messaging().onTokenRefresh(token => {
          console.log('messaging.onTokenRefresh: ', token)
        });

        messaging()
        .subscribeToTopic('dailyword')
        .then(() => console.log('Subscribed to topic - dailyword!'));

        messaging()
        .subscribeToTopic('version_upgrade')
        .then(() => console.log('Subscribed to topic - version_upgrade!'));

        fcmUnsubscribe = messaging().onMessage(async remoteMessage => {
          console.log('A new FCM message arrived!', remoteMessage);
          this.processNotification(remoteMessage, false);
          // Alert.alert(
          //   localizedStrings.DailyWord.Title, 
          //   localizedStrings.DailyWord.Msg.replace('{0}', remoteMessage.data.word),
          //   [
          //     {
          //       text: localizedStrings.DailyWord.View,
          //       onPress: () => {
          //         this.forwardToSearchPage(remoteMessage.data.word);
          //       }
          //     },
          //     {
          //       text: localizedStrings.DailyWord.Close,
          //       onPress: () => console.log('Close Pressed'),
          //       style: 'cancel'
          //     }
          //   ]
          // );
        });
        
        messaging()
        .onNotificationOpenedApp(remoteMessage => {
          console.log(
            'Notification caused app to open from background state:',
            remoteMessage,
          );
          this.processNotification(remoteMessage, true);
          //this.forwardToSearchPage(remoteMessage.data.word);
        });

        messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log(
              'Notification caused app to open from quit state:',
              remoteMessage,
            );
            this.processNotification(remoteMessage, true);
            // this.forwardToSearchPage(remoteMessage.data.word);
          }
        });

        setTimeout(_ => {
          this.checkVersionUpdate();
        }, 2000);

        
        
      }
      else {
        console.log('requestPermission Denied');
      }
    })
    .catch(err => {
      console.log('messaging.requestPermission Error: ', err)
    });

    // 20200926 JustCode - Firebase FireStore Implementation
    firestoreUnsubscribe = firestore()
    .collection('FavWord')
    .onSnapshot(snapShot => {
      console.log('FireStore onSnapshot: ', snapShot);
      
      if(snapShot && snapShot.docs) {
        let favList = snapShot.docs
        .sort((a, b) => b.get('addedOn').toMillis() - a.get('addedOn').toMillis())
        .map(x => {return {
          id: x.id,
          word: x.get('word'),
          sense: x.get('sense'),
          addedOn: x.get('addedOn').toDate(), // Convert from FireStoreTimestamp to Javascript date object
          userId: x.get('userId'),
        }});

        this.props.dispatch({
          type: actionType.page.pageFavLoadListFulfilled,
          payload: favList
        });
      }
    });

    // 20200529 JustCode - Get the user language setting from storage
    Helper.getDeviceLanguageFromStorage()
    .then(lang => {
      this.props.dispatch(
        uiActions.setLanguage(lang)
      );
    })
    .catch(_ => {
      this.props.dispatch(
        uiActions.setLanguage('en')
      );
    });

    // 20201119 JustCode: For Crashlytics
    Helper.getCrashlyticsSetting()
    .then(enable => {
      if(enable !== null) {
        if(enable === true) {
          crashlytics()
          .setCrashlyticsCollectionEnabled(true)
          .then(() => {
            this.props.dispatch(
              uiActions.setCrashlytics(true)
            );
          });
        }
      }
      else {
        setTimeout(() => {
          Alert.alert(
            localizedStrings.Crashlytics.Title, 
            localizedStrings.Crashlytics.Msg,
            [
              {
                text: localizedStrings.Crashlytics.Allow,
                onPress: () => {
                  crashlytics()
                  .setCrashlyticsCollectionEnabled(true)
                  .then(() => {
                    this.props.dispatch(
                      uiActions.setCrashlytics(true)
                    );

                    Helper.updateCrashlyticsSetting(true);
                  });
                }                
              },
              {
                text: localizedStrings.Crashlytics.Deny,
                onPress: () => {
                  this.props.dispatch(
                    uiActions.setCrashlytics(false)
                  );

                  Helper.updateCrashlyticsSetting(false);                  
                },
                style: 'cancel'
              }
            ]
          );
        }, 1000);
      }
    })
    .catch(_ => { });

    // Check if there is any profile photo or not.
    let path = RNFS.DocumentDirectoryPath + '/profilePic.png';
    RNFS.exists(path)
    .then(exist => {
      console.log('File exist: ', exist);
      if(exist) {
        RNFS.readFile(path, 'base64')
        .then(buffer => {
          console.log('File read.');
          this.props.dispatch(
            uiActions.setProfilePhoto(
              {
                uri: 'data:image/png;base64,' + buffer
              }
            )
          );
        })
        .catch(err => {
          console.log('Unable to read profile photo. ', err);
        })
      }
    })
    .catch(err => {
      console.log('Unable to access file system. ', err);
    });
  
  }

  // 20200626 JustCode: FCM implementation
  componentDidUnMount() {
    console.log('fcmUnsubscribe');
    fcmUnsubscribe && fcmUnsubscribe();

    // 20200825 JustCode - Firebase Auth Implementation
    fcmAuthUnsubscribe && fcmAuthUnsubscribe();

    // 20200926 JustCode - Firebase FireStore Implementation
    firestoreUnsubscribe && firestoreUnsubscribe();
  }

  // 20200626 JustCode: FCM implementation
  forwardToSearchPage(word) {
    this.props.dispatch(
      pageActions.pageSearchSetUserWord(word)
    );
    
    navigationRef.current?.navigate({
      name: 'Search',
      params: {
        autoSearch: true,
      }
    });
  }

  // 20200626 JustCode: FCM implementation
  checkVersionUpdate() {
    AsyncStorage.getItem('nextVer')
    .then(verion => {
      if(verion && verion.length > 0) {
        let nextVerData = JSON.parse(verion);
        if(nextVerData.msgType && nextVerData.msgType === 'VersionUpgrade' && 
          Number.parseInt(nextVerData.nextVer) > Number.parseInt(VersionNumber.buildVersion)) {
          Alert.alert(
            localizedStrings.VersionUpgrade.Title, 
            localizedStrings.VersionUpgrade.Msg,
            [
              {
                text: localizedStrings.VersionUpgrade.View,
                onPress: () => {
                  Linking.openURL(Platform.OS === 'ios' ? nextVerData.ios : nextVerData.android);
                  AsyncStorage.removeItem('nextVer');
                }
              },
              {
                text: localizedStrings.VersionUpgrade.Close,
                onPress: () => console.log('Close Pressed'),
                style: 'cancel'
              }
            ]
          );
        }
      }
    });
  }

  // 20200626 JustCode: FCM implementation
  processNotification(remoteMessage, fromBackground) {
    let title = '';
    let body = '';
    let alertBtns = [];

    if(remoteMessage) {
      if(remoteMessage.notification) {
        title = remoteMessage.notification.title;
        body = remoteMessage.notification.body;
      }

      if(remoteMessage.data) {
        // If user tab on the notification when the app is in background or not running
        if(fromBackground && remoteMessage.data.msgType) {
          switch(remoteMessage.data.msgType) {
            case "Search":
              this.forwardToSearchPage(remoteMessage.data.word);
              return; // terminate the method here

            // More cases in when app get bigger
          }
        }

        // Notification arrive while the app is running in foreground
        if(!fromBackground && remoteMessage.data.msgType) {
          switch(remoteMessage.data.msgType) {
            case "Search":
              alertBtns = [
                {
                  text: localizedStrings.DailyWord.View,
                  onPress: () => {
                    this.forwardToSearchPage(remoteMessage.data.word);
                  }
                },
                {
                  text: localizedStrings.DailyWord.Close,
                  onPress: () => console.log('Close Pressed'),
                  style: 'cancel'
                }
              ];
              break; 

            case "VersionUpgrade":
              if(Number.parseInt(remoteMessage.data.nextVer) > Number.parseInt(VersionNumber.buildVersion)) {
                title = localizedStrings.VersionUpgrade.Title;
                body = localizedStrings.VersionUpgrade.Msg;
                alertBtns = [
                  {
                    text: localizedStrings.VersionUpgrade.View,
                    onPress: () => {
                      Linking.openURL(Platform.OS === 'ios' ? remoteMessage.data.ios : remoteMessage.data.android);
                    }
                  },
                  {
                    text: localizedStrings.VersionUpgrade.Close,
                    onPress: () => console.log('Close Pressed'),
                    style: 'cancel'
                  }
                ];
              }
              break;

            // More cases in when app get bigger

          }
        }
      }
      
      if(!fromBackground) {
        if(title.length > 0 && body.length > 0) {
          Alert.alert(
            title, 
            body,
            alertBtns.length > 0 ? alertBtns : undefined
          );
        }
      }
    }
  }

  saveProfilePhoto(data) {
    this.props.dispatch(
      uiActions.showCamera(false)
    );
    
    let path = RNFS.DocumentDirectoryPath + '/profilePic.png';

    // strip off the data: url prefix to get just the base64-encoded bytes
    var imgData = data.replace(/^data:image\/\w+;base64,/, "");
    
    // write the file
    RNFS.writeFile(path, imgData, 'base64')
    .then(_ => {
      // Update the profilePhoto state so that the profile photo will update
      // to the latest photo
      this.props.dispatch(
        uiActions.setProfilePhoto(
          {
            uri: 'data:image/png;base64,' + imgData
          }
        )
      );
    })
    .catch((err) => {
      console.log(err.message);
    });
  }

  render() {
    localizedStrings.setLanguage(this.props.ui.get('lang'));
    
    return (
      // 20200626 JustCode: FCM implementation
      <NavigationContainer ref={navigationRef}> 
        <StatusBar barStyle="default" backgroundColor="#219bd9" />
        
        {/* 20200825 JustCode - Firebase Auth Implementation */}
        <Stack.Navigator
          initialRouteName="DrawerNav"
          headerMode="none"
        >
          <Stack.Screen name="DrawerNav">
            {stackProps => <DrawerNav {...this.props} />}
          </Stack.Screen>
          <Stack.Screen name="Login" component={Login} /> 
        </Stack.Navigator>

        {/* <DrawerNav {...this.props} /> */}
        {
          this.props.ui.get('showCamera') &&
          <Camera
            cameraType={Constants.Type.front}
            flashMode={Constants.FlashMode.off}
            autoFocus={Constants.AutoFocus.on}
            whiteBalance={Constants.WhiteBalance.auto}
            ratio={'1:1'}
            quality={0.5}
            imageWidth={800}
            onCapture={data => this.saveProfilePhoto(data)} 
            onClose={_ => {
              this.props.dispatch(
                uiActions.showCamera(!this.props.ui.get('showCamera'))
              );
            }}
          />
        }
      </NavigationContainer>
      
    );
  }
}

// Connect App to Redux state
export default connect((state) => {
  return {
    ui: state.ui
  };
})(App);

