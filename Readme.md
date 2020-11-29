# JustCode - React Native Zero to Hero Tutorial 13
Hi! Welcome to JustCode React Native Zero to Hero Tutorial 13 Github page. To run the application in this Github page you need to:

1. Have a valid [Oxford Dictionaries API](https://developer.oxforddictionaries.com) account and create the application ID and Key. If you don't have, please sign up one at [https://developer.oxforddictionaries.com](https://developer.oxforddictionaries.com/)
2. Have a workable React Native development environment. If you don't have please watch the tutorial 1 video from the available sources below:

    English Version
      * Facebook: [https://www.facebook.com/justcodejs/videos/494682137916280/](https://www.facebook.com/justcodejs/videos/494682137916280/)
      * YouTube: [https://youtu.be/Bfv0Mr4lnEk](https://youtu.be/Bfv0Mr4lnEk)
      * YouKu: [https://v.youku.com/v_show/id_XNDUzODQxNzU4MA==.html](https://v.youku.com/v_show/id_XNDUzODQxNzU4MA==.html)
      * BiliBili: [https://www.bilibili.com/video/av87916476/](https://www.bilibili.com/video/av87916476/)

    Chinese Version
      * Facebook: [https://www.facebook.com/justcodejs/videos/645833862836838/](https://www.facebook.com/justcodejs/videos/645833862836838/)
      * YouTube: [https://youtu.be/WMg6lQ1xadY](https://youtu.be/WMg6lQ1xadY)
      * YouKu: [https://v.youku.com/v_show/id_XNDUzODUzMDc0NA==.html](https://v.youku.com/v_show/id_XNDUzODUzMDc0NA==.html)
      * BiliBili: [https://www.bilibili.com/video/av87915891/](https://www.bilibili.com/video/av87915891/)

3. Have a valid Apple Developer account.
4. Have a valid Firebase account and project. Please watch your [Tutorial 5](https://youtu.be/-GwmUTKzuX0) if you not familiar with Firebase.
5. Download the Firebase Google service json and plist file for android and iOS. Place the google-services.json in android/app folder and GoogleService-Info.plist in ios folder.
6. Once you have the above conditions met, you may download the tutorial source code as a zip file or clone it using the command below.

`git clone https://github.com/justcodejs/RN_Zero2Hero_Tutorial12.git`

After you had downloaded/cloned the source code, you need to perform the tasks below:

1. Change the App ID and Key in the src/lib/api.js file to the one you registered.
2. Generate your own Google Firebase configuration file for both Android and iOS.
3. Please follow the Setup.md file on **iOS 14 Bugfix**

## For Mobile App 
Execute the commands below in the project folder via the command prompt (Windows) or terminal (Mac)

```
# 1 - Install all the required modules
yarn install

# 2 - Run the application
# For iOS, please make sure you run the pod install command as shown below.

cd ios && pod install && cd ..

npx react-native run-ios
or 
npx react-native run-android
```

That is all and have Fun! All our videos are available in the following platforms: 
* [Justnice.Net](https://justnice.net/wp/blog)
* [Facebook Page](https://www.facebook.com/pg/justcodejs)
* [YouTube Channel](https://www.youtube.com/channel/UCBBvKaJQEoBKww71zN7vutg)
* [BiliBili](https://space.bilibili.com/487354370?spm_id_from=333.788.b_765f7570696e666f.2)
* [YouKu](http://i.youku.com/i/UMjg3MDcwNDE0NA==?spm=a2hzp.8244740.0.0)
* [Tencent](http://v.qq.com/vplus/d843e4cbcfd740d17afa2888d66bd01c)