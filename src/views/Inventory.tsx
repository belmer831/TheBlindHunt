import React, { Component } from 'react'
import {
	View,
	StyleSheet,
} from 'react-native'

import SimpleText from '../components/SimpleText'
import {
	InventoryWatcher,
	GameItems,
} from '../utils/Firebase'

interface Props {}
interface State {
	items?: GameItems,
	error?: Error,
}

const styles = StyleSheet.create ({
	container: {
		flex: 1,
	},
})

export default class Inventory extends Component<Props, State> {
	private readonly inventoryWatcher: InventoryWatcher

	constructor (props: Props) {
		super (props)
		this.state = {}

		this.inventoryWatcher = new InventoryWatcher ({
			onSuccess: (items) => this.setState ({ items }),
			onError:   (error) => this.setState ({ error }),
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

		if (error) {
			setInterval (() => this.setState ({ 
				error: undefined 
			}), 2000)
			return <SimpleText text={error.message} />
		}

		if (! items) return (
			<SimpleText text='Missing Items' />
		)

		return (
			<View style={styles.container}>
				<SimpleText text='Inventory Tiles' />
			</View>
		)
	}
}