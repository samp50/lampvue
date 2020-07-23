import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DropdownAlert from 'react-native-dropdownalert';
import Fire from '../Fire';
import firestore from '@react-native-firebase/firestore';

const halfScreenWidth = Math.round(Dimensions.get('window').width) / 2;

export default class SelectPhotoScreen extends React.Component {
  state = {
    hasPermission: null,
    cameraType: Camera.Constants.Type.back,
  }

  async componentDidMount() {
    this.getPermissionAsync()
  }

  getPermissionAsync = async () => {
    if (Platform.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work! If you have disabled camera permissions, you can reenable them in the settings app: Settings -> LampVue -> Turn on Camera Button.');
      } else {
        this.setState({ hasPermission: status === 'granted' });

      }
    }
  }

  handleCameraType=()=>{
    const { cameraType } = this.state

    this.setState({cameraType:
      cameraType === Camera.Constants.Type.back
      ? Camera.Constants.Type.front
      : Camera.Constants.Type.back
    })
  }

  takePicture = async () => {
    if (this.camera) {
      this.dropDownAlertRef.alertWithType('info', 'Uploading your photo now...', 'Please stay on this screen until the green success message appears.');
      let photo = await this.camera.takePictureAsync({
        forceUpOrientation: true, 
        fixOrientation: true, 
        exif: true, //changed this 
        quality: .01
      });
      console.log(photo);
      const image = photo.uri;
      Fire.shared.uploadPhotoAsync(image).then(data => {
        //console.log("Another response from uploading the photo!")
        setTimeout(() => {
          this.dropDownAlertRef.alertWithType('success', 'Success', 'Photo uploaded to our servers.');
        }, 2000);
      })
    }
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });
  }
  

  render(){
    const { hasPermission } = this.state
    if (hasPermission === null) {
      return <View />;
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
          <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} type={this.state.cameraType}  ref={ref => {this.camera = ref}}>
              <View style={{flex:1, flexDirection:"row",justifyContent:"space-between",margin:30}}>
                <DropdownAlert ref={ref => this.dropDownAlertRef = ref} closeInterval={10000}/>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: halfScreenWidth - 50,
                  }}
                  onPress={()=>this.takePicture()}
                  >
                  <FontAwesome
                      name="camera"
                      style={{ color: "#fff", fontSize: 40}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                  }}
                  onPress={() => console.log("Pressed on dead space~")}
                  >
                </TouchableOpacity>
              </View>
            </Camera>
        </View>
      );
    }
  }
  
}