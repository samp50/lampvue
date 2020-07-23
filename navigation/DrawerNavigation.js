import React from 'react';
import {View,Text} from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';

import WallCount from '../screens/WallCount';
import LampInfoScreen from '../screens/LampInfoScreen';

const DrawerNavigator = createDrawerNavigator({
  One: WallCount,
  Two: LampInfoScreen
});

export default DrawerNavigator;
