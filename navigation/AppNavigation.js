import React from 'react';
import { Alert, AsyncStorage, View, Text, ListView, ScrollView, SafeAreaView, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Button, SideMenu, Divider, Icon } from 'react-native-elements';
import { createStackNavigator } from 'react-navigation-stack';
import Home from '../screens/Home';
import SelectPhotoScreen from '../screens/SelectPhotoScreen';
import NewPostScreen from '../screens/NewPostScreen';
import RoomSelection from '../screens/RoomSelection';
import WallCount from '../screens/WallCount';
import LampInfoScreen from '../screens/LampInfoScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import styles from '../screens/SideMenuStyles';
import firebase from 'firebase';
import { createDrawerNavigator, Drawer } from 'react-navigation-drawer';
import { DrawerView } from "react-navigation";
import { render } from 'react-dom';
import List from '../components/List';

// If user is signed in with Apple (anonymously), disable sign out button
/*if (firebase.auth().currentUser.isAnonymous == true) {
  var signOutButtonDisabled =  true
}*/

function signOut(navigation) {
  firebase.auth().signOut();
  navigation.navigate('Login');
}

const AppNavigation = createStackNavigator(
  {
    Home: { 
      screen: Home,
      navigationOptions: ({ navigate, navigation }) => ({
        title: 'LampVue®',
        headerLeft: <Button 
          title="⚙️"
          color="white"
          onPress={() => {this._drawer.open()}}
        />,
        headerRight: 
          <Button 
            title="📷"
            color="white"
            onPress={() => this._drawer.navigate('LampInfoScreen')}
          />,
      }),
    },
    SelectPhotoScreen: {
      screen: SelectPhotoScreen
    },
    NewPost: { 
      screen: NewPostScreen
    },
    RoomSelection: {
      screen: RoomSelection
    },
    WallCount: {
      screen: WallCount
    },
    LampInfoScreen: {
      screen: LampInfoScreen
    },
    FavoritesScreen: {
      screen: FavoritesScreen
    }
  }
)

async function viewFavoriteImages() {
  console.log("Starting viewFavoriteImages function...");
  const asyncValues = await AsyncStorage.getAllKeys();
  //iterate over all asyncValues, get ones prefixed with "savedLampVueImage"
  for (var i = 0; i < asyncValues.length; i++) {
    if (asyncValues[i].startsWith("savedLampVueImage")) {
      AsyncStorage.getItem(asyncValues[i]).then(asyncVal => {
        console.log(asyncVal);
      })
    }
  }
}

const contentComponent = (props) => (
  <View style={styles.container}>
    <ScrollView>
      <View>
        <View style={styles.navSectionStyle}>
          <Button
            title="Sign out"
            onPress={() => Alert.alert(
              'Are you sure you want to sign out?',
              '',
              [
                {text: 'Sign Out', onPress: () => {
                  function signOut(navigation) {
                    firebase.auth().signOut();
                    props.navigation.navigate('Login');
                  };
                  signOut()
                  }
                },
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
              ],
              {cancelable: false},
            )}
            disabled={firebase.auth().currentUser.isAnonymous}
          />
        </View>
      </View>
    </ScrollView>
    <View style={styles.footerContainer}>
      <Text>© 2019-2020 LampVue Technologies, Inc.</Text>
    </View>
  </View>
);

const FinalDrawer = createDrawerNavigator(
  {
    Home: { 
      screen: Home,
      navigationOptions: ({ navigate, navigation }) => ({
        title: 'LampVue®',
        headerLeft: <Button 
          title="⚙️"
          color="white"
          onPress={() => {this._drawer.open()}}
        />,
        headerRight: 
          <Button 
            title="📷"
            color="white"
            onPress={() => navigation.navigate('LampInfoScreen')}
          />,
      }),
    },
  }, {
    contentComponent: contentComponent,
  }
)

const FinalStack = createStackNavigator(
  {
    LampInfoScreen: {
      screen: LampInfoScreen,
      navigationOptions: {
        title: ''
      }
    },
    SelectPhotoScreen: {
      screen: SelectPhotoScreen,
      navigationOptions: {
        title: ''
      }
    },
    SelectPhotoScreen: {
      screen: SelectPhotoScreen,
      navigationOptions: {
        title: ''
      }
    },
    FavoritesScreen: {
      screen: FavoritesScreen,
      navigationOptions: {
        title: 'My Favorites'
      }
    },
    FinalDrawer: {
      screen: FinalDrawer,
      navigationOptions: ({ navigate, navigation }) => ({
        title: "LampVue®",
        headerLeft: <Button 
          title="⚙️"
          color="white"
          onPress={() => navigation.openDrawer()}
        />,
        headerRight: 
          <Button 
            title="📷"
            color="white"
            onPress={()=> navigation.navigate('LampInfoScreen')} //change me!
          />,
      }),
    }
  },
  {
    initialRouteName: 'FinalDrawer',
  }
)

export default FinalStack;