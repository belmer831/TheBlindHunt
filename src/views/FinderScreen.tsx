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
import MapView, { 
	Marker, 
	MarkerProps,
	Circle,
} from 'react-native-maps'

import SimpleText from '../components/SimpleText'
import { 
	Region, 
	LatLng, 
	calcDistance,
	targetRadius, 
	getLocationAsync,
} from '../utils/Maps'

const styles = StyleSheet.create ({
	map: {
		flex: 1,
	}
})

type Props = NavigationScreenProps <{
	region: Region,
	coord:  LatLng,
}>

interface State {
	initialRegion: Region,
	currentRegion: Region,
	currentCoord:  LatLng,
	targetCoord:   LatLng,
	error: Error | null,
}

class FinderScreen extends Component<Props, State> {
	
	constructor (props:Props) {
		super (props)
		const { region, coord } = this.props.navigation.state.params
		this.state = {
			initialRegion: region,
			currentRegion: region,
			currentCoord:  region,
			targetCoord:   coord,
			error: null,
		}
	}

	componentWillMount () {
		getLocationAsync() 
			.then (currentCoord => this.setState ({ currentCoord }))
			.catch (error => this.setState ({ error }))
	}

	toArtemp () {
		this.props.navigation.navigate ('Artemp')
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
			currentCoord,
			targetCoord,
			error,
		} = this.state

		if (error) return (
			<SimpleText text={`Error: ${error.message}`} />
		)

		let colors: {
			pin: string,
			stroke: string,
			fill: string,
		}
		const nearTarget = calcDistance (currentCoord, targetCoord) <= targetRadius
		if (nearTarget) {
			colors = {
				pin: 'darkgreen',
				stroke: 'green',
				fill: 'lightgreen',
			}
		}
		else {
			colors = {
				pin: 'maroon',
				stroke: 'red',
				fill: 'lightpink',
			}
		}

		return (
			<MapView style={styles.map} 
				initialRegion={initialRegion}
				onRegionChange={(reg:Region) => this.updateRegion(reg)}
			>
				<Marker
					coordinate={targetCoord}
					pinColor={colors.pin}
					onPress={() => { if (nearTarget) this.toArtemp() }}
				/>
				<Circle
					center={targetCoord}
					radius={targetRadius}
					strokeColor={colors.stroke}
					fillColor={colors.fill}
				/>
				<Circle 
					center={currentCoord}
					radius={1}
					strokeColor={'blue'}
					fillColor={'blue'}
				/>
			</MapView>
		)
	}
}

export default FinderScreen