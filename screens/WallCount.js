import React, { Component } from 'react';   
import { Button, Header, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, TextInput, Picker } from 'react-native';

export default class MasterScroll extends React.Component {
    state = {
        value: '1',  
    }
    _onPressButton() {
        this.props.navigation.navigate("SelectPhotoScreen", {
            numberOfWalls: "LivingRoom",
        })
    }
    render() {
        return(
            <View style={{flex: 1}} forceInset={{ top: 'always' }}>
                <Text h4>Please enter the number of walls in your {this.props.navigation.state.params.selectedScreen}:</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    keyboardType="phone-pad"
                />
                <Button
                    title="Go"
                    onPress={() =>
                        this.props.navigation.navigate("SelectPhotoScreen", {
                            selectedScreen: "LivingRoom",
                        })
                    }
                />
            </View>
        );
    }
}