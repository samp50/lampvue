import { createStackNavigator } from 'react-navigation-stack'
import Login from '../screens/Login'
import Signup from '../screens/Signup'
import ForgotPassword from '../screens/ForgotPassword'
import PhoneSignIn from '../screens/PhoneSignIn'

const AuthNavigation = createStackNavigator(
  {
    Login: { screen: Login },
    Signup: { screen: Signup },
    ForgotPassword: { screen: ForgotPassword },
    PhoneSignIn: { screen: PhoneSignIn }
  },
  {
    initialRouteName: 'Signup',
    headerMode: 'none'
  }
)

export default AuthNavigation;