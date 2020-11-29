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
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  Button,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Api from '../../lib/api';
import Helper from '../../lib/helper';
import WordDefinition from '../../components/wordDef';
import commonStyles from '../../../commonStyles';
import Header from '../../components/header';

// 20200529 JustCode: Import the LocalizedStrings module and the locale text file
import LocalizedStrings from 'react-native-localization';
var localeFile = require('./locale.json');
let localizedStrings = new LocalizedStrings(localeFile);

// 20200613 JustCode: Redux implementation
import { connect } from 'react-redux';
import * as pageActions from '../../redux/actions/pageActions';

class FavDetail extends React.Component {
  componentDidMount() {
    if(Helper.isNotNullAndUndefined(this.props, ['route', 'params', 'word'])) {
      this.getDefinition(this.props.route.params.word);
    }
  }

  async getDefinition(word) {
    
    try {
      // 20200613 JustCode: Redux implementation
      this.props.dispatch(
        pageActions.pageFavDetailSetLoading(true)
      );
      
      if(word.length > 0) {
        let wordDefinition = await Api.getDefinition(word);
        if(wordDefinition.success) {
          // 20200613 JustCode: Redux implementation
          this.props.dispatch(
            pageActions.pageFavDetailSetState({
              errorMsg: '', 
              loading: false, 
              definition: wordDefinition.payload
            })
          );
        }
        else {
          // 20200613 JustCode: Redux implementation
          this.props.dispatch(
            pageActions.pageFavDetailSetState({
              errorMsg: localizedStrings.Error.OxfordIssue + wordDefinition.message, 
              loading: false, 
              definition: null
            })
          );
        }
      }
      else {
        // 20200613 JustCode: Redux implementation
        this.props.dispatch(
          pageActions.pageFavDetailSetState({
            errorMsg: localizedStrings.Error.InvalidWord, 
            loading: false, 
            definition: null
          })
        );
      }
    
    } catch (error) {
      // 20200613 JustCode: Redux implementation
      this.props.dispatch(
        pageActions.pageFavDetailSetState({
          errorMsg: error.message, 
          loading: false, 
          definition: null
        })
      );
    }
  }

  render() {
    localizedStrings.setLanguage(this.props.ui.get('lang'));

    return (
      <>
        <SafeAreaView
          style={commonStyles.content}>
          {/* 20200529 JustCode - Change the hard coded string to localized string */}
          <Header navigation={this.props.navigation} Title={localizedStrings.Title} />
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
          >
            <View style={[commonStyles.column, commonStyles.header]}>
              <Image style={commonStyles.logo} source={require('../../../assets/icon.png')} />
            </View>
            
            <View style={{minHeight: 10, maxHeight: 10}}></View>

            {
              // 20200613 JustCode: Redux implementation
              this.props.page.get('favDetail').get('errorMsg').length > 0 &&
              <Text style={commonStyles.errMsg}>{this.state.errorMsg}</Text>
            }

            {/* Display word definition as custom component 
                20200613 JustCode: Redux implementation
            */}
            <WordDefinition def={this.props.page.get('favDetail').get('definition')} hideFav={true} />
          </ScrollView>
        </SafeAreaView>
        {
          // 20200613 JustCode: Redux implementation
          this.props.page.get('favDetail').get('loading') &&
          <ActivityIndicator style={commonStyles.loading} size="large" color={'#219bd9'} />
        }
      </>
    );
  }
}

// 20200613 JustCode: Redux implementation
const ReduxFavDetail = connect((state) => {
  return {
    ui: state.ui,
    page: state.page
  };
})(FavDetail);

export default function(props) {
  const navigation = useNavigation();
  const route = useRoute();

  return <ReduxFavDetail {...props} navigation={navigation} route={route} />
}
