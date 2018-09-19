/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';

import InteractableButton from "./components/interactableButton";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
    render() {
        const xOff = (SCREEN_WIDTH - 72) / 2;
        const yOff = (SCREEN_HEIGHT - 72) / 5;

        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to React Native!
                </Text>
                <Text style={styles.instructions}>
                    To get started, edit App.js
                </Text>
                <Text style={styles.instructions}>
                    {instructions}
                </Text>
                <InteractableButton
                    initialPosition={{x: (SCREEN_WIDTH - 95), y: (SCREEN_HEIGHT - 195)}}
                    snapPoints={[
                        {x: 10, y: 60},
                        {x: 10, y: (SCREEN_HEIGHT - 195)/4},
                        {x: 10, y: (SCREEN_HEIGHT - 195)/2},
                        {x: 10, y: (SCREEN_HEIGHT - 195)/4*3},
                        {x: 10, y: (SCREEN_HEIGHT - 195)},
                        {x: (SCREEN_WIDTH - 95), y: 60},
                        {x: (SCREEN_WIDTH - 95), y: (SCREEN_HEIGHT - 195)/4},
                        {x: (SCREEN_WIDTH - 95), y: (SCREEN_HEIGHT - 195)/2},
                        {x: (SCREEN_WIDTH - 95), y: (SCREEN_HEIGHT - 195)/4*3},
                        {x: (SCREEN_WIDTH - 95), y: (SCREEN_HEIGHT - 195)},
                    ]}
                >
                    <View
                        style={[styles.childTouch]}
                        onPress={() => {alert("Child Touch!")}}
                    >
                        <Text style={[{color: '#FF0000'}]}>Touch me!</Text>
                    </View>
                </InteractableButton>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    childTouch: {
        width: 75,
        height: 75,
        borderColor: '#FF0000',
        borderWidth: 1,
        borderRadius: 150,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
});
