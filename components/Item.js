import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { AsyncStorage, Image, StyleSheet, Text, View, TouchableOpacity, Linking } from "react-native";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import Fire from "../Fire";
const firebase = require('firebase');
import { Asset, AppLoading } from 'expo';
require('firebase/firestore');

const profileImageSize = 36;
const padding = 12;

export default class Item extends React.Component {
  state = {};

  componentDidMount() {
    if (!this.props.imageWidth) {
      // Get the size of the web image
      Image.getSize(this.props.image, (width, height) => {
        this.setState({ width, height });
      });
    }
  }

  delete = () => {
    console.log('passed in a arrow function via a variable');
  }

  render() {
    var Picture = require('../assets/lampvuePNG.png');
    const testImage = require('../assets/lampvuePNG.png');
    const { text, name, imageWidth, imageHeight, uid, image, itemPrice, commisionedLink, itemName, productDimensions } = this.props;
    //added handlers for accidentally swapped database categories
    console.log("Image uri for each entry is: " + image); //delete
    productDimensionsFinal = productDimensions;
    if (productDimensionsFinal == 'nan') {
      const productDimensionsFinal = 'See product dimensions on vendor site';
    }
    //console.log("productDimensions is " + productDimensionsFinal);
    if (itemName.startsWith('$')) {
      itemNameFinal = itemPrice
    } else {
      itemNameFinal = itemName
    }
    //console.log("itemNameFinal is " + itemNameFinal);
    var itemPriceFinal;
    try {
      itemPriceFinal = '$' + itemPrice.split('$')[1];//.replace("(", "");
      if (itemPriceFinal == '$undefined') {
        itemPriceFinal = "See price on the vendor's site";
      }
    } catch {
      itemPriceFinal = 'See price on vendor site';
    }
    if (commisionedLink == 'undefined') {
      commisionedLink = "merchgraph.com"
    } else {
      //commisionedLink = commisionedLink;
    }
    const imgW = imageWidth || this.state.width;
    const imgH = imageHeight || this.state.height;
    const aspect = imgW / imgH || 1;

    return (
      <View>
        <Header image={{ uri: image }} name={itemNameFinal} />
        <Image
          source={{ uri: image }}
          resizeMode="contain"
          style={{
            backgroundColor: "#D8D8D8",
            width: "100%",
            aspectRatio: aspect
          }}
        />
        <Metadata name={name} description={itemPriceFinal} commisionedLink={commisionedLink} image={image} itemPriceFinal={itemPriceFinal} />
      </View>
    );
  }
}

const Metadata = ({ image, name, description, commisionedLink, itemPriceFinal, itemNameFinal }) => (
  <View style={styles.padding}>
    <IconBar image={image} name={name} productDimensionsFinal={productDimensionsFinal} itemPriceFinal={itemPriceFinal} />
      <TouchableOpacity onPress={() => Linking.openURL(commisionedLink)}>
        <Text style={styles.text}>{name}</Text>
        <Text style={styles.subtitle}>{description}</Text>
        <Text style={styles.subtitle}>Product dimensions are: {productDimensionsFinal}</Text>
      </TouchableOpacity>
  </View>
);

const Header = ({ name, image }) => (
  <View style={[styles.row, styles.padding]}>
    <View style={styles.row}>
      <Image style={styles.avatar} source={image} />
      <Text style={styles.text}>{name}</Text>
    </View>
  </View>
);

const Icon = ({ name }) => (
  <Ionicons style={{ marginRight: 8 }} name={name} size={26} color="black" />
);

const IconBar = ({ image, name, productDimensionsFinal, itemPriceFinal }) => (
  <View style={styles.row}>
    <View style={styles.row}>
      <TouchableOpacity onPress={async () => {
        console.log("Starting openShareDialogAsync function...");
        console.log("Image file is: " + image);
        if (!(await Sharing.isAvailableAsync())) {
          alert("Sorry, sharing isn't available on your platform");
          return;
        } else {
          console.log("Beginning sharing file subroutine.");
          FileSystem.downloadAsync(
            image,
            FileSystem.documentDirectory + 'sendDownload.jpg'
          )
            .then(({ uri }) => {
              console.log('Finished downloading to ', uri);
            })
            .catch(error => {
              console.error(error);
            });
          
          await Sharing.shareAsync(FileSystem.documentDirectory + 'sendDownload.jpg');
        }
      }}>
        <Icon name="ios-send"/>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  text: { fontWeight: "600" },
  subtitle: {
    opacity: 0.8
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  padding: {
    padding
  },
  avatar: {
    aspectRatio: 1,
    backgroundColor: "#D8D8D8",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#979797",
    borderRadius: profileImageSize / 2,
    width: profileImageSize,
    height: profileImageSize,
    resizeMode: "cover",
    marginRight: padding
  }
});
//description={description} commisionedLink={commisionedLink} itemPriceFinal={itemPriceFinal} itemNameFinal={itemNameFinal} />
/*
<Image
  resizeMode="contain"
  style={{
    backgroundColor: "#D8D8D8",
    width: "100%",
    aspectRatio: aspect
  }}
  source={{ uri: image }}
/>
*/