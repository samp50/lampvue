import firebase from "firebase";
import React, { Component } from "react";
import { LayoutAnimation, RefreshControl, Text, Viewlott, View, StyleSheet, ScrollView, Button, Vibration } from "react-native";
import List from "../components/List";
import Fire from "../Fire";
import LottieView from "lottie-react-native";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import SideMenu from 'react-native-side-menu';
import Drawer from 'react-native-drawer';
import DropdownAlert from 'react-native-dropdownalert';
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
    var savedImagesDict;
    global.savedImagesDict = savedImagesDict;
    if (Fire.shared.uid) {
      this.makeRemoteRequest();
    } else {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.makeRemoteRequest();
        }
      });
    }
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
        console.log("Got data in our feed.")
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
    //originally placed check-for-data here...
    LayoutAnimation.easeInEaseOut();
    //console.log(this.state.posts.length)
    if (this.state.posts.length > 0) {
      console.log("Got data in the feed.")
      //console.log(this.state.posts);
      return (
        <View>
          <DropdownAlert ref={ref => this.dropDownAlertRef = ref} closeInterval={10000}/>
          <List
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={this._onRefresh}
              />
            }
            onPressFooter={this.onPressFooter}
            data={this.state.posts}
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