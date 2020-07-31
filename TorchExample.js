import React, {Component} from 'react';
import {StyleSheet, Text, View, NativeModules, Button} from 'react-native';
const {Torch} = NativeModules;
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOn: false,
    };
    this.updateTorchStatus();
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
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 24}}>
          Torch is {this.state.isOn ? 'ON' : 'OFF'}
        </Text>
        {!this.state.isOn ? (
          <Button onPress={this.turnOn} title="Switch ON " color="green" />
        ) : (
          <Button onPress={this.turnOff} title="Switch OFF " color="red" />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#d3d3d3',},
});