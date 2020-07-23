import { Constants } from "expo";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import getPermission from "../utils/getPermission";
const firebase = require('firebase');
import Fire from '../Fire';

const options = {
  allowsEditing: true
};

export default class SelectPhotoScreen extends Component {
  async componentDidMount() {
    const status = await getPermission(Permissions.CAMERA);
    if (status) {
      const result = await ImagePicker.launchCameraAsync(options);
      if (!result.cancelled) {
        this.props.navigation.navigate("NewPost", { image: result.uri });
      } /*else {
        this.props.navigation.navigate("Home");
      }*/
    }
  }

  state = {};

  _takePhoto = async () => {
    const status = await getPermission(Permissions.CAMERA);
    if (status) {
      const result = await ImagePicker.launchCameraAsync(options);
      if (!result.cancelled) {
        //this.props.navigation.navigate("NewPost", { image: result.uri }); //delete
        text = "sam-example-photo"
        image = result.uri;
        Fire.shared.post({ text: text.trim(), image });
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text onPress={this._takePhoto} style={styles.text}>
          Take another photo of your room
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    padding: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  }
});
