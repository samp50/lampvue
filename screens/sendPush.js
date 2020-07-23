import firebase from "firebase";
import React, { Component } from "react";
import { LayoutAnimation, RefreshControl, Text, Viewlott, View, StyleSheet, ScrollView, Button, Vibration } from "react-native";
import List from "../components/List";
import Fire from "../Fire";
import LottieView from "lottie-react-native";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

const message = {
    to: this.state.expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { data: 'goes here' },
    _displayInForeground: true,
};
const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
    Accept: 'application/json',
    'Accept-encoding': 'gzip, deflate',
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
});