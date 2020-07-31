import uuid from 'uuid';
import getUserInfo from './utils/getUserInfo';
import shrinkImageAsync from './utils/shrinkImageAsync';
import uploadPhoto from './utils/uploadPhoto';
import { AsyncStorage } from 'react-native';
const firebase = require('firebase');
require('firebase/firestore');
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

var collectionName; //note: collectionName is the same as user's uid!
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("user.uid is: " + user.uid);
    collectionName = user.uid;
    messaging().getToken().then(token => {
      console.log("FCM from Fire.js token is " + token);
      firestore().collection('notSignedInUsers').doc(token).delete({token: token});
    });
  } else {
    //Check AsyncStorage to see if user is restarting from new app version
    console.log("User info not available, checking to see if user is starting with new app version.");
    //await messaging().registerDeviceForRemoteMessages();
    messaging().getToken().then(token => {
      console.log("FCM from Fire.js token is " + token);
      firestore().collection('notSignedInUsers').doc(token).set({token: token});
    });
  }
});

class Fire {
  //removed empty constructor here
  getPaged = async ({ size, start }) => { 
    let ref = this.collection.orderBy('timestamp', 'desc').limit(size);
    try {
      if (start) {
        ref = ref.startAfter(start);
      }

      const querySnapshot = await ref.get();
      const data = [];
      firestoreItemCount = 0;
      querySnapshot.forEach(function(doc) {
        if (doc.exists) {
          const post = doc.data() || {};
          const user = post.user || {};
          const name = user.deviceName;
          if (post.itemName.startsWith('$')) {
            itemName = post.itemPrice
          } else {
            itemName = post.itemName
          }
          
          const reduced = {
            key: doc.id,
            name: post.itemName + '...',//(name || 'MerchGraph Furniture Data').trim(),
            ...post,
          };
          data.push(reduced);
          firestoreItemCount += 1;
        }
      });
      console.log("firestoreItemCount is " + firestoreItemCount);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      return { data, cursor: lastVisible };
    } catch ({ message }) {
      alert(message);
    }
  };

  addFCMTokenToUserData = async collectionName => {
    //func writes the user's fcm token to firestore for retrieval 
    //by google cloud function services
    //will overwrite each time func is called, so gcf has most
    //up-to-date token 
    const token = await messaging().getToken();
    console.log("User's FCM token is: " + token);
    console.log("User's collectionName is: " + collectionName);
    firestore()
      .collection('users')
      .doc(collectionName)
      .set({
        currentFCMToken: token
      });
  }

  uploadPhotoAsync = async uri => {
    this.addFCMTokenToUserData(collectionName);
    const path = `${collectionName}/LR-upload+${collectionName}+${uuid.v4()}.jpg`;
    console.log("Name of the LR photo being uploaded: ", path)
    return uploadPhoto(uri, path);
  };

  post = async ({ text, image: localUri }) => {
    try {
      const { uri: reducedImage, width, height } = await shrinkImageAsync(
        localUri,
      );

      const remoteUri = await this.uploadPhotoAsync(localUri);
      this.collection.add({
        text,
        uid: this.uid,
        timestamp: this.timestamp,
        imageWidth: width,
        imageHeight: height,
        image: remoteUri,
        //user: getUserInfo(),
      });
      console.log(this.timestamp)

    } catch ({ message }) {
      alert(message);
    }
  };

  get collection() {
    return firebase.firestore().collection(collectionName);
  }

  get document() {
    return firebase.firestore().document(collectionName);
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }
  get timestamp() {
    return Date.now();
  }
}

Fire.shared = new Fire();
export default Fire;