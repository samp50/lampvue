import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';

//Sign user in using Apple
export function signInWithApple({identityToken, nonce}) {
    return (dispatch) => {
        dispatch({type: LOADING});
        return new Promise((resolve, reject) => {
            const provider = new firebase.auth.OAuthProvider('apple.com')
            const credential = provider.credential(identityToken,nonce)

            firebase.auth().signInWithCredential({authorizationCode,identityToken})
            firebase.auth().signInWithCredential(credential)
                .then(async (appleuser) => {
    //logged into firebase
                    }
            )
            .catch((error) => {
                console.log('signInWithCredential error :' +error)
                dispatch({type: LOAD_FAILED});
                reject(error)});
        });
    }
}

getRandomString = async (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

export const onSignInWithApple = async () => {
    const nonce = this.getRandomString(32);
    let nonceSHA256 = '';

    try {
        nonceSHA256 = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            nonce
          );
      } catch (e) {
        alert(e)
        console.log('UserStore::appleSignin - unable to get nonceSHA256', e);
      }

    try {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ], nonce: nonceSHA256,
        });
        // signed in
        if(credential.user){
            this.props.signInWithApple({identityToken:credential.identityToken,nonce:nonce})
            .then(async({exists, user}) => {
                console.log("logined")
            })
            .catch((error) => alert(error))
        }
      } catch (e) {
            console.log("AppleAuthentication.signInAsync :" +e)
            //alert("AppleAuthentication.signInAsync :" +e)
        if (e.code === 'ERR_CANCELED') {
          // handle that the user canceled the sign-in flow
        } else {
          // handle other errors
        }
      }
}