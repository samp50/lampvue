const firebase = require('firebase');
//import firebase from '@react-native-firebase/app';
config = {
    apiKey: "AIzaSyDMGWEmQ8Lonq5TN-JRt2mnynd-o2trKrw",
    authDomain: "lampvue.firebaseapp.com",
    databaseURL: "https://lampvue.firebaseio.com",
    projectId: "lampvue",
    storageBucket: "lampvue.appspot.com",
    messagingSenderId: "596302106789",
    appId: "1:596302106789:web:1fa00b176cecc831ecbd4c",
    measurementId: "G-M53JQSRPZG"    
}

const firebaseApp = firebase.initializeApp(config);
export default firebaseApp;