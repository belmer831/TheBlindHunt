import React, { PureComponent } from 'react'
import {
	View,
} from 'react-native'
import SimpleText from './SimpleText'
import { GameItems } from '../utils/Firebase'

const itemNames = [
	'Coins',
	'Crown',
	'Diamond',
	'Necklace',
	'Ring',
	'Amulet',
]

interface Props {
	style: any, // ViewStyle
	items: GameItems,
}

export default class ItemCounts extends PureComponent<Props> {
	render () {
		let count = 0
		return (
			<View style={this.props.style}>
				{ itemNames.map (name => {
					let amount = this.props.items[name]
					if (! amount) amount = 0
					return (
						<SimpleText 
							key={`line_${++count}`}
							text={`${name}: ${amount}`} 
						/>
					)
				})}
			</View>
		)
	}
}