import React, { Component } from 'react'
import {} from 'react-native'
import MapView, { 
	LatLng,
	Marker,
	Circle,
	Polyline,
} from 'react-native-maps'

import { 
	ChestData, 
	ChestDataWatcher, 
} from '../utils/Firebase'
import { 
	calcCoords,
	calcBetween, 
	coordsToRegion,
	LatLngDelta,
	DELTAS,
} from '../utils/Coords'

import { LocationWatcher } from '../utils/Location'
import { getCurrentLocation } from '../utils/Location'
import { ZoneData, findZone } from '../utils/Zones'
import SimpleText from '../components/SimpleText'
import { KELLY_COLORS } from '../utils/Colors'
import { RINGS } from '../utils/Zones'

interface Props {}

interface State {
	chests?: ChestData[],
	coords?: LatLng,
	deltas?: LatLngDelta,
	error?:  Error,
}

const rings = [
	RINGS.CENTER,
	RINGS.SMALL,
	RINGS.MEDIUM,
	RINGS.LARGE,
]

type Pair<T> = [ T, T ]

const directions: Pair<number>[] = [ 
	[ 1,  0], 
	[-1,  0], 
	[ 0, -1], 
	[ 0,  1], 
]

function toLines (coords: LatLng): LatLng[][] {

	function makeCoords (scalar: number, dir: Pair<number>) {
		const sdir = dir.map (n => n * scalar)
		return calcCoords (coords, sdir[0], sdir[1])
	}

	return directions.map (dir => [
		makeCoords (RINGS.CENTER, dir),
		makeCoords (RINGS.LARGE,  dir),
	])
}


export default class DetectorMap extends Component<Props, State> {

	private readonly chestsWatcher: ChestDataWatcher
	private readonly locationWatcher: LocationWatcher

	private mapRef?: any
	
	constructor (props: Props) {
		super (props)
		this.state = {}

		this.chestsWatcher = new ChestDataWatcher ({
			onSuccess: (chests) => this.setState ({ chests }),
			onError:   (error)  => this.setState ({ error })
		})

		this.locationWatcher = new LocationWatcher ({
			onSuccess: ({ coords }) => this.setState ({ coords }),
				// this.onLocationChange (coords),
			onError: (error) => this.setState ({ error })
		})
	}

	/*
	onLocationChange (coords: LatLng) {
		try {
			if (! this.mapRef) throw new Error ("Waiting on mapRef")
			if (! this.state.coords) throw new Error ("Waiting on Coords")
			this.mapRef.animateToCoordinate (coords)
		}
		catch (error) {
			this.setState ({ error })
		}
	}
	*/

	componentDidMount () {
		getCurrentLocation()
			.then (({ coords }) => this.setState ({ coords }))
			.catch (error => this.setState ({ error }))
		this.chestsWatcher.start()
		this.locationWatcher.start()
	}

	componentWillUnmount () {
		this.chestsWatcher.end()
		this.locationWatcher.end()
	}

	render () {
		const { 
			chests, 
			coords,
			deltas,
			error, 
		} = this.state
		
		if (error) {
			setInterval (() => this.setState ({ 
				error: undefined
			}), 2000)
			return <SimpleText text={error.message} />
		}

		if (! coords) return <SimpleText text='Missing initial Coords' />
		if (! chests) return <SimpleText text='Missing Chests' />

		return (
			<MapView
				ref={(ref:any) => { this.mapRef = ref }}
				style={{ flex: 1 }}
				initialRegion={coordsToRegion (coords)}

				showsUserLocation
				cacheEnabled
				loadingEnabled
			>
				{ chests.map ((chests, i) =>
					<Marker 
						key={i}
						coordinate={chests}
						pinColor={KELLY_COLORS[i % 22]}
						zIndex={2}
					/>
				)}

				{ rings.map ((ring, i) =>
					<Circle 
						key={i}
						center={coords}
						radius={ring}
						strokeColor='black'
						strokeWidth={2}
						zIndex={1}
					/>
				)}

				{ toLines (coords).map ((line, i) => 
					<Polyline
						key={i}
						coordinates={line}
						strokeColor='black'
						strokeWidth={2}
						zIndex={1}
					/>
				)}
			</MapView>
		)
	}
}