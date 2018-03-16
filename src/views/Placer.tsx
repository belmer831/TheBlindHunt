import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Geostamp, LocationWatcher } from '../utils/Location'
import { coordsToString, coordsToRegion } from '../utils/Coords'
import SimpleText from '../components/SimpleText';

/* NOTE:
 - MapView.prototype.onPress
	- Documentation and d.ts file are wrong about the callback.
	- Expected: (coordinate: LatLng, position: Point) => void
	- Actual: (e) => void, where e.nativeEvent = { coordinate, position }
	- This will likely be found again using other parts of the API.
*/

import MapView, { 
	Marker, MarkerProps,
	Region, LatLng, Point,
} from 'react-native-maps'

const styles = StyleSheet.create ({
	header: {
		flex: 1,
	},
	map: {
		flex: 11,
	}
})

/* ISSUE: NavigationScreenProps is no longer generic
type Props = NavigationScreenProps<{
	region: Region,
}> 
*/

type Props = NavigationScreenProps | any // TODO: Fix this whole situation

interface State {
	region:  Region,
	coords:  LatLng,
	error?:  Error,
}

class PlacerScreen extends Component<Props, State> {

	constructor (props: Props) {
		super (props)
		const { coords } = this.props.navigation.state.params
		const region = coordsToRegion (coords)
		this.state = { region, coords }
	}
	
	toFinder (target: LatLng) {
		const { coords } = this.state
		this.props.navigation.navigate ('Finder', { coords, target })
	}

	render () {
		const {
			region,
			coords,
			error,
		} = this.state

		if (error) throw error

		const coordsLine = `Coords: ${coordsToString (coords)}`
		
		return (
			<View style={{ flex: 1 }}>
				<SimpleText text={coordsLine} />
				<MapView 
					style={styles.map} 
					initialRegion={region}
					onPress={(e:any) => {
						this.toFinder (e.nativeEvent.coordinate)
					}}
				/>
			</View>
		)
	}
}

export default PlacerScreen