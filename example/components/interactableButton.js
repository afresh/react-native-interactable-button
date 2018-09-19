import React, { Component } from 'react';
import {
    Animated,
    PanResponder,
    Dimensions,
    LayoutAnimation,
    UIManager,
    TouchableOpacity,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_OUT_DURATION = 150;

let that;

class InteractableButton extends Component {
    static defaultProps = {
        onSwipeRight: () => {},
        onSwipeLeft: () => {}
    };

    constructor(props) {
        super(props);

        that = this;
        let currentIndex = 0;

        if (Array.isArray(this.props.children)) {
            console.error("InteractableButton can has no or only one child element.");
            return;
        }

        // Array of snapPoints
        let snapPoints = props.snapPoints;
        if (!Array.isArray(snapPoints) || snapPoints.length === 0) {
            snapPoints = [
                {x: 10, y: 60},
                {x: 10, y: (SCREEN_HEIGHT - 164)/4},
                {x: 10, y: (SCREEN_HEIGHT - 164)/2},
                {x: 10, y: (SCREEN_HEIGHT - 164)/4*3},
                {x: 10, y: (SCREEN_HEIGHT - 164)},
                {x: (SCREEN_WIDTH - 64), y: 60},
                {x: (SCREEN_WIDTH - 64), y: (SCREEN_HEIGHT - 164)/4},
                {x: (SCREEN_WIDTH - 64), y: (SCREEN_HEIGHT - 164)/2},
                {x: (SCREEN_WIDTH - 64), y: (SCREEN_HEIGHT - 164)/4*3},
                {x: (SCREEN_WIDTH - 64), y: (SCREEN_HEIGHT - 164)},
            ]
        }

        this.initialPosition = snapPoints[0];
        if (props.initialPosition) {
            snapPoints.forEach((snapPoint, snapPointIndex) => {
                if(snapPoint.x === props.initialPosition.x && snapPoint.y === props.initialPosition.y) {
                    this.initialPosition = props.initialPosition;
                    currentIndex = snapPointIndex;
                }
            })
        }

        // Initial snapPoint 0
        const position = new Animated.ValueXY(this.initialPosition);

        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => {
                this._touchable.setOpacityTo(0.5, 100);
                return true;
            },
            // At each drag start
            onPanResponderGrant: (evt, gesture) => {
                // Add offset of last position
                position.setOffset(position.__getValue());
                // Resets to x:0 and y:0
                position.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: (event, gesture) => {
                if (gesture.dx > 3 || gesture.dy > 3 || gesture.dy < -3 || gesture.dx < -3) {
                    position.setValue({ x: gesture.dx, y: gesture.dy });
                    this._touchable.setOpacityTo(1, 100);
                }
            },
            onPanResponderRelease: (event, gesture) => {
                // InteractableButton was not moved but clicked
                // Fires the onPress
                if (gesture.dx < 3 && gesture.dx > -3 && gesture.dy < 3 && gesture.dy > -3) {
                    this._touchable.setOpacityTo(1, 100);
                    this._touchable.touchableHandlePress();
                } else {
                    // Get the absolute X and Y by adding the drag offset to the current snapPoint
                    const newX = snapPoints[this.state.currentIndex].x + gesture.dx;
                    const newY = snapPoints[this.state.currentIndex].y + gesture.dy;

                    let diff = 10000;
                    // Index of the nearest snapPoint
                    let newPosIndex = 0;
                    let i = 0;
                    snapPoints.forEach((position) => {
                        // Calculate the relative number of pixels distance
                        const distanceX = Math.abs(position.x - newX);
                        const distanceY = Math.abs(position.y - newY);
                        // Final distance (Sum of distance X and distance Y)
                        const distance = distanceX + distanceY;
                        if (distance < diff) {
                            diff = distance;
                            newPosIndex = i;
                        }
                        i++;
                    });
                    // Animate the interactableButton to the nearest snapPoint
                    this.forceSwipe(newPosIndex);
                }
            }
        });

        this.state = {
            panResponder,
            position,
            snapPoints,
            currentIndex: currentIndex,
        };
    }

    componentDidMount() {
        setTimeout(function() {
            Animated.spring(that.state.position, {
                toValue: that.props.initialPosition,
                duration: SWIPE_OUT_DURATION,
            }).start();
        }, 100);
    }

    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }

    forceSwipe(newPosIndex) {
        const x = this.state.snapPoints[newPosIndex].x;
        const y = this.state.snapPoints[newPosIndex].y;

        const newX = x - this.state.snapPoints[this.state.currentIndex].x;
        const newY = y - this.state.snapPoints[this.state.currentIndex].y;

        Animated.spring(this.state.position, {
            toValue: { x: newX, y: newY },
            duration: SWIPE_OUT_DURATION,
        }).start(() => this.onSwipeComplete(newPosIndex));
    }

    onSwipeComplete(newPosIndex) {
        const swipeParams = {
            from: this.state.currentIndex,
            to: newPosIndex
        };

        if (newPosIndex !== this.state.currentIndex) {
            // Fires to swipe() function in parent component
            if (this.props.swipe) {
                this.props.swipe(swipeParams);
            }

            // Change current index
            that.setState({
                currentIndex: newPosIndex
            });
        }
    }

    // Function to programmatically swipe the interactableButton (like snapTo)
    exchange(newPosIndex) {
        this.state.position.extractOffset();

        const x = this.state.snapPoints[newPosIndex].x;
        const y = this.state.snapPoints[newPosIndex].y;

        const newX = x - this.state.snapPoints[this.state.currentIndex].x;
        const newY = y - this.state.snapPoints[this.state.currentIndex].y;

        Animated.spring(this.state.position, {
            toValue: { x: newX, y: newY },
            duration: SWIPE_OUT_DURATION,
        }).start(() => this.setState({ currentIndex: newPosIndex }));
    }

    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: this.initialPosition,
        }).start();
    }

    // Defines the position of the interactableButton
    getInteractableButtonStyle() {
        const { position } = this.state;
        return {
            ...position.getLayout(),
        };
    }

    _renderTouchableOpacity() {
        if (this.props.children) {
            return (
                <TouchableOpacity
                    style={[styles.childTouch]}
                    {...this.props.children.props}
                    ref={(touchable) => this._touchable = touchable}
                >
                    {this.props.children.props.children}
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity ref={(touchable) => this._touchable = touchable} />
            )
        }
    }

    render() {
        const propsStyles = this.props.style ? this.props.style : {};

        return (
            <Animated.View
                style={[styles.interactableButton, ...propsStyles, {position: 'absolute'}, this.getInteractableButtonStyle()]}
                {...this.state.panResponder.panHandlers}
            >
                {this._renderTouchableOpacity()}
            </Animated.View>
        );
    }
}

const styles = {
    interactableButton: {
        width: 44,
        height: 44,
    },
    childTouch: {
        width: 44,
        height: 44,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

export default InteractableButton;
