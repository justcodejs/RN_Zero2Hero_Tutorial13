import AsyncStorage from '@react-native-community/async-storage';
// 20200926 JustCode - Firebase FireStore Implementation
import firestore from '@react-native-firebase/firestore';

export default class Helper {

  static isNotNullAndUndefined(obj, props = []) {
    let bIsNullorUndefined =  obj === null || obj === undefined;
    let curObj = null;

    if(!bIsNullorUndefined) {
      curObj = obj;
      if(props !== null) {
        for(let idx=0; idx < props.length; idx++) {
          bIsNullorUndefined = curObj[props[idx]] === null || curObj[props[idx]] === undefined;
          curObj =  curObj[props[idx]]; // Set the curObj[props[idx]] to curObj so that it will recursive down the depth of the object

          if(bIsNullorUndefined)
            break;
        }
      }
    }
    
    return !bIsNullorUndefined;
  }

  static carefullyGetValue(obj, props = [], defaultValue='') {
    let bIsNullorUndefined =  obj === null || obj === undefined;
    let curObj = null;

    if(!bIsNullorUndefined) {
      curObj = obj;
      if(props !== null) {
        for(let idx=0; idx < props.length; idx++) {
          bIsNullorUndefined = curObj[props[idx]] === null || curObj[props[idx]] === undefined;
          curObj =  curObj[props[idx]]; // Set the curObj[props[idx]] to curObj so that it will recursive down the depth of the object

          if(bIsNullorUndefined)
            break;
        }
      }
    }
    
    if(bIsNullorUndefined)
      return defaultValue;
    else
      return curObj;
  }

  static capitalize(str) {
    if (typeof str !== 'string') return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  // 20200926 JustCode - Firebase FireStore Implementation
  static async isFav(word, session) {
    let isFavourited = false;

    try {
      if(session && session.get('authenticated') && 
         session.get('user') && session.get('user').uid &&
         session.get('user').uid.length > 0) {

        let snapShot = await firestore()
        .collection('FavWord')
        .where('userId', '==', session.get('user').uid) // only get the FavWord record belong to the user
        .where('word', '==', word.toLowerCase())
        .get();

        isFavourited = snapShot.docs && snapShot.docs.length > 0;
      }
    } catch(error) {
      isFavourited = false;
    }
    return isFavourited;
  }

  // 20200926 JustCode - Firebase FireStore Implementation
  static async makeFav(word, sense, session) {

    try {
      if(session && session.get('authenticated') && 
         session.get('user') && session.get('user').uid &&
         session.get('user').uid.length > 0) {

        let snapShot = await firestore()
        .collection('FavWord')
        .add({
          word,
          sense,
          addedOn: new Date(),
          userId: session.get('user').uid
        });
      }
    } catch(error) {
      console.log('makeFav Error: ', error);
    }
  }

  // 20200926 JustCode - Firebase FireStore Implementation
  static async deleteFav(word, session, callback=null) {
    try {
      if(session && session.get('authenticated') && 
         session.get('user') && session.get('user').uid &&
         session.get('user').uid.length > 0) {

        // Get the record ID as the wordDef component didn't have the record id.
        let snapShot = await firestore()
        .collection('FavWord')
        .where('userId', '==', session.get('user').uid) // only get the FavWord record belong to the user
        .where('word', '==', word.toLowerCase())
        .get();

        if(snapShot.docs && snapShot.docs.length > 0) {
          await firestore()
          .collection('FavWord')
          .doc(snapShot.docs[0].id)
          .delete();
        }

        callback && callback();
      }
    } catch(error) {
      console.log('deleteFav Error: ', error);
    }
  }

  // 20200926 JustCode - Firebase FireStore Implementation
  static async getFavList(search, session) {
    let favList = [];

    try {
      if(session && session.get('authenticated') && 
         session.get('user') && session.get('user').uid &&
         session.get('user').uid.length > 0) {

        let snapShot = await firestore()
        .collection('FavWord')
        .where('userId', '==', session.get('user').uid) // only get the FavWord record belong to the user
        .orderBy('addedOn', 'desc')
        .get();

        // Convert the FireStore document object to the array use by the app
        if(snapShot.docs) {
          favList = snapShot.docs.map(x => {return {
            id: x.id,
            word: x.get('word'),
            sense: x.get('sense'),
            addedOn: x.get('addedOn').toDate(), // Convert from FireStoreTimestamp to Javascript date object
            userId: x.get('userId'),
          }});
        }

        if(favList.length > 0 && Helper.isNotNullAndUndefined(search) && search.length > 0) {
          let filteredList = favList.filter(item => item.word.toUpperCase().includes(search.toUpperCase()));
          return filteredList;
        }
        else {
          return favList;
        }
        
      }
      
    } catch(error) {
      console.log('FireStore Error: ', error);
      return favList;
    }
  }

  static getSense(def) {
    let defSense = ''
    if(Helper.isNotNullAndUndefined(def, ['results', '0', 'lexicalEntries'])) {
      let lexicalEntries = def.results[0].lexicalEntries;
  
      for(lexicalIndex in lexicalEntries) {
        let lexicalItem = lexicalEntries[lexicalIndex];
        if(this.isNotNullAndUndefined(lexicalItem, ['entries','0','senses'])) {
          let senses = lexicalItem.entries[0].senses;
          if(senses && senses.length > 0) {
            for(senseIndex in senses) {
              let sense = senses[senseIndex];
              if(sense.definitions) { // Only if sense have definition
                let definition = Helper.carefullyGetValue(sense, ['definitions', '0'], '');
                if(definition.length > 0) {
                  defSense = definition;
                  break;
                }
              }
            }
          }
        }

        if(defSense.length > 0)
          break;
      }
    }

    return defSense;
  }

  // 20200529 JustCode: 
  // Get user language setting from AsyncStorage 
  static async getDeviceLanguageFromStorage() {
    try {
      let lang = await AsyncStorage.getItem('lang');
      if(lang && lang.length > 0)
        return lang;
      else
        return 'en'; // No language setting, default it to english
    }
    catch(error) {
      // Can't get the language setting, default it to english
      return 'en';
    }
  }

  static updateDeviceLanguageToStorage(lang) {
    try {
      AsyncStorage.setItem('lang', lang);
    }
    catch(error) { }
  }

  // 20200825 JustCode - Firebase Auth Implementation
  static validateEmail(email) 
  {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
  }

  static validatePassword(password) 
  { 
    return (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/.test(password));
  } 
  
  // 20201119 JustCode: For Crashlytics
  static async getCrashlyticsSetting() {
    try {
      let crashlytics = await AsyncStorage.getItem('crashlytics');
      return crashlytics && crashlytics === 'true';
    }
    catch(error) {
      // Can't get the crashlytics setting, default it to null
      return null;
    }
  }

  // 20201119 JustCode: For Crashlytics
  static updateCrashlyticsSetting(enable) {
    try {
      AsyncStorage.setItem('crashlytics', enable ? 'true' : 'false');
    }
    catch(error) { }
  }
}