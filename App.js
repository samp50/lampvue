import React from 'react';
import { Alert, StyleSheet, Text, View, AsyncStorage } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
/*
import { FinalStack } from './navigation/AppNavigation.js';
import SignUp from './screens/Signup.js'; 
import FirebaseInstance from './FirebaseInstance.js';
import auth from '@react-native-firebase/auth';
const firebase = require('firebase');
import messaging from '@react-native-firebase/messaging';*/
import firebaseApp from './FirebaseInstance.js';
import AppContainer from './navigation';
//import firebase from '@react-native-firebase/app';
import firebase from '@react-native-firebase/app';
//const firebase = require('firebase');
import messaging from '@react-native-firebase/messaging';

export default class App extends React.Component {

  state = {
    appIsReady: false,
  };

  async componentDidMount() {
    console.log("App.js has been mounted, calling FirebaseInstance below...");
    try {
      await SplashScreen.preventAutoHideAsync();
    } catch (e) {
      console.warn(e);
    }
    this.prepareResources();
    //const defaultAppMessaging = admin.messaging();
    this.requestUserPermission();
    this.propsPushNotifications();
    this.generateFCMToken();
  }

  handlePushNotifications = () => {
    messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  }

  propsPushNotifications = () => {
    this.backgroundNotificationListener = messaging().onNotificationOpenedApp(async (remoteMessage) => {
      alert("Background Push Notification opened");
      console.log("Background Push Notification opened");
    });

    this.closedAppNotificationListener = messaging().getInitialNotification().then((remoteMessage) => {
      if (remoteMessage) {
        alert("App Closed Push Notification opened");
        console.log("App Closed Push Notification opened");
      }
    });

    this.onMessageListener = messaging().onMessage(() => {
      alert("Foreground Push Notification opened");
      console.log("Foreground Push Notification opened");
    });//
  }

  generateFCMToken = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log("FCM token is " + token);
    //await postToApi('/users/1234/tokens', { token });
  }
  

  prepareResources = async () => {
    this.setState({ appIsReady: true }, async () => {
      await SplashScreen.hideAsync();
    });
  }

  requestUserPermission = async () => {
    console.log("Starting requestUserPermission function.");
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
    } else {
      console.log("Permissions have not been enabled.");
    }
  }

  render() {
    if (!this.state.appIsReady) {
      return null;
    } else {
      return (
        <AppContainer/>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#aabbcc',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});