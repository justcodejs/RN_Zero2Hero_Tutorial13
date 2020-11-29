# Setup Steps from Tutorial 12 to 13
This guide will show you the steps to perform if you are working from Tutorial 12 source code.

# Components to install
We need to install the Firebase Crashlytics module.

```
yarn add @react-native-firebase/crashlytics
cd ios && pod install && cd ..
```

# For android setup
Make sure the android/build.gradle have the following setting.

```
// ..
buildscript {
  // ..
  repositories {
    // ..
    google()    <=== Required. Add if it is not there.
  }
  // ..
  dependencies {
    // ..
    classpath 'com.google.firebase:firebase-crashlytics-gradle:2.2.0' <=== Required.
  }
}
```

Apply the com.google.firebase.crashlytics plugin by adding the following to the top of your android/app/build.gradle file:

```
// ..
apply plugin: 'com.android.application'
apply plugin: 'com.google.gms.google-services' // apply after this line
apply plugin: 'com.google.firebase.crashlytics' <=== Required.
// ..
```

In the same android/app/build.gradle file, add in the nativeSymbolUploadEnabled as shown below:

```
android {
    // ...

    buildTypes {
        release {
            /* Add the firebaseCrashlytics extension (by default,
            * it's disabled to improve build speeds) and set
            * nativeSymbolUploadEnabled to true. */

            firebaseCrashlytics {
                nativeSymbolUploadEnabled true
            }
            // ...
        }
    }
}
```