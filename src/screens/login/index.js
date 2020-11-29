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
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Button,
  Platform,
  Toast
} from 'react-native';

import Helper from '../../lib/helper';
import commonStyles from '../../../commonStyles';
import { useNavigation } from '@react-navigation/native';

import LocalizedStrings from 'react-native-localization';
var localeFile = require('./locale.json');
let localizedStrings = new LocalizedStrings(localeFile);

import { connect } from 'react-redux';
import * as pageActions from '../../redux/actions/pageActions';
import { GoogleSigninButton } from '@react-native-community/google-signin';

class Login extends React.Component {
  
  onEmailChange(text) {
    this.props.dispatch(
      pageActions.pageLoginSetEmail(text)
    );
  }

  onPasswordChange(text) {
    this.props.dispatch(
      pageActions.pageLoginSetPassword(text)
    );
  }

  verifyLoginForm() {
    let email = this.props.page.get('login').get('email');
    let password = this.props.page.get('login').get('password');

    if(!email || email.length <= 0)
      return {valid: false, reason: localizedStrings.error.noEmail};

    if(!Helper.validateEmail(email))
      return {valid: false, reason: localizedStrings.error.notValidEmail};

    if(!password || password.length <= 0)
      return {valid: false, reason: localizedStrings.error.noPassword};

    if(!Helper.validatePassword(password))
      return {valid: false, reason: localizedStrings.error.notValidPassword};

    return {valid: true, reason: ''};
  }

  onLogin() {
    const formStatus = this.verifyLoginForm();
    let email = this.props.page.get('login').get('email');
    let password = this.props.page.get('login').get('password');

    if(formStatus.valid) {
      this.props.dispatch(
        pageActions.pageLoginAuth(email, password, localizedStrings, (error) => {
          if(!error)
            this.props.navigation.canGoBack() && this.props.navigation.goBack();
        })
      );
    }
    else {
      this.props.dispatch(
        pageActions.pageLoginSetError(formStatus.reason)
      );
    }
  }

  onSignUp() {
    const formStatus = this.verifyLoginForm();
    let email = this.props.page.get('login').get('email');
    let password = this.props.page.get('login').get('password');

    if(formStatus.valid) {
      this.props.dispatch(
        pageActions.pageLoginSignUp(email, password, localizedStrings, (error) => {
          if(!error)
            this.props.navigation.canGoBack() && this.props.navigation.goBack();
        })
      );
    }
    else {
      this.props.dispatch(
        pageActions.pageLoginSetError(formStatus.reason)
      );
    }
  }

  verifyForgetPwdForm() {
    let email = this.props.page.get('login').get('email');
    
    if(!email || email.length <= 0)
      return {valid: false, reason: localizedStrings.error.noEmail};

    if(!Helper.validateEmail(email))
      return {valid: false, reason: localizedStrings.error.notValidEmail};

    return {valid: true, reason: ''};
  }

  forgetPassword() {
    const formStatus = this.verifyForgetPwdForm();
    let email = this.props.page.get('login').get('email');

    if(formStatus.valid) {
      this.props.dispatch(
        pageActions.pageLoginForgetPwd(email, (error) => {
          if(!error){
            this.props.dispatch(
              pageActions.pageLoginSetError(localizedStrings.forgetPwdSent + email)
            );
          }
        })
      );
    }
    else {
      this.props.dispatch(
        pageActions.pageLoginSetError(formStatus.reason)
      );
    }
  }

  onGoogleLogin() {
    this.props.dispatch(
      pageActions.pageLoginGoogleAuth(localizedStrings, (error) => {
        if(!error)
          this.props.navigation.canGoBack() && this.props.navigation.goBack();
      })
    );
  }

  render() {
    localizedStrings.setLanguage(this.props.ui.get('lang'));
    return (
      <>
        <SafeAreaView
          style={commonStyles.content}>
          <Header navigation={this.props.navigation} Title={localizedStrings.title} />
          <View style={[
            commonStyles.header
          ]}>
            <Image style={commonStyles.logo} source={require('../../../assets/icon.png')} />
          </View>
          
          <TextInput style={commonStyles.textBox}
            onChangeText={text => this.onEmailChange(text)}
            placeholder={localizedStrings.placeholder.email}
            keyboardType={'email-address'}
            autoCompleteType={'email'}
            value={this.props.page.get('login').get('email')}
          />

          <TextInput style={commonStyles.textBox}
            onChangeText={text => this.onPasswordChange(text)}
            placeholder={localizedStrings.placeholder.password}
            keyboardType={Platform.OS === 'android' ? 'visible-password' : undefined}
            secureTextEntry={true}
            value={this.props.page.get('login').get('password')}
          />
          
          {
            this.props.page.get('login').get('errorMsg').length > 0 &&
            <Text style={[commonStyles.errMsg, {margin: 10}]}>
              {this.props.page.get('login').get('errorMsg')}
            </Text>
          }
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly'
          }}>
            <Button
              title={localizedStrings.btnLogin}
              onPress={() => this.onLogin()}
              disabled={this.props.page.get('login').get('loading')}
            />

            <Button
              title={localizedStrings.btnSignUp}
              onPress={() => this.onSignUp()}
              disabled={this.props.page.get('login').get('loading')}
            />
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            margin: 10,
            marginTop: 30,
          }}>
            <TouchableOpacity
              onPress={() => this.forgetPassword()}
              disabled={this.props.page.get('login').get('loading')}
            >
              <Text style={{
                color: Platform.OS === 'ios' ? '#007AFF' : '#2196F3',

              }}>{localizedStrings.btnForgetPwd}</Text>
            </TouchableOpacity>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            margin: 10,
            marginTop: 30,
          }}>
            <GoogleSigninButton
              style={{ width: Platform.OS === 'ios' ? 190 : 220, height: 48 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={this.onGoogleLogin.bind(this)}
              disabled={this.props.page.get('login').get('loading')} />
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default connect((state) => {
  return {
    ui: state.ui,
    page: state.page,
    session: state.session
  };
})(props => {
  const navigation = useNavigation();
  
  return <Login {...props} navigation={navigation} />
});


