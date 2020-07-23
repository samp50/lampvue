import React, { Component } from 'react';   
import { Button, Header, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Image, StyleSheet, ScrollView } from 'react-native';

export default class MasterScroll extends React.Component {
    render() {
        return(
            <View style={styles.view} forceInset={{ top: 'always' }}>
                <ScrollView contentContainerStyle={styles.view}>
                    <Image
                        source={require('../assets/exampleShot2.jpg')}
                        style={styles.image}
                    />
                    <Text>
                        <Text style={{fontSize: 21}}>
                            ◦ LampVue requires a clear image of your
                        <Text/>    
                        <Text style={styles.boldText}>
                            {" "}current{" "} 
                        </Text>
                            table lamp in order to work.{"\n"}
                            ◦ Photos look best when taken in the middle of the day.{"\n"}
                            ◦ Stand about six feet back from your lamp and center the lamp within the frame in order to get the best results.{"\n"}
                            ◦ For best results, take the photo of the lamp in front of a solid colored wall/background with a moderate amount of light in the room.{"\n"}
                            ◦ The camera should be at the same height as the lamp.{"\n"}
                            ◦ There is no limit to the number of photos you can take.{"\n"}
                            ◦ After about three minutes, you will receive an email indicating that your images are ready to view in the app!{"\n"}
                        </Text>
                    </Text>
                    <Button title="Continue" buttonStyle={{backgroundColor: '#1BAD4B'}} onPress={() => 
                        this.props.navigation.navigate("SelectPhotoScreen", {
                            selectedScreen: "Let's go",
                        })
                    } />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',

    },
    view: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    boldText: {
        fontWeight: 'bold',
        fontStyle: 'italic'
    }
})