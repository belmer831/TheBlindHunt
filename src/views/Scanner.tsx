import React, { Component } from 'react'
import {
	View,
	StyleSheet,
} from 'react-native'

import {
	ChestContent,
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
	content?: ChestContent,
	error?: Error,
}

/* TODO:
	- Currently gives a warning for using setState when unmounted or something.
*/
export default class Scanner extends Component<Props, State> {
	private readonly contentWatcher: ChestContentWatcher

	constructor (props: Props) {
		super (props)
		this.contentWatcher = new ChestContentWatcher ({
			onSuccess: (content) => this.setState ({ content }),
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
			content,
			error,
		} = this.state

		if (error) throw error

		if (! content) return (
			<SimpleText text={'Chest Unopened'} />
		)

		const message = `Chest ${(content) ? 'Opened' : 'Unopened'}`

		return (
			<View style={styles.container}>
				<SimpleText text={message} />
				<ItemCounts 
					style={{ flex: 6 }} 
					items={content.items} 
				/>
			</View>
		)
	}
}