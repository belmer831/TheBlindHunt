import React, { Component } from 'react'
import {
	View,
	StyleSheet,
	Text,
	Image,
} from 'react-native'

import {
	GameItems,
	InventoryWatcher,
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

interface Props {}
interface State {
	items?: GameItems,
	error?: Error,
}

export default class InventoryLogs extends Component<Props, State> {
	private readonly inventoryWatcher: InventoryWatcher

	constructor (props: Props) {
		super (props)
		this.state = {}

		this.inventoryWatcher = new InventoryWatcher ({
			onSuccess: (items) => this.setState ({ items }),
			onError:   (error) => this.setState ({ error })
		})
	}

	componentDidMount () {
		this.inventoryWatcher.start()
	}

	componentWillUnmount () {
		this.inventoryWatcher.end()
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