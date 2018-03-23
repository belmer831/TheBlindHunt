import React, { Component } from 'react'
import {
	View,
	StyleSheet,
} from 'react-native'

import {
	ChestContents,
	watchChestContents,
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
	contents?: ChestContents
	error?: Error,
}

export default class Scanner extends Component<Props, State> {
	constructor (props: Props) {
		super (props)
		this.state = {}
	}

	componentDidMount () {
		watchChestContents (contents => this.setState ({ contents }))
		openChest (this.props.chestId)
			.catch (error => this.setState ({ error }))
	}

	render () {
		const {
			contents,
			error,
		} = this.state

		if (! contents) return (
			<SimpleText text={'Chest Unopened'} />
		)

		if (error) throw error

		return (
			<View style={styles.container}>
				<SimpleText text={'Chest Opened!'} />
				<ItemCounts style={{ flex: 6 }} items={contents.items} />
			</View>
		)
	}
}