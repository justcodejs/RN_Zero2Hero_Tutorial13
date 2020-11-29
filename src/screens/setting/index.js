/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Button
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/header';
import commonStyles from '../../../commonStyles';

// 20200529 JustCode: Import the LocalizedStrings module and the locale text file
import Helper from '../../lib/helper';
import LocalizedStrings from 'react-native-localization';
import { TouchableOpacity } from 'react-native-gesture-handler';
var localeFile = require('./locale.json');
let localizedStrings = new LocalizedStrings(localeFile);

// 20200613 JustCode: Redux implementation
import { connect } from 'react-redux';
import * as uiActions from '../../redux/actions/uiActions';

// 20200810 JustCode: For app animation
import * as Animatable from 'react-native-animatable';

class Setting extends React.Component {
  // 20200810 JustCode: For app animation
  btnEn = null;
  btnZh = null;
  btnKr = null;

  updateLanguage(lang) {
    // 20200613 JustCode: Redux implementation
    this.props.dispatch(
      uiActions.setLanguage(lang)
    );

    // 20200810 JustCode: For app animation
    let selectedBtn = null;
    switch(lang.toUpperCase()) {
      case "EN":
        selectedBtn = this.btnEn;
        break;

      case "ZH":
        selectedBtn = this.btnZh;
        break;

      case "KR":
        selectedBtn = this.btnKr;
        break;
    }
    
    if(selectedBtn)
      selectedBtn.bounceIn(800);
  
  }

  render() {
    // 20200613 JustCode: Redux implementation
    localizedStrings.setLanguage(this.props.ui.get('lang'));
    
    return (
      <>
        <SafeAreaView
          style={commonStyles.content}>
          <Header navigation={this.props.navigation} Title={localizedStrings.title} isAtRoot={true} />
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
          >
            <View style={styles.prompt}>
              <Text>{localizedStrings.desc}</Text>
            </View>
            <View style={styles.language}>
              {/* 20200810 JustCode: For app animation */}
              <Animatable.View ref={ref => this.btnEn = ref}>
                <TouchableOpacity 
                  style={localizedStrings.getLanguage() === 'en' ? styles.langButtonSelected : styles.langButton}
                  onPress={_ => this.updateLanguage('en')}
                >
                  <Text style={styles.buttonFlag}>🇬🇧</Text>
                  <Text style={styles.buttonText}>{localizedStrings.language.english}</Text>
                </TouchableOpacity>
              </Animatable.View>

              {/* 20200810 JustCode: For app animation */}
              <Animatable.View ref={ref => this.btnZh = ref}>
                <TouchableOpacity 
                  style={localizedStrings.getLanguage() === 'zh' ? styles.langButtonSelected : styles.langButton}
                  onPress={_ => this.updateLanguage('zh')}
                >
                  <Text style={styles.buttonFlag}>🇨🇳</Text>
                  <Text style={styles.buttonText}>{localizedStrings.language.chinese}</Text>
                </TouchableOpacity>
              </Animatable.View>

              {/* 20200810 JustCode: For app animation */}
              <Animatable.View ref={ref => this.btnKr = ref}>
                <TouchableOpacity 
                  style={localizedStrings.getLanguage() === 'kr' ? styles.langButtonSelected : styles.langButton}
                  onPress={_ => this.updateLanguage('kr')}
                >
                  <Text style={styles.buttonFlag}>🇰🇷</Text>
                  <Text style={styles.buttonText}>{localizedStrings.language.korean}</Text>
                </TouchableOpacity>
              </Animatable.View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  prompt: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30
  },
  language: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 30
  },
  langButton: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
    height: 50,
    width: 150,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#219bd9'
  },
  langButtonSelected: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
    height: 50,
    width: 150,
    margin: 5,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#219bd9'
  },
  buttonFlag: {
    flex: 1, 
    fontSize: 30, 
    justifyContent: 'center'
  },
  buttonText: {
    flex: 2, 
    fontSize: 20, 
    justifyContent: 'center', 
    color: '#219bd9', 
    textAlign: 'center'
  }
  
});

// 20200613 JustCode: Redux implementation
const ReduxSetting = connect((state) => {
  return {
    ui: state.ui
  };
})(Setting);

export default (props) => {
  const navigation = useNavigation();
  return (
    // 20200613 JustCode: Redux implementation
    // Change Setting to ReduxSetting
    <ReduxSetting {...props} navigation={navigation} />
  )
}