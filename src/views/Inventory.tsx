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
	setupInventory,
	watchInventory,
} from '../utils/Firebase'
import ItemCounts from '../components/ItemCounts'
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
	items?: GameItems,
	error?: Error,
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
		const { 
			items,
			error,
		} = this.state

		if (error) throw error

		if (! items) return (
			<SimpleText text={'Missing Items'} />
		)

		const allItems = itemNames.map (name => {
			let count = items[name]
			if (! count) count = 0
			return { name, count }
		})

		return (
			<ItemCounts style={styles.container} items={items}/>
		)
	}
}