import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#219bd930',
    color: '#ff0000'
  },
  content: {
    padding: 6
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#219bd9',
  },
  logo: {
    width: 100,
    height: 100
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  column: {
    flex: 1,
    flexDirection: 'column'
  },
  errMsg: {
    fontSize: 18,
    fontWeight: '400',
    color: 'red',
  },
  drawerHeader: {
    height: 170, 
    backgroundColor: '#219bd9', 
    justifyContent: 'center',
    margin: 0
  },
  drawerProfilePhoto: {
    width: 100, 
    height: 100, 
    alignSelf: 'center', 
    borderRadius: 50,
    backgroundColor: 'white',
    overflow: 'hidden'
  },
  profileCamera: {
    position: 'absolute',
    bottom: -10,
    right: -10
  },
  //20200825 JustCode - Firebase Auth Implementation
  textBox: {
    margin: 10,
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1, 
    paddingLeft: 4, 
    paddingRight: 4, 
    paddingTop: 2, 
    paddingBottom: 2
  },
});

export default commonStyles;