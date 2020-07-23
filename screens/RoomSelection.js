import React, { Component } from 'react';   
import { Button, Header, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View } from 'react-native';

export default class MasterScroll extends React.Component {
    render() {
        return(
            <View style={{flex: 1}} forceInset={{ top: 'always' }}>
                <Text h4>Please choose which room you'll be taking a photo of:</Text>
                <Button title='Living Room' onPress={() =>
                    this.props.navigation.navigate("WallCount", {
                        selectedScreen: "LivingRoom",
                    })
                } />
            </View>
        );
    }
}