import React, { Component } from 'react'
import {
	StyleSheet,
	View,
	Text,
	FlatList,
} from 'react-native'

import SimpleText from '../components/SimpleText'
import { LatLng } from 'react-native-maps'
import { LocationWatcher } from '../utils/Location'
import { 
	ChestData,
	ChestDataWatcher, 
} from '../utils/Firebase'

interface Props {}
interface State {
	chests?: ChestData[],
	coords?: LatLng,
	error?:  Error,
}

const styles = StyleSheet.create ({
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'black',
	},
	rowOuter: {
		position: 'relative',
		height: 200,
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	rowTab: {
		flex: 1,
		backgroundColor: 'whitesmoke',
	},
	rowInner: {
		flex: 11,
	},
	title: {},
	tab: {},
})

export default class DetectorLogs extends Component<Props, State> {
	private readonly chestDataWatcher: ChestDataWatcher
	private readonly locationWatcher: LocationWatcher

	render () {
		return (
			<SimpleText text='DetectorLogs' />
		)
	}
}