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
	}
})

interface Props {
	chestId: string,
}
interface State {
	content?: ChestContent,
	contentWatcher: ChestContentWatcher,
	error?: Error,
}

export default class Scanner extends Component<Props, State> {
	constructor (props: Props) {
		super (props)
		const contentWatcher = new ChestContentWatcher ({
			onSuccess: (content) => this.setState ({ content }),
			onError: (error) => this.setState ({ error })
		})
		this.state = { contentWatcher }
	}

	componentDidMount () {
		this.state.contentWatcher.start()
		openChest (this.props.chestId)
			.catch (error => this.setState ({ error }))
	}

	componentWillUnmount () {
		this.state.contentWatcher.end()
	}

	render () {
		const {
			content,
			error,
		} = this.state

		if (! content) return (
			<SimpleText text={'Chest Unopened'} />
		)

		if (error) throw error

		return (
			<View style={styles.container}>
				<SimpleText text={'Chest Opened!'} />
				<ItemCounts style={{ flex: 6 }} items={content.items} />
			</View>
		)
	}
}