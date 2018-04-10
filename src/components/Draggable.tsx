import React, { 
	ReactChildren, 
	Component 
} from 'react'
import {
	Text,
	View,
	ViewStyle,
	Image,
	Animated,
	StyleSheet,
	Dimensions,
	TouchableHighlight,
	PanResponder,
	PanResponderInstance,
	PanResponderGestureState,
	GestureResponderEvent,
	GestureResponderHandlers,
} from 'react-native'

const WINDOW_WIDTH  = Dimensions.get ('window').width
const WINDOW_HEIGHT = Dimensions.get ('window').height

const styles = StyleSheet.create ({
	container: {
		position: 'absolute',
		top: WINDOW_HEIGHT / 2,
		left: WINDOW_WIDTH / 2,
		width:  WINDOW_WIDTH,
		height: WINDOW_HEIGHT,
	},
})

interface Callback<T> { (param: T): void }
interface Point {
	x: number,
	y: number,
}

interface Props {
	width:   number,
	height:  number,
	offsetX: number,
	offsetY: number,

	// onMove?:    Callback<Point>,
	onPress?:   Callback<Point>,
	onRelease?: Callback<Point>,
	children?:  any,
}

interface State {
	pan: Animated.ValueXY,
	x: number,
	y: number,
}

export default class Draggable extends Component<Props, State> {
	
	private readonly panResponder: PanResponderInstance
	private listener: string

	constructor (props: Props) {
		super (props)

		const x = this.props.offsetX
		const y = this.props.offsetY

		this.state = {
			pan: new Animated.ValueXY ({ x, y }),
			x,
			y,
		}

		this.panResponder = PanResponder.create ({
			onStartShouldSetPanResponder: (e, g) => true,
			onStartShouldSetPanResponderCapture: (e, g) => true,
			onMoveShouldSetPanResponder: (e, g) => true,
			onMoveShouldSetPanResponderCapture: (e, g) => true,
			onPanResponderGrant: (e, g) => {
				this.state.pan.setOffset ({
					x: this.props.offsetX,
					y: this.props.offsetY,
				})
			},
			onPanResponderStart: (e, g) => {

			},
			onPanResponderMove: Animated.event ([ null, {
				dx: this.state.pan.x,
				dy: this.state.pan.y,
			}]),
			onPanResponderRelease: (e, g) => {
				this.onRelease (e, g)
			}
		})
	}

	componentWillMount () {
		this.listener = this.state.pan.addListener (({ x, y }) => this.setState ({ x, y }))
	}

	componentWillUnmount () {
		this.state.pan.removeListener (this.listener)
	}

	componentWillReceiveProps (nextProps: Props) {

		console.log (`Pan: ${JSON.stringify ({
			x: this.state.pan.x,
			y: this.state.pan.y
		})}`)

		console.log (`Next: ${JSON.stringify ({
			x: nextProps.offsetX,
			y: nextProps.offsetY,
		})}`)

		Animated.spring (
			this.state.pan,
			{ toValue: { 
				x: nextProps.offsetX, 
				y: nextProps.offsetY, 
			}}
		).start()
	}

	/* TODO: 
		- shouldComponentUpdate (nextProps, nextState) {} 
		- componentWillReceiveProps (nextProps) {}
		- componentDidUpdate (prevProps, prevState)
	*/

	/*
	onMove (event: GestureResponderEvent, gesture: PanResponderGestureState) {
		if (this.props.onMove) {
			this.props.onMove (this.state.position)
		}
	}
	*/

	onPress (event: GestureResponderEvent) {
		const { x, y } = this.state

		if (this.props.onPress) {
			this.props.onPress ({ x, y })
		}
	}

	onRelease (event: GestureResponderEvent, gesture: PanResponderGestureState) {
		const { x, y } = this.state
		if (this.props.onRelease) {
			this.props.onRelease ({ x, y })
		}
		// this.state.pan.flattenOffset()
	}

	render () {
		
		return (
			<View style={{
				position: 'absolute',
				width:  WINDOW_WIDTH,
				height: WINDOW_HEIGHT,
				top:  WINDOW_HEIGHT / 2 - this.props.height,
				left: WINDOW_WIDTH  / 2 - this.props.width,  
			}}>
				<Animated.View
					{... this.panResponder.panHandlers}
					style={this.state.pan.getLayout()}
				>
					<TouchableHighlight
						style={{
							width:  this.props.width,
							height: this.props.height,
						}}
						// onPress={e => this.onPress (e)}
					>
						{ this.props.children }
					</ TouchableHighlight>
				</ Animated.View>
			</View>
		)
	}
}