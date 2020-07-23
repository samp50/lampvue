import firebase from "firebase";
import React, { Component } from "react";
import { LayoutAnimation, RefreshControl, Text, Viewlott, View, StyleSheet, ScrollView, Button, Vibration, AsyncStorage } from "react-native";
import List from "../components/List";
import Fire from "../Fire";
import LottieView from "lottie-react-native";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import SideMenu from 'react-native-side-menu';
import Drawer from 'react-native-drawer';
// Set the default number of images to load for each pagination.
const PAGE_SIZE = 15;
console.disableYellowBox = true;
export default class Home extends Component {
  state = {
    loading: false,
    posts: [],
    data: {},
    notification: {},
  };

  async componentDidMount() {
    function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
    if (Fire.shared.uid) {
      this.makeRemoteRequest();
    } else {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.makeRemoteRequest();
        }
      });
    }
    //start: get firestore stuff
    var userUuid = firebase.auth().currentUser.uid;
    console.log("savedFavorites-" + userUuid)
    await firebase.firestore().collection("savedFavorites-" + userUuid).get()
      .then(doc => { 
        console.log("refDummy is " + doc.data().toString()); 
      })
      .catch(err => { /* error! */ });
  }

  // Append the item to our states `data` prop
  addPosts = posts => {
    this.setState(previousState => {
      let data = {
        ...previousState.data,
        ...posts
      };
      //console.log("Home's data is");
      //console.log(data);
      return {
        data,
        // Sort the data by timestamp
        posts: Object.values(data).sort((a, b) => a.timestamp < b.timestamp)
      };
      if (this.state.posts.length > 0) {
        //console.log("Got data in our feed.")
        //console.log(finalFeedData)
        var finalFeedData = this.state.posts;
      } else {
        console.log("No data in feed.")
      }
    });
  };

  // Call our database and ask for a subset of the user posts
  makeRemoteRequest = async lastKey => {
    // If we are currently getting posts, then bail out..
    if (this.state.loading) {
      return;
    }
    this.setState({ loading: true });

    // The data prop will be an array of posts, the cursor will be used for pagination.
    const { data, cursor } = await Fire.shared.getPaged({
      size: PAGE_SIZE,
      start: lastKey
    });

    this.lastKnownKey = cursor;
    // Iteratively add posts
    let posts = {};
    for (let child of data) {
      posts[child.key] = child;
      //console.log(child)
    }
    this.addPosts(posts);

    // Finish loading, this will stop the refreshing animation.
    this.setState({ loading: false });
  };

  // Because we want to get the most recent items, don't pass the cursor back.
  // This will make the data base pull the most recent items.
  _onRefresh = () => this.makeRemoteRequest();

  // If we press the "Load More..." footer then get the next page of posts
  onPressFooter = () => this.makeRemoteRequest(this.lastKnownKey);

  render() {
    /*
    var savedImagesDict;
    var savedImagesDict = [];
    AsyncStorage.getAllKeys().then(value => {
      console.log("Stored data vals is" + value);
      value.forEach((element) => {
        if (element.startsWith("savedLampVueImage-")) {
          console.log('result is ' + element);
          savedImagesDict.push(element);
          const savedItem = AsyncStorage.getItem(element);
          savedItem.then(result => {
            var elementName = "savedImage-" + uuidv4();
            var savedImageObject = {elementName: elementName};
            savedImageObject[elementName] = elementName;
            console.log("savedImageObject is " + JSON.stringify(savedImageObject));
            this.setState({ savedImageObject }, function() {
              console.log("Updated state");
              console.log(this.state);
              // delete me: iterate over JS object, that is this.state, and return 
              // stuff startong with "savedImage-"
          });
          })
          //savedImages.push(AsyncStorage.getItem(element));
        };
        //console.log("savedImagesDict is "+ savedImagesDict); //here
      });
      console.log("savedImagesDict is XXXX"+ savedImagesDict); //here
    });*/
    console.log("Stuff is below");
    console.log(this.state.element)
    //originally placed check-for-data here...
    LayoutAnimation.easeInEaseOut();
    //get all async stuff starting with 
    //console.log("savedImagesDict is " + savedImagesDict);
    if (this.state.posts.length > 0) {
      console.log("Got data in the feed.")
      var savedObject = new Array;
      savedObject.global = savedObject;
      AsyncStorage.getAllKeys().then(value => {
        console.log("Stored data vals is" + value);
        value.forEach((element) => {
          if (element.startsWith("savedLampVueImage-")) {
            savedObject.push(element);
            console.log("savedObject is " + savedObject);
          }
        }
      )});
      console.log("savedObject os " + savedObject);
      var dummyData = [{
        "image": "https://storage.googleapis.com/lv-resize-destination//tmp/final-864cbae1-aab4-48ad-92d0-9c89728fb433.jpg?Expires=1755097357&GoogleAccessId=lampvue%40appspot.gserviceaccount.com&Signature=f4hYwYm2cVOTaAg2567G1PuecImewjO80HdGHaza03sU%2FYckvZTL7Fc5SJUBKfhZiPvY3EKetIRIHms4nY%2FKCWlvvKeRI3O%2FBSsnFzQ6hcROrnTAbVQrI0OElAa6yFyuNZXuCklmKCXen1bBDQIhcWmHe9cV08cA5ihpPyEeWIAbMlmcPHXAKrTOA5DXPPopXFvDli64RCVA0BBvHeyxBlBcn8s2OlKcYTFjKET8K1AIFHPBos9xs31sk3FeM785xtNjvrqXLovVCYYIo5RGEpHtCtCGE8yiIauVIYBLQhZ4vBJW%2BU%2FM1URBtzrueWRHnud6BhY%2FdjOU0yJHdN2CUg%3D%3D",
        "itemPrice": "$363.00",
        "itemName": "Barreto 29'' Table Lamp...",
        "productDimensions": "33\" H x 18\" W x 18\" D",
        "name": "Barreto 29'' Table Lamp...", 
      }];
      return (
        <View>
          <List
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={this._onRefresh}
              />
            }
            onPressFooter={this.onPressFooter}
            data={dummyData}
          />
        </View>
      );
    } else {
      console.log("No data in feed, returning instructions for user...")
      return (
        <View>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={this._onRefresh}
              />
            }>
            <LottieView
              autoPlay={true}
              loop={true}
              style={{
                width: 400,
                height: 400,
              }}
              source={require('../assets/18317-loading.json')}
            />
            <Text style={styles.noDataResponseText}>
            ◦  You haven't uploaded any photos yet. {"\n"}
            ◦  Press the 📷 button above to get started! {"\n"}
            ◦  If you have uploaded photos, you can pull down to refresh the screen. {"\n"}
            </Text>
          </ScrollView>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  noDataResponseText: {
    fontSize: 21,
  }
})