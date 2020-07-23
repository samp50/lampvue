import React, {Component} from 'react';
import {Image, Text, View, StyleSheet} from 'react-native';
import FirebaseInstance from '../FirebaseInstance.js';
import Fire from "../Fire.js";
import Firebase, { FirebaseProvider } from '../config/Firebase';
const firebase = require('firebase');

export default class SplashScreen extends Component {
  async componentDidMount() {
    const data = await this.navigateToHome();
    if (data !== null) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.props.navigation.navigate('Home');
          //console.log("user.uid is: " + user.uid);
          //collectionName = user.uid;
        } else {
          //Check AsyncStorage to see if user is restarting from new app version
          console.log("User info not available, checking to see if user is starting with new app version.");
          AsyncStorage.getAllKeys().then(result => {  //delete 
            //console.log("AsyncStorage is " + result);
            result.forEach(element => console.log("AsyncStorage new is" + element));
          });
      
        }
      });
      this.props.navigation.navigate('Auth');
    }
  }

  navigateToHome = async () => {
    // Splash screen will remain visible for 2 seconds
    const wait = time => new Promise((resolve) => setTimeout(resolve, time));
    return wait(2000).then(() => this.props.navigation.navigate('Auth'))
  };

  render() {
    return (
      <View style={ styles.container }>
        <Image source={require('../assets/lampvue-splash-ios.png')} style={styles.backgroundImage}/>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  backgroundImage: {
      flex: 1,
      resizeMode: 'cover', // or 'stretch'
  },
  loginForm: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
  },
});