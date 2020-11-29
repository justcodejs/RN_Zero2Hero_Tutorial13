import React from "react";
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default Header = ({navigation, LeftButton, RightButton, Title, isAtRoot}) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftButton}>
        {
          LeftButton ?
          <LeftButton />
          :
          <TouchableOpacity style={{marginLeft: 10}}
            onPress={() => {
              if(!navigation.canGoBack() || isAtRoot)
                navigation.openDrawer();
              else
                navigation.goBack();
            }}
          >
            <Icon name={(!navigation.canGoBack() || isAtRoot) ? 'ios-menu' : 'ios-arrow-back'} size={30} color={'gray'} />
          </TouchableOpacity>
        }
      </View>
      <View style={styles.title}>
        {
          Title && typeof Title === 'string' ?
          <Text style={styles.titleText}>{Title}</Text>
          :
          <Title />
        }
      </View>
      <View style={styles.rightButton}>
        {
          RightButton &&
          <RightButton />
        }
      </View>
    </View>
  );
}

Header.propTypes = {
  navigation: PropTypes.object,
  Title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  LeftButton: PropTypes.object,
  RightButton: PropTypes.object,
  isAtRoot: PropTypes.bool
};

Header.defaultProps = {
  Title: '',
  LeftButton: null,
  RightButton: null,
  isAtRoot: false
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row'
  },
  leftButton: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black'
  },
  rightButton: {
    flex: 1,
    justifyContent: 'center'
  }
});