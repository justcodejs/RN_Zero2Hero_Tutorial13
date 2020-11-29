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
import LocalizedStrings from 'react-native-localization';
var localeFile = require('./locale.json');
let localizedStrings = new LocalizedStrings(localeFile);

// 20200613 JustCode: Redux implementation
import { connect } from 'react-redux';

// 20200825 JustCode - Firebase Auth Implementation.
import * as pageActions from '../../redux/actions/pageActions';

class Profile extends React.Component {
  state = { updatedOn: 0}

  render() {
    localizedStrings.setLanguage(this.props.ui.get('lang'));

    // 20200825 JustCode - Firebase Auth Implementation.
    let isAuthenticated = this.props.session && this.props.session.get('authenticated');

    return (
      <>
        <SafeAreaView
          style={commonStyles.content}>
          {/* 20200529 JustCode - Change the hard coded string to localized string */}
          <Header navigation={this.props.navigation} Title={localizedStrings.Title} isAtRoot={true} />
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
          >
            
            <View style={[commonStyles.column, commonStyles.header]}>
              <Image style={commonStyles.logo} source={require('../../../assets/icon.png')} />
            </View>
            
            <View style={{minHeight: 10, maxHeight: 10}}></View>

            <View style={styles.fieldGroup}>
              {/* 20200529 JustCode - Change the hard coded string to localized string */}
              <Text style={styles.label}>{localizedStrings.Field.Name.Label}</Text>
              <Text>{localizedStrings.Field.Name.Value}</Text>
            </View>
            <View style={styles.fieldGroup}>
              {/* 20200529 JustCode - Change the hard coded string to localized string */}
              <Text style={styles.label}>{localizedStrings.Field.Gender.Label}</Text>
              <Text>{localizedStrings.Field.Gender.Value}</Text>
            </View>
            <View style={styles.fieldGroup}>
              {/* 20200529 JustCode - Change the hard coded string to localized string */}
              <Text style={styles.label}>{localizedStrings.Field.Age.Label}</Text>
              <Text>{localizedStrings.Field.Age.Value}</Text>
            </View>
            <View style={styles.fieldGroup}>
              {/* 20200529 JustCode - Change the hard coded string to localized string */}
              <Text style={styles.label}>{localizedStrings.Field.Address.Label}</Text>
              <Text>{localizedStrings.Field.Address.Value}</Text>
            </View>

            {/* 20200825 JustCode - Firebase Auth Implementation. */}
            <View style={styles.fieldGroup}>
              <Button
                title={isAuthenticated ? localizedStrings.Button.Logout : localizedStrings.Button.Login}
                onPress={() => {
                  if(isAuthenticated) {
                    // If authenticated, then perform logout
                    this.props.dispatch(
                      pageActions.pageLoginLogout()
                    );
                  }
                  else {
                    this.props.navigation.navigate('Login');
                  }
                }}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  fieldGroup: {
    marginTop: 5,
    marginBottom: 10
  },
  label: {
    fontWeight: 'bold'
  },
  
});

// 20200613 JustCode: Redux implementation
const ReduxProfile = connect((state) => {
  return {
    ui: state.ui,
    // 20200825 JustCode - Firebase Auth Implementation.
    session: state.session
  };
})(Profile);

export default (props) => {
  const navigation = useNavigation();
  return (
    <ReduxProfile {...props} navigation={navigation} />
  )
}