import React, { Component } from 'react'
import {
	View,
	Text,
	TouchableHighlight,
} from 'react-native'

import Draggable from '../components/Draggable'

interface CircleProps {
	size:  number,
	color: string,
	text: string,
	textColor: string,
}

const Circle = (props: CircleProps) => (
	<View style={{
		position: 'relative',
		top: 0,
		left: 0,
		backgroundColor: props.color,
		width:           props.size,
		height:          props.size,
		borderRadius:    props.size / 2,
		alignItems:      'center',
		justifyContent:  'center',
	}}>
		<Text style={{
			textAlignVertical: 'center',
			textAlign:         'center',
			fontSize: props.size / 2,
			color:    props.textColor,
		}}>
			{ props.text }
		</Text>
	</View>
)

interface DraggableCircle {
	reverse: boolean,
	size: number,
	offsetX: number,
	offsetY: number,
	color: string,
	text: string,
	textColor: string,
}

interface Props {}
interface State {
	x: number,
	y: number,
}

export default class DragDemo extends Component<Props, State> {
	constructor (props: Props) {
		super (props)
		this.state = { x: -100, y: -200 }
	}

	render () {

		return (
			<View style={{ flex: 1 }}>
				<Draggable 
					width={56}
					height={56}
					offsetX={this.state.x}
					offsetY={this.state.y}
					onRelease={({ x, y }) => 
						// this.setState ({ x, y })
						this.forceUpdate()
					}
				>
					<Circle 
						size={56} 
						color='black'
						text='A'
						textColor='white'
					/>
				</Draggable>
			</View>
		)
	}
}