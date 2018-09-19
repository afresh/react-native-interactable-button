# react-native-interactable-button
> Interactable button component in React Native.
> 基于 React Native 开发的可交互的按钮组件。

### Example
![demo](./demo.gif 'demo')


import InteractableButton and use it.

```
import InteractableButton from "./components/interactableButton";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

...

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
```

### References 参考文献
[@Deevent](https://github.com/Deevent) - [Bubble.js](https://gist.github.com/Deevent/6300fb3531e6e526a880a82b98c049a6)
