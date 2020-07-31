import React, { Component, Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Text, AsyncStorage, Image, NativeModules } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { Button, CheckBox } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import { withFirebaseHOC } from '../config/Firebase'
import auth from '@react-native-firebase/auth';
import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
  AppleAuthCredentialState
} from '@invertase/react-native-apple-authentication';
//import messaging from '@react-native-firebase/messaging';
import * as AppleAuthentication from 'expo-apple-authentication';
import { SocialIcon } from 'react-native-elements'
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
//import 'firebase/auth';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { ImagePaths } from '../images/ImagePaths';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import {
  signInWithApple,
  onSignInWithApple
} from "../utils/appleSignInFunctions";
import Fire from "../Fire";
const firebase = require('firebase');
const {Torch} = NativeModules;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
  password: Yup.string()
    .label('Password')
    .required()
    .min(6, 'Password should be at least 6 characters '),
  check: Yup.boolean().oneOf([true], 'Please check the agreement')
})

class Signup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOn: false,
    };
    //this.turnOn();
  }
  turnOn = () => {
    Torch.turnOn();
    this.updateTorchStatus();
  };
  turnOff = () => {
    Torch.turnOff();
    this.updateTorchStatus();
  };
  updateTorchStatus = () => {
    Torch.getTorchStatus((error, isOn) => {
      this.setState({isOn: isOn});
    });
    console.log("Torch status is " + this.state.isOn);
  };

  state = {
    passwordVisibility: true,
    confirmPasswordVisibility: true,
    passwordIcon: 'ios-eye',
    confirmPasswordIcon: 'ios-eye'
  }

  componentDidMount() {
    //console.log("Torch is " + JSON.stringify(Torch));
  }

  _syncUserWithStateAsync = async () => {
    const user = await GoogleSignIn.signInSilentlyAsync();
    this.setState({ user });
  };

  signOutAsync = async () => {
    await GoogleSignIn.signOutAsync();
    this.setState({ user: null });
  };

  signInAsync = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === 'success') {
        this._syncUserWithStateAsync();
      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  };

  onPress = () => {
    if (this.state.user) {
      this.signOutAsync();
    } else {
      this.signInAsync();
    }
  };

  goToLogin = () => this.props.navigation.navigate('Login');
  goToPhoneSignIn = () => this.props.navigation.navigate('PhoneSignIn');

  handlePasswordVisibility = () => {
    this.setState(prevState => ({
      passwordIcon:
        prevState.passwordIcon === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
      passwordVisibility: !prevState.passwordVisibility
    }))
  }

  handleConfirmPasswordVisibility = () => {
    this.setState(prevState => ({
      confirmPasswordIcon:
        prevState.confirmPasswordIcon === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
      confirmPasswordVisibility: !prevState.confirmPasswordVisibility
    }))
  }

  handleOnSignup = async (values, actions) => {
    const { email, password } = values

    try {
      const response = await this.props.firebase.signupWithEmail(
        email,
        password
      )

      if (response.user.uid) {
        const { uid } = response.user
        const userData = { email, uid }
        await this.props.firebase.createNewUser(userData)
        this.props.navigation.navigate('App')
      }
    } catch (error) {
      // console.error(error)
      actions.setFieldError('general', error.message)
    } finally {
      actions.setSubmitting(false)
    }
  }

  onGoogleButtonPress = async () => {
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    console.log("Google sign in token is " + JSON.stringify(googleCredential));
    return auth().signInWithCredential(googleCredential);
  }

  googleSignInFunc = async () => {
    GoogleSignin.configure();
    GoogleSignin.signIn().then(data => {
      console.log("Data is " + JSON.stringify(data));
      let token = firebase.auth.GoogleAuthProvider.credential(data.idToken);
      firebase.auth().signInWithCredential(token)
        .then((user) => {
          console.log(user)
        }).catch((err) => {
          console.error('User signin error', err);
        });
    });
  };

  onAppleButtonPress = async () => {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw 'Apple Sign-In failed - no identify token returned';
    }

    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

    // Sign in the user anonympusly b/c Apple Auth + Firebase DOES NOT WORK
    firebase.auth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error);
    });    
    // Disable the sign out button to prevent Apple Sign In users from losing data
    //this.setState({signOutButtonDisabled: true});
  }

  altOnAppleButtonPress = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
    });
    console.log(appleAuthRequestResponse);
    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

    // use credentialState response to ensure the user is authenticated
    if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
      console.log("Credential state is completed")
    }
    console.log("Completed altOnAppleSignInPress.")
  }

  webBasedAppleButtonPress = async () => {
    var provider = new firebase.auth.OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        // The signed-in user info.
        var user = result.user;
        // You can also get the Apple OAuth Access and ID Tokens.
        var accessToken = result.credential.accessToken;
        var idToken = result.credential.idToken;

        // ...
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        // ...
      });
  }
  
  navigateToHome= () => {
    console.log("Called me");
    this.props.navigation.navigate("Home");
  }

  onAppleButtonPressThree = async () => {
    // 1). start a apple sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
    });

    // 2). if the request was successful, extract the token and nonce
    const { identityToken, nonce } = appleAuthRequestResponse;

    // can be null in some scenarios
    if (identityToken) {
      // 3). create a Firebase `AppleAuthProvider` credential
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

      // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
      //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
      //     to link the account to an existing user
      auth().signInWithCredential(appleCredential).then(authResult => {
        console.log(authResult);
        auth().onAuthStateChanged(function(user) {
          if (user) {
            console.log("User is established below:");
            console.log(user);
            console.log("currentUser is established below:");
            console.log(auth().currentUser);
            //this.props.navigation.navigate("Home");
            //navigateToHome();
          } else {
            console.log("No user");
          }
        });
      })
      /*
      // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
      console.warn(`Firebase authenticated via Apple, UID: ${userCredential.user.uid}`);
      // SCP stuff below
      console.log(userCredential);
      auth().currentUser.reload()
      */
    } else {
      // handle this - retry?
    }
  }

  facebookSignInFunc = () => {
    console.log("Starting facebookSignInFunc");
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
      var token = result.credential.accessToken;
      var user = result.user;
      console.log(user);
    }).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      console.log(error);
    });
  };

  requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    } else {
      console.log("Permissions have not been enabled.");
    }
  }

  render() {
    var LampVueLogo = require('../images/final-lampvue-logo.png');
    const {
      passwordVisibility,
      confirmPasswordVisibility,
      passwordIcon,
      confirmPasswordIcon
    } = this.state
    return (
      <KeyboardAwareScrollView >
        <Text></Text>
        <View style={styles.view}>
          <Text />
        </View>
        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
            check: false
          }}
          onSubmit={(values, actions) => {
            this.handleOnSignup(values, actions)
          }}
          validationSchema={validationSchema}>
          {({
            handleChange,
            values,
            handleSubmit,
            errors,
            isValid,
            touched,
            handleBlur,
            isSubmitting,
            setFieldValue
          }) => (
              <Fragment>
                <FormInput
                  name='email'
                  value={values.email}
                  onChangeText={handleChange('email')}
                  placeholder='Enter email'
                  autoCapitalize='none'
                  iconName='ios-mail'
                  iconColor='#2C384A'
                  onBlur={handleBlur('email')}
                />
                <ErrorMessage errorValue={touched.email && errors.email} />
                <FormInput
                  name='password'
                  value={values.password}
                  onChangeText={handleChange('password')}
                  placeholder='Enter password'
                  iconName='ios-lock'
                  iconColor='#2C384A'
                  onBlur={handleBlur('password')}
                  secureTextEntry={passwordVisibility}
                  rightIcon={
                    <TouchableOpacity onPress={this.handlePasswordVisibility}>
                      <Ionicons name={passwordIcon} size={28} color='grey' />
                    </TouchableOpacity>
                  }
                />
                <ErrorMessage errorValue={touched.password && errors.password} />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  checkedIcon='check-box'
                  iconType='material'
                  uncheckedIcon='check-box-outline-blank'
                  title="I agree to LampVue's terms and conditions"
                  checkedTitle='You agreed to our terms and conditions'
                  checked={values.check}
                  onPress={() => setFieldValue('check', !values.check)}
                />
                <View style={styles.buttonContainer}>
                  <FormButton
                    buttonType='outline'
                    onPress={handleSubmit}
                    title='SIGNUP'
                    buttonColor='#FFFFFF'
                    disabled={!isValid || isSubmitting}
                    loading={isSubmitting}
                  />
                </View>
                <ErrorMessage errorValue={errors.general} />
              </Fragment>
            )}
        </Formik>
        <Text>
        </Text>
        <View style={styles.view}>
          <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this.googleSignInFunc}
            disabled={this.state.isSigninInProgress}
          />
          <LoginButton
            style={{ width: 192, height: 48 }}
            onLoginFinished={
              (error, result) => {
                if (error) {
                  console.log("login has error: " + result.error);
                } else if (result.isCancelled) {
                  console.log("login is cancelled.");
                } else {
                  AccessToken.getCurrentAccessToken().then(
                    (data) => {
                      console.log("data is " + JSON.stringify(data));
                      let token = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                      console.log("Facebook token is " + token);
                      firebase.auth().signInWithCredential(token)
                        .then((user) => {
                          console.log(user)
                        }).catch((err) => {
                          console.error('User signin error', err);
                        });
                    }
                  )
                }
              }
            }
            onLogoutFinished={() => console.log("logout.")} />
          <AppleButton
            buttonStyle={AppleButton.Style.WHITE}
            buttonType={AppleButton.Type.SIGN_IN}
            style={{
              width: 192,
              height: 48,
            }}
            onPress={this.onAppleButtonPress}
          />
        </View>
        <Button
          title='Already have an account? Login here.'
          onPress={this.goToLogin}
          titleStyle={{
            color: 'grey'
          }}
          type='clear'
        />
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 50,
  },
  logoContainer: {
    marginBottom: 15,
    alignItems: 'center'
  },
  buttonContainer: {
    margin: 25
  },
  checkBoxContainer: {
    backgroundColor: '#f2f1f2',
    borderColor: '#f2f1f2'
  }
})

export default withFirebaseHOC(Signup);

/*
<AppleButton
  buttonStyle={AppleButton.Style.WHITE}
  buttonType={AppleButton.Type.SIGN_IN}
  style={{
    width: 192,
    height: 48,
  }}
  onPress={this.altOnAppleButtonPress}
/>
*/