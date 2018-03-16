import React, { Component } from 'react'
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	Image,
	Animated,
} from 'react-native'

import Compass from 'react-native-simple-compass'
import { NavigationScreenProps } from 'react-navigation'
import Svg, { Circle } from 'react-native-svg'
import { Region, LatLng } from 'react-native-maps'

import CompositeImage, { ImageSourceStyle } from '../components/CompositeImage'
import SimpleText from '../components/SimpleText'
import { DETECTOR, PIESLICE } from '../config'
import { 
	coordsToString, 
	calcBetween,
	lineToString,
} from '../utils/Coords'
import { LocationWatcher } from '../utils/Location'

import { 
	updateLocation,
	watchClosestChests,
} from '../utils/Firebase'

const THIN_RED = 'rgba(243,53,6,0.5)'

const { height, width } = Dimensions.get ('window')
const vertpad = Math.floor (((height * (9 / 10)) - width) / 2)

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
	coords?: LatLng,
	facing: number,
	chests?: LatLng[],
	watcher: LocationWatcher,
	error?:  Error,
}

function exists (thing:any) {
	return (! (! thing))
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

function findZone (bearing: number, distance: number, facing: number) {
	if (distance > DETECTOR.RINGS.OUTER) return null

	function findImg () {
		if (distance <= DETECTOR.RINGS.CENTER) return PIESLICE.CENTER
		if (distance <= DETECTOR.RINGS.INNER)  return PIESLICE.SMALL
		if (distance <= DETECTOR.RINGS.MEDIUM) return PIESLICE.MEDIUM
		if (distance <= DETECTOR.RINGS.OUTER)  return PIESLICE.LARGE

		throw new Error ("BUG ALERT: findImg() should have return a value")
	}

	function findRota () {
		const rota = 60 * Math.floor (bearing / 60)
		return rota - facing // TODO
	}

	return {
		source: findImg(),
		style: {
			tintColor: THIN_RED,
			transform: [{ rotateZ: `${findRota()}deg` }],
		}
	}
}

interface ZoneImageProps {
	coords?: LatLng,
	target?: LatLng,
}

export default class Detector extends Component<Props, State> {
	
	constructor (props: Props) {
		super (props)

		const watcher = new LocationWatcher ({
			onSuccess: ({ coords }) => { 
				this.setState ({ coords })

				updateLocation (coords)
					.catch (error => { this.setState ({ error })})
			},
			onError: (error) => { this.setState ({ error }) }
		})

		this.state = { watcher, facing: 0 }
	}

	componentDidMount () {
		this.state.watcher.start()
			.catch (error => this.setState ({ error }))
		// TODO: Set callback for closest chests
		watchClosestChests (chests => this.setState ({ chests }))
		Compass.start (3, (facing) => this.setState ({ facing }))
	}

	componentWillUnmount () {
		this.state.watcher.end()
			.catch (error => this.setState ({ error }))
	}

	toScanner () {
		this.props.navigation.navigate ('Scanner')
	}

	render () {
		const {
			coords,
			facing,
			chests,
			error,
		} = this.state

		// if (error) throw error

		if ((! chests) || (chests.length === undefined)) return (
			<SimpleText text={"Missing Chests"} />
		)

		if (! coords) return (
			<SimpleText text={"Missing Coords"} />
		)

		let images = [{
			source: PIESLICE.COMPLETE,
			style: {
				transform: [{ rotateZ: `${-facing}deg` }]
			}
		}]

		// TODO: Remove Duplicates	
		const strs = chests
			.map (chest => {
				const { latitude, longitude } = chest
				const { bearing, distance } = calcBetween (coords, chest)
				return { latitude, longitude, bearing, distance }
			})
			.map (chest => `{${coordsToString (chest)}, ${lineToString (chest)}}`)
			.map (str => `\n\t${str}`)
		console.log (`Chests: [ ${strs}\n]`)

		const zones = chests
			.map (chest => calcBetween (coords, chest))
			.map (line  => findZone (line.bearing, line.distance, facing))
			.filter (zone => (zone !== null)) // NOTE: Why doesn't this work?
			.forEach (zone => { if (zone !== null) images.push (zone) })
		
		console.log (`Heading: ${facing}`)
		
		return (
			<CompositeImage 
				style={styles.container}
				wrapperStyle={styles.overlay}
				imageStyle={styles.pieslice}
				images={images}
				/>
		)
	}
}