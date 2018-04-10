import React, { Component } from 'react'
import {
	View,
	StyleSheet,
} from 'react-native'

import {
	GameItems,
	ChestContentWatcher,
	openChest,
} from '../utils/Firebase'

import ItemCounts from '../components/ItemCounts'
import SimpleText from '../components/SimpleText'

const styles = StyleSheet.create ({
	container: {
		flex: 1,
		backgroundColor: 'black',
	}
})

interface Props {
	chestId: string,
}
interface State {
	items?: GameItems,
	error?: Error,
}

/* TODO:
	- Currently gives a warning for using setState when unmounted or something.
*/
export default class Scanner extends Component<Props, State> {
	private readonly contentWatcher: ChestContentWatcher

	constructor (props: Props) {
		super (props)
		this.state = {}
		this.contentWatcher = new ChestContentWatcher ({
			onSuccess: (items) => this.setState ({ items }),
			onError: (error) => this.setState ({ error })
		})
	}

	async onMount () {
		await openChest (this.props.chestId)
		await this.contentWatcher.start()
	}

	componentDidMount () {
		this.onMount ()
			.catch (error => this.setState ({ error }))
	}

	componentWillUnmount () {
		this.contentWatcher.end ()
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
		}

		if (! items) return (
			<SimpleText text={'Chest Unopened'} />
		)

		const message = `Chest ${(items) ? 'Opened' : 'Unopened'}`

		return (
			<View style={styles.container}>
				<SimpleText text={message} />
				<ItemCounts 
					style={{ flex: 6 }} 
					items={items} 
				/>
			</View>
		)
	}
}