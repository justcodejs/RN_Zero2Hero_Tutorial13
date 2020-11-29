/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  Animated,            // 20200810 JustCode: For app animation
  Easing,
  Platform,
  Dimensions
} from 'react-native';
import { useNavigation, 
         useRoute  // 20200626 JustCode: FCM implementation
} from '@react-navigation/native';

import Api from '../../lib/api';
import Helper from '../../lib/helper';
import WordDefinition from '../../components/wordDef';
import Header from '../../components/header';
import commonStyles from '../../../commonStyles';
import Icon from 'react-native-vector-icons/Ionicons';

// 20200502 JustCode: Import the camera module
import Camera, { Constants } from "../../components/camera";
import WordSelector from "../../components/wordSelector";

// 20200529 JustCode: Import the LocalizedStrings module and the locale text file
import LocalizedStrings from 'react-native-localization';
var localeFile = require('./locale.json');
let localizedStrings = new LocalizedStrings(localeFile);

// 20200613 JustCode: Redux implementation
import { connect } from 'react-redux';
import * as pageActions from '../../redux/actions/pageActions';

// 20200810 JustCode: For app animation
import logoSource from '../../../assets/icon.png'

// 20201119 JustCode: For Crashlytics
import crashlytics from '@react-native-firebase/crashlytics';

const X_WIDTH = 375;
const X_HEIGHT = 812;
const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;
const { height, width } = Dimensions.get('window');
const isIPhoneX = () => Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
    ? width === X_WIDTH && height === X_HEIGHT || width === XSMAX_WIDTH && height === XSMAX_HEIGHT
    : false;

const maxScroll = 100;

class Search extends React.Component {
  // 20200810 JustCode: For app animation
  constructor(props) {
    // 20201119 JustCode: For Crashlytics
    crashlytics().log('Search component creating...');
    super(props);
    this.state = {
        loadingScale: new Animated.Value(1),
        loadingOpacity: new Animated.Value(1),
        scrollY: new Animated.Value(0)
    };
  }

  // 20201119 JustCode: For Crashlytics
  componentDidMount() {
    crashlytics().log('Search component mounted.');
  }

  onUserWordChange(text) {
    // 20200613 JustCode: Redux implementation
    this.props.dispatch(
      pageActions.pageSearchSetUserWord(text)
    );
  }

  async onSearch() {
    // 20201119 JustCode: For Crashlytics
    crashlytics().log('onSearch...');
    // 20200613 JustCode: Redux implementation
    if(this.props.page.get('search').get('userWord').length <= 0) {
      this.props.dispatch(
        pageActions.pageSearchSetError(localizedStrings.Error.EmptyWord)
      );
      return;
    }

    // 20201119 JustCode: For Crashlytics
    const isAuthenticated = this.props.session.get('authenticated');
    const user = this.props.session.get('user');
    await Promise.all([
      crashlytics().setUserId(isAuthenticated && user ? user.uid : 'anonymous'),
      crashlytics().setAttributes({
        word: this.props.page.get('search').get('userWord'),
        email: isAuthenticated && user ? user.email : ''
      }),
    ]);

    // 20200810 JustCode: For app animation
    var loadingAnimation = this.animateLoading();
    loadingAnimation.start();

    try {
      // 20200613 JustCode: Redux implementation
      this.props.dispatch(
        pageActions.pageSearchSetLoading(true)
      );

      // 20201119 JustCode: For Crashlytics
      crashlytics().log('Get lemmas...');

      // 20200613 JustCode: Redux implementation
      let lemmas = await Api.getLemmas(this.props.page.get('search').get('userWord'));
      
      // 20201119 JustCode: For Crashlytics
      crashlytics().log(`Lemmas returned: ${JSON.stringify(lemmas)}`);

      console.log('Lemmas: ', lemmas);
      if(lemmas.success) {
        // 20201119 JustCode: For Crashlytics
        crashlytics().log('Get headWord...');
        let headWord = Helper.carefullyGetValue(lemmas, ['payload', 'results', '0', 'lexicalEntries', '0', 'inflectionOf', '0', 'id'], '');
        // 20201119 JustCode: For Crashlytics
        crashlytics().log(`Headword returned: ${JSON.stringify(headWord)}`);

        console.log('Headword is: ', headWord);
        if(headWord.length > 0) {
          // 20201119 JustCode: For Crashlytics
          crashlytics().log('Get word definition...');
          
          let wordDefinition = await Api.getDefinition(headWord);
          
          // 20201119 JustCode: For Crashlytics
          crashlytics().log(`Definition returned: ${JSON.stringify(wordDefinition)}`);
          
          if(wordDefinition.success) {
            this.props.dispatch(
              pageActions.pageSearchSetState(
                {
                  errorMsg: '', 
                  loading: false, 
                  definition: wordDefinition.payload
                }
              )
            );

            // 20201119 JustCode: For Crashlytics
            crashlytics().crash(); // Crash the app for testing purpose.

          }
          else {
            this.props.dispatch(
              pageActions.pageSearchSetState(
                {
                  errorMsg: localizedStrings.Error.OxfordIssue + wordDefinition.message, 
                  loading: false, 
                  definition: null
                }
              )
            );

            // 20201119 JustCode: For Crashlytics
            crashlytics().log(`Get definiton error: ${wordDefinition.message}`);
          }

          // 20200810 JustCode: For app animation
          this.stopLoadingAnimation(loadingAnimation);

        }
        else {
          this.props.dispatch(
            pageActions.pageSearchSetState(
              {
                errorMsg: localizedStrings.Error.InvalidWord, 
                loading: false, 
                definition: null
              }
            )
          );

          // 20200810 JustCode: For app animation
          this.stopLoadingAnimation(loadingAnimation);

          // 20201119 JustCode: For Crashlytics
          crashlytics().log(`Get headWord error: ${localizedStrings.Error.InvalidWord}`);
        }
      }
      else {
        this.props.dispatch(
          pageActions.pageSearchSetState(
            {
              errorMsg: localizedStrings.Error.OxfordIssue + lemmas.message, 
              loading: false, 
              definition: null
            }
          )
        );

        // 20200810 JustCode: For app animation
        this.stopLoadingAnimation(loadingAnimation);

        // 20201119 JustCode: For Crashlytics
        crashlytics().log(`Get lemmas error: ${lemmas.message}`);
      }
    } catch (error) {
      console.log('Error: ', error);
      this.props.dispatch(
        pageActions.pageSearchSetState(
          {
            loading: false, 
            errorMsg: error.message, 
            definition: null
          }
        )
      );
      // 20200810 JustCode: For app animation
      this.stopLoadingAnimation(loadingAnimation);

      // 20201119 JustCode: For Crashlytics
      crashlytics().recordError(error);
    }
  }

  // 20200502 JustCode:
  // Receive the recogonizedText from the Camera module
  onOCRCapture(recogonizedText) {
    this.props.dispatch(
      pageActions.pageSearchShowCamera(false)
    );

    this.props.dispatch(
      pageActions.pageSearchSetState(
        {
          showWordList: Helper.isNotNullAndUndefined(recogonizedText), 
          recogonizedText: recogonizedText
        }
      )
    );
  }

  // 20200502 JustCode:
  // Receive the word selected by the user via WordSelector component
  onWordSelected(word) {
    this.props.dispatch(
      pageActions.pageSearchSetState(
        {
          showWordList: false, 
          userWord: word
        }
      )
    );

    if(word.length > 0) {
      setTimeout(() => {
        this.onSearch();
      }, 500);
    }
  }

  // 20200626 JustCode: FCM implementation
  componentDidUpdate(prevProps) {
    if(Helper.carefullyGetValue(this.props, 'route.params.autoSearch'.split('.'), false)) {
      this.props.route.params.autoSearch = false; // Set to false to prevent recursive searching
      setTimeout(() => {
        this.onSearch();
      }, 500);
    }
  }

  // 20200810 JustCode: For app animation
  animateLoading = () => {
    return (
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
          Animated.timing(this.state.loadingScale, {
            toValue: 3,
            duration: 400,
            useNativeDriver: false,
            easing: Easing.out(Easing.cubic)
          }),
          Animated.timing(this.state.loadingOpacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false,
            easing: Easing.out(Easing.cubic)
          })
        ]),
        Animated.parallel([
          Animated.timing(this.state.loadingScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: false,
          }),
          Animated.timing(this.state.loadingOpacity, {
            toValue: 1,
            duration: 0,
            useNativeDriver: false,
          })
        ]),
      ])
      )
    );
  }

  stopLoadingAnimation = (loadingAnimation) => {
    loadingAnimation.stop();
    // Reset back the loading scale and opacity, so that when the animation
    // stopped, the logo won't be "stuck" half way in the animation
    this.setState({
      loadingScale: new Animated.Value(1),
      loadingOpacity: new Animated.Value(1)
    });
  }

  getLogoImageScale = () => {
    const {scrollY} = this.state;

    return scrollY.interpolate({
        inputRange: [0, maxScroll],
        outputRange: [1, 0],
        extrapolate: 'clamp',
        useNativeDriver: true
    });
  };

  getLogoImageAngle = () => {
      const {scrollY} = this.state;

      return scrollY.interpolate({
          inputRange: [0, maxScroll],
          outputRange: ['0deg', '360deg'],
          extrapolate: 'clamp',
          useNativeDriver: true
      });
  };

  getLogoOpacity = () => {
    const {scrollY} = this.state;

    return scrollY.interpolate({
        inputRange: [0, maxScroll*0.8, maxScroll],
        outputRange: [1, 1, 0],
        extrapolate: 'clamp',
        useNativeDriver: true
    });
  };

  render() {
    localizedStrings.setLanguage(this.props.ui.get('lang'));
    
    // 20200810 JustCode: For app animation
    const logoScale = this.getLogoImageScale();
    const logoAngle = this.getLogoImageAngle();
    const logoOpacity = this.getLogoOpacity();
    
    return (
      <>
        <SafeAreaView
          style={commonStyles.content}>
          {/* 20200529 JustCode - Change the hard coded string to localized string */}
          <Header navigation={this.props.navigation} Title={localizedStrings.Title} isAtRoot={true} />
          
          {/* 20200810 JustCode: For app animation */}
          <Animated.Image 
            style={[{
              position: 'absolute',
              zIndex: 100,
              width: 30, 
              height: 30,
              left: 50,
              top: Platform.OS === 'ios' ? (isIPhoneX() ? 45 : 15) : 5,
              opacity: Animated.subtract(1, logoOpacity)
            }]} 
            source={logoSource} 
          />
          <View style={[commonStyles.header, {
            position: 'absolute',
            zIndex: 100,
            alignSelf: 'center',
            top: Platform.OS === 'ios' ? (isIPhoneX() ? 70 : 50) : 30
          }]}>
            <Animated.Image 
              style={[
                commonStyles.logo, 
                {
                  opacity: Animated.multiply(this.state.loadingOpacity, logoOpacity),
                  transform: [
                    {scale: Animated.multiply(this.state.loadingScale, logoScale)}, 
                    {rotate: logoAngle}
                  ]
                }
              ]} 
              source={logoSource} 
            />
            <Animated.Text style={[
              commonStyles.sectionTitle, 
              {
                opacity: logoOpacity,
                transform: [
                  {scale: logoScale}
                ]
              }]
            }>{localizedStrings.SubTitle}</Animated.Text>
          </View>
          
          <Animated.ScrollView
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {contentOffset: {y: this.state.scrollY}}
                }
              ],
              {
                useNativeDriver: false,
              }
            )}
          >
            <View style={{height: 150}}>
              {/* Empty Padding Space to offset the logo */}
            </View>

            {/* 
              20200430 - JustCode:
                Add camera button to allow user to use camera to capture word. Both the 
                TextInput & TouchableOpacity will be wrapped with a new View.
            */}
            <View style={styles.searchBox}>
              <TextInput style={styles.searchInput}
                onChangeText={text => this.onUserWordChange(text)}
                // 20200529 JustCode - Change the hard coded string to localized string
                placeholder={localizedStrings.PlaceHolder}
                value={this.props.page.get('search').get('userWord')}
              />
              <TouchableOpacity style={styles.searchCamera} onPress={() => {
                // 20200613 JustCode: Redux implementation
                this.props.dispatch(
                  pageActions.pageSearchShowCamera(true)
                );
              }}>
                <Icon name="ios-camera" size={25} color="#22222288"  />
              </TouchableOpacity>
            </View>

            <View style={{minHeight: 10, maxHeight: 10}}></View>

            <Button
              // 20200529 JustCode - Change the hard coded string to localized string
              title={localizedStrings.BtnSearch}
              onPress={() => this.onSearch()}
              // 20200810 JustCode: For app animation
              disabled={this.props.page.get('search').get('loading')}
            />

            {
              // 20200613 JustCode: Redux implementation
              this.props.page.get('search').get('errorMsg').length > 0 &&
              <Text style={commonStyles.errMsg}>{this.props.page.get('search').get('errorMsg')}</Text>
            }

            {/* 
              Display word definition as custom component 
              20200613 JustCode: Redux implementation
              20200825 JustCode: Firebase Auth Implementation, add in session props.
            */}
            <WordDefinition def={this.props.page.get('search').get('definition')} session={this.props.session} />
          </Animated.ScrollView>
        </SafeAreaView>
        {
          // 20200613 JustCode: Redux implementation
          this.props.page.get('search').get('showCamera') &&
          <Camera
            cameraType={Constants.Type.back}
            flashMode={Constants.FlashMode.off}
            autoFocus={Constants.AutoFocus.on}
            whiteBalance={Constants.WhiteBalance.auto}
            ratio={'4:3'}
            quality={0.5}
            imageWidth={800}
            enabledOCR={true}
            onCapture={(data, recogonizedText) => this.onOCRCapture(recogonizedText)} 
            onClose={_ => {
              // 20200613 JustCode: Redux implementation
              this.props.dispatch(
                pageActions.pageSearchShowCamera(false)
              );
            }}
          />
        }
        {
          // 20200613 JustCode: Redux implementation
          this.props.page.get('search').get('showWordList') &&
          <WordSelector wordBlock={this.props.page.get('search').get('recogonizedText')} onWordSelected={(word) => this.onWordSelected(word)} />
        }

        {/* 20200810 JustCode: For app animation */}
        {/* {
          // 20200613 JustCode: Redux implementation
          this.props.page.get('search').get('loading') &&
          <ActivityIndicator style={commonStyles.loading} size="large" color={'#219bd9'} />
        } */}
      </>
    );
  }
}

// 20200613 JustCode: Redux implementation
const ReduxSearch = connect((state) => {
  return {
    ui: state.ui,
    page: state.page,
    // 20200825 JustCode - Firebase Auth Implementation.
    session: state.session
  };
})(Search);

export default (props) => {
  const navigation = useNavigation();
  const route = useRoute(); // 20200626 JustCode: FCM implementation

  return (
    // 20200626 JustCode: FCM implementation
    <ReduxSearch {...props} navigation={navigation} route={route} />
  )
}

const styles = StyleSheet.create({
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1, 
    paddingLeft: 4, 
    paddingRight: 4, 
    paddingTop: 2, 
    paddingBottom: 2
  },
  searchInput: {
    padding: 0,
    flex: 1
  },
  // 20200502 - JustCode:
  // Camera icon style
  searchCamera: {
    maxWidth: 50,
    marginLeft: 5,
    padding: 0,
    alignSelf: 'center'
  }
});