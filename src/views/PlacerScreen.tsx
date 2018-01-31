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

import { NavigationScreenProps } from 'react-navigation'

/* NOTE:
 - MapView.prototype.onPress
	- Documentation and d.ts file are wrong about the callback.
	- Expected: (coordinate: LatLng, position: Point) => void
	- Actual: (e) => void, where e.nativeEvent = { coordinate, position }
	- This will likely be found again using other parts of the API.
*/
import MapView, { Marker, MarkerProps } from 'react-native-maps'

import { Region, LatLng, Point } from '../utils/Maps'
import SimpleText from '../components/SimpleText';

const styles = StyleSheet.create ({
	header: {
		flex: 1,
	},
	map: {
		flex: 11,
	}
})

type Props = NavigationScreenProps<{
	region: Region,
}>

interface State {
	initialRegion: Region,
	currentRegion: Region,
	error: Error | null,
}

class PlacerScreen extends Component<Props, State> {
	constructor (props:Props) {
		super (props)
		const { region } = this.props.navigation.state.params
		this.state = {
			initialRegion: region,
			currentRegion: region,
			error: null,
		}
	}
	
	addMarker (pressCoord:LatLng) {
		const region = this.state.initialRegion
		const coord:LatLng = {
			latitude: pressCoord.latitude,
			longitude: pressCoord.longitude
		}
		this.props.navigation.navigate ('Finder', { region, coord })
	}

	updateRegion (region:Region) {
		this.setState ({ 
			currentRegion: region 
		})
	}

	render () {
		const {
			initialRegion,
			currentRegion,
			error,
		} = this.state

		if (error) return (
			<SimpleText text={`Error: ${error.message}`} />
		)
		
		return (
			<MapView 
				style={styles.map} 
				initialRegion={initialRegion}
				onRegionChange={(reg:Region) => this.updateRegion(reg)}
				onPress={(e:any) => {
					this.addMarker (e.nativeEvent.coordinate)
				}}
			/>
		)
	}
}

export default PlacerScreen