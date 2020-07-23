import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Initial from '../screens/Initial';
import AuthNavigation from './AuthNavigation';
import AppNavigation from './AppNavigation';
import NewPostScreen from '../screens/NewPostScreen';
import RoomSelection from '../screens/RoomSelection';
import SplashScreen from '../screens/SplashScreen';

const MainDrawer = createDrawerNavigator({
  NewPostScreen: NewPostScreen,
  RoomSelection: RoomSelection,
});

const AppModalStack = createStackNavigator(
  {
    App: MainDrawer
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

const SwitchNavigator = createSwitchNavigator(
  {
    SplashScreen: {
      screen : SplashScreen
    },
    Initial: Initial,
    Auth: AuthNavigation,
    App: AppNavigation
  },
  {
    initialRouteName: 'SplashScreen'
  }
)

const AppContainer = createAppContainer(SwitchNavigator);

export default AppContainer;