import React, { Component } from 'react'

import {
	StyleSheet,
	Text,
	View,
} from 'react-native'

import { 
	Location, 
	Permissions, 
} from 'expo'

import MapView from 'react-native-maps'

import { Region } from '../utils/MapTypes'

const styles = StyleSheet.create ({
	container: {
		flex: 1,
		backgroundColor: 'black',
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		flex: 1,
		color: 'white',
		fontSize: 40,
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	map: {
		flex: 1,
	}
})

interface Props {
	navigation: any,
}
interface State {
	initialRegion: Region|null, 
	region: Region|null,
	error: Error|null,
}

class PlacerScreen extends Component<Props, State> {
	state:State = {
		initialRegion: null,
		region: null,
		error: null,
	}

	componentWillMount () {
		if (! this.state.initialRegion) this.getLocationAsync()
	}
	
	async getLocationAsync () {
		let { status } = await Permissions.askAsync ('location')
		if (status !== 'granted') {
			this.setState ({
				error: new Error ('Permission to access location was denied')
			})
		}

		let location = await Location.getCurrentPositionAsync({})
		if (location) this.setState ({
			initialRegion: {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0,
				longitudeDelta: 0,
			}
		})
	}

	updateRegion (region:Region) {
		this.setState ({ region })
	}

	render () {
		if (this.state.error) return (
			<View style={styles.container}> 
				<Text style={styles.text}> 
					{ this.state.error.message } 
				</Text>
			</View>
		)
		else if (this.state.initialRegion) return (
			<MapView 
				style={styles.map} 
				initialRegion={this.state.initialRegion}
				onRegionChange={(reg:any) => this.updateRegion(reg)} 
			/>
		)
		else return (
			<View style={styles.container}>
				<Text style={styles.text}> Loading... </Text>
			</View>
		)
	}
}

export default PlacerScreen