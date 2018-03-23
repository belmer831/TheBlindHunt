import React, { Component } from 'react'
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

export default class ItemCounts extends Component<Props> {
	render () {
		return (
			<View style={this.props.style}>
				{ itemNames.map (name => {
					let count = this.props.items[name]
					if (! count) count = 0
					return (
						<SimpleText text={`${name}: ${count}`} />
					)
				})}
			</View>
		)
	}
}