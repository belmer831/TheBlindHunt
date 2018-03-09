import React, { Component } from 'react'
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	Image,
	Animated
} from 'react-native'

import { NavigationScreenProps } from 'react-navigation'
import Svg, { Circle } from 'react-native-svg'

import SimpleText from '../components/SimpleText'
import { DETECTOR, PIESLICE } from '../config'
import { Region, LatLng } from '../types/Maps'
import { coordsToString, calcBetween } from '../utils/Coords'
import { LocationWatcher } from '../utils/Location'

const THIN_RED = 'rgba(243,53,6,0.5)'

const { height, width } = Dimensions.get ('window')
const vertpad = (height - width) / 2

const styles = StyleSheet.create ({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'black',
	},
	overlay: {
		position: 'absolute',
		top: vertpad,
		bottom: vertpad,
		left: 0,
		right: 0,
	},
	pieslice: {
		flex: 1,
		flexDirection: 'column',
		width: width,
		height: width,
		resizeMode: 'contain',
	},
})

type Props = NavigationScreenProps | any

interface State {
	coords:  LatLng,
	target:  LatLng,
	watcher: LocationWatcher,
	error?:  Error,
}

/*
const MidRadarCircleSvg = (props:{ distance:number }) => {
	
	const { height, width } = Dimensions.get ('window')
	const size = (height < width) ? height : width

	const filler = (distance <= 10) ? 'red' : 'transparent'
	const currLine = `Current: ${CoordsConverter.toString (coords)}`
	const targLine =  `Target: ${CoordsConverter.toString (target)}`

	return (
		<View style={{ flex: 1 }}>
			<SimpleText text={currLine} />
			<SimpleText text={targLine} />
			<SimpleText text={`${distance}`} />
			<View style={flex: 9}>
				<Svg height={size} width={size}>			
					<Circle cx='50%' cy='50%' r='44%'
						stroke='whitesmoke'
						strokeWidth='4'
						fill='black'
					/>
					<Circle cx='50%' cy='50%' r='40%'
						fill={filler}
					/>
				</Svg>
			</View>
		</View>
		
	)
}
*/

function findZone (bearing: number, distance: number) {
	if (distance > DETECTOR.RINGS.OUTER) return null

	function findImg () {
		if (distance <= DETECTOR.RINGS.CENTER) return PIESLICE.CENTER
		if (distance <= DETECTOR.RINGS.INNER)  return PIESLICE.SMALL
		if (distance <= DETECTOR.RINGS.MEDIUM) return PIESLICE.MEDIUM
		if (distance <= DETECTOR.RINGS.OUTER)  return PIESLICE.LARGE

		throw new Error ("BUG ALERT: findImg() should have return a value")
	}

	function findRota () {
		return 60 * Math.floor (bearing / 60)
	}

	return {
		img: findImg(),
		rota: findRota(),
	}
}

class FinderScreen extends Component<Props, State> {
	
	constructor (props: Props) {
		super (props)
		const { coords, target } = this.props.navigation.state.params
		const watcher = new LocationWatcher ({
			onSuccess: ({ coords }) => { this.setState ({ coords }) },
			onError:   (error) =>      { this.setState ({ error }) }
		})
		this.state = { coords, target, watcher }
	}

	componentDidMount () {
		this.state.watcher.start()
			.catch ((error) => {})
		//	.catch ((error) => this.setState ({ error }))
	}

	componentWillUnmount () {
		this.state.watcher.end()
			.catch ((error) => this.setState ({ error }))
	}

	toArtemp () {
		this.props.navigation.navigate ('Artemp')
	}

	render () {
		const {
			coords,
			target,
			error,
		} = this.state

		// if (error) throw error
		
		const { bearing, distance } = calcBetween (coords, target)
		const zone = findZone (bearing, distance)
		
		let ZoneImage
		if (zone !== null) {
			ZoneImage = (
				<Image source={zone.img}
					style={[styles.pieslice, {
						tintColor: THIN_RED,
						transform: [{ rotateZ: `${zone.rota}deg`}]
					}]}
				/>
			)
		}

		return (
			<View style={styles.container}>
				<SimpleText text={`Current: ${coordsToString (coords)}`} />
				<SimpleText text={`Target: ${coordsToString (target)}`} />
				<SimpleText text={`Bearing: ${bearing}`} />
				<SimpleText text={`Distance: ${distance}`} />
				<View style={{ flex: 12 }} />

				<View style={styles.overlay}>
					<Image 
						source={PIESLICE.COMPLETE} 
						style={styles.pieslice} 
					/>
				</View>
				<View style={styles.overlay}>
					{ZoneImage}
				</View>
			</View>
		)
	}
}

export default FinderScreen