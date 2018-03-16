import React, { Component } from 'react'
import {
	Dimensions,
	StyleSheet,
	TouchableOpacity,
	Text,
	Animated,
	Easing,
	Image,
	Alert,
	View,
} from 'react-native'

import { Spinner } from '../config/Assets'

const WINDOW_WIDTH  = Dimensions.get ('window').width
const WINDOW_HEIHGT = Dimensions.get ('window').height
const MARGIN = 40
const FILL_COLOR = '#F035E0'
const IMAGE_SIZE = 24

const styles = StyleSheet.create ({
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: FILL_COLOR,
		height: MARGIN,
		borderRadius: 20,
		zIndex: 100,
	},
	circle: {
		height: MARGIN,
		width: MARGIN,
		marginTop: -MARGIN,
		borderWidth: 1,
		borderColor: FILL_COLOR,
		borderRadius: 100,
		alignSelf: 'center',
		zIndex: 99,
		backgroundColor: FILL_COLOR,
	},
	text: {
		color: 'white',
		backgroundColor: 'transparent',
	},
	image: {
		width: IMAGE_SIZE,
		height: IMAGE_SIZE,
	}
})

interface Props {
	onPress: Function,
}
interface State {
	loading: boolean,
}

export default class LoaderButton extends Component<Props, State> {
	
	animations: {
		button: Animated.Value,
		grow:   Animated.Value,
	}
	
	constructor (props: Props) {
		super (props)

		this.state = {
			loading: false,
		}

		this.animations = {
			button: new Animated.Value(0),
			grow:   new Animated.Value(0),
		}
	}

	onPress () {
		if (this.state.loading) return

		this.setState ({ loading: true })

		Animated.timing (this.animations.button, {
			toValue: 1,
			duration: 200,
			easing: Easing.linear,
		}).start()

		// NOTE: Why does this have a timeout?
		setTimeout (() => this.onGrow(), 2000)

		setTimeout (() => {
			this.props.onPress()
			this.setState ({ loading: false })
			this.animations.button.setValue(0)
			this.animations.grow.setValue(0)
		}, 2300)
	}

	onGrow () {
		Animated.timing (this.animations.grow, {
			toValue: 1,
			duration: 200,
			easing: Easing.linear,
		}).start()
	}

	render () {
		const { loading } = this.state

		const changeWidth = this.animations.button.interpolate ({
			inputRange: [0, 1],
			outputRange: [ WINDOW_WIDTH - MARGIN, MARGIN ]
		})

		const changeScale = this.animations.grow.interpolate ({
			inputRange: [0, 1],
			outputRange: [1, MARGIN]
		})

		return (
			<Animated.View style={{ width: changeWidth }}>
				<TouchableOpacity 
					style={styles.button}
					onPress={() => this.onPress}
					activeOpacity={1}
					>
					{ this.state.loading ?
						<Image source={Spinner} style={styles.image}/>
						:
						<Text style={styles.text}> Submit </Text>
					}
				</TouchableOpacity>
			</Animated.View>
		)
	}
}