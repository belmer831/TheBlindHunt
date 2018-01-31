import React, { Component } from 'react'
import {
	StyleSheet,
	Text,
	View,
} from 'react-native'

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
} from '../utils/Maps'

import { Location, Permissions } from 'expo'
import { EventSubscription } from 'fbemitter'

const styles = StyleSheet.create ({
	map: {
		flex: 11,
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
	count:number = 0
	
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

	componentDidMount () {
		const options = {
			enableHighAccuracy: true,
			timeInterval: 10,
			distanceInterval: 1,
		}
		Location.watchPositionAsync (options, (location) => {
			try {
				if (! location.timestamp) throw new Error ("Bad Location")
				const { latitude, longitude } = location.coords
				this.setState ({ currentCoord: { latitude, longitude } })
				this.forceUpdate()
				this.count++
			}
			catch (error) { this.setState ({ error })}
		})
	}

	componentWillUnmount () {}

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