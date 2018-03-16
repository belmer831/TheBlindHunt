import React, { Component } from 'react'
import {
	View,
	StyleSheet,
	Text,
	Image,
	ListView,
} from 'react-native'

import {
	GameItems,
	watchInventory,
} from '../utils/Firebase'
import SimpleText from '../components/SimpleText';

const itemNames = [
	'Coins',
	'Crown',
	'Diamond',
	'Necklace',
	'Ring',
	'Amulet',
]

const styles = StyleSheet.create ({
	container: {
		flex: 1,
	},
})

interface Props {

}
interface State {
	items?: GameItems
}

export default class Inventory extends Component<Props, State> {

	constructor (props: Props) {
		super (props)
		this.state = {}
	}

	componentDidMount () {
		watchInventory (items => this.setState ({ items }))
	}

	render () {
		const { items } = this.state

		if (! items) return (
			<SimpleText text={'Missing Items'} />
		)

		const allItems = itemNames.map (name => {
			let count = items[name]
			if (! count) count = 0
			return { name, count }
		})

		return (
			<View style={styles.container}>
				{ allItems.map (item => (
					<SimpleText text={`${item.name}: ${item.count}`} />
				))}
			</View>
		)
	}
}