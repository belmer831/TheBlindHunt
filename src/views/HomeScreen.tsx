import React, { Component } from 'react'
import {
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
	Platform,
} from 'react-native'

import { NavigationScreenProps } from 'react-navigation'

import { getCurrentLocation } from '../utils/Location'
import { LocationPermission, CameraPermission } from '../utils/Permissions'

import ClearButton from '../components/ClearButton'
import SimpleText from '../components/SimpleText'

import { delta } from '../utils/Maps'

const styles = StyleSheet.create ({
	container: {
		flex: 1,
		backgroundColor: 'black',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		flex: 1,
		color: 'white',
		fontSize: 40,
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	start: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
})

type Props = NavigationScreenProps

interface State {
	error: Error | null,
}

class HomeScreen extends Component<Props, State> {
	constructor (props:Props) {
		super (props)
		this.state = {
			error: null,
		}
	}

	/*
	async toFinder () {
		try {
			if (! LocationPermission.isGranted()) await LocationPermission.request()
			if (! LocationPermission.isGranted()) throw new Error ("Location Permission Required")

			const { coords } = await getCurrentLocation ()
			const target = {
				latitude: coords.latitude + .000001,
				longitude: coords.longitude + .000001
			}

			this.props.navigation.navigate ('Finder', { coords, target })
		}
		catch (error) { this.setState ({ error })}
	}
	*/

	async toPlacer () {
		try {
			if (! LocationPermission.isGranted()) await LocationPermission.request()
			if (! LocationPermission.isGranted()) throw new Error ("Location Permission Required")

			const { coords } = await getCurrentLocation ()
			this.props.navigation.navigate ('Placer', { coords })
		}
		catch (error) { this.setState ({ error })}
	}

	render() {
		const { error } = this.state

		/*
		if (error) return (
			<SimpleText text={error.message}/>
		)
		*/
		if (error) throw error

		else return (
			<View style={styles.container}>
				<Text style={styles.title}>
					The Blind Hunt
				</Text>
				<View style={styles.start}>
					<ClearButton
						text={"Start"}
						onPress={() => this.toPlacer()} />
				</View>
			</View>
		)
	}
}

export default HomeScreen