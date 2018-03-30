import React, { Component } from 'react'
import {
	TouchableHighlight,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Image,
	Animated,
} from 'react-native'

import { Actions } from 'react-native-router-flux'
import Compass from 'react-native-simple-compass'
import { Region, LatLng } from 'react-native-maps'
import { RADAR } from '../config/Assets'
import SimpleText from '../components/SimpleText'
import ClearButton from '../components/ClearButton'
import { calcBetween } from '../utils/Coords'
import { LocationWatcher } from '../utils/Location'
import { ZoneData, findZone } from '../utils/Zones'
import CompositeImage, { 
	ImageSourceStyle 
} from '../components/CompositeImage'
import {
	updateLocation,
	ChestDataWatcher,
	ChestData,
} from '../utils/Firebase'

const THIN_RED = 'rgba(243,53,6,0.5)'

const { height, width } = Dimensions.get ('window')
const vertpad = Math.floor (((height * (9 / 10)) - width) / 2)

const styles = StyleSheet.create ({
	container: {
		flex: 1,
		backgroundColor: 'black',
	},
	middle: {
		flex: 6,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	overlay: {
		position: 'absolute',
		top: 0,
		bottom: 0,
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
	bottom: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 40,
	},
})

interface ProChest extends ChestData {
	bearing: number,
	distance: number,
	zone: ZoneData,
}

interface Props {}
interface State {
	facing:  number,
	coords?: LatLng,
	chests?: ChestData[],
	error?:  Error,
}

export function processChests (chests: ChestData[], coords: LatLng) {
	return ( chests
		.map (chest => {
			const { bearing, distance } = calcBetween (coords, chest)
			const zone = findZone (bearing, distance)
			return { bearing, distance, zone, ...chest }
		})
		.filter (proChest => (proChest.zone !== null)) as ProChest[]
	)
}

export default class Detector extends Component<Props, State> {
	
	private readonly chestsWatcher:   ChestDataWatcher
	private readonly locationWatcher: LocationWatcher

	constructor (props: Props) {
		super (props)

		this.locationWatcher = new LocationWatcher ({
			onSuccess: ({ coords }) => { 
				this.setState ({ coords })

				updateLocation (coords)
					.catch (error => this.setState ({ error }))
			},
			onError: (error) => this.setState ({ error })
		})

		this.chestsWatcher = new ChestDataWatcher ({
			onSuccess: (chests) => this.setState ({ chests }),
			onError: (error) => this.setState ({ error })
		})

		this.state = { 
			facing: 0,
		}
	}

	componentDidMount () {
		this.locationWatcher.start()
		this.chestsWatcher.start()
		Compass.start (3, facing => this.setState ({ 
			facing: (-1 * facing)
		}))
	}

	componentWillUnmount () {
		this.locationWatcher.end()
		this.chestsWatcher.end()
		Compass.stop()
	}

	toScanner (chestId?: string) {
		if (chestId) Actions.Scanner ({ chestId })
	}

	render () {
		const {
			coords,
			facing,
			chests,
			error,
		} = this.state

		if (error) {
			setInterval (() => this.setState ({ 
				error: undefined
			}), 2000)
			return <SimpleText text={error.message} />
		}

		if (! (chests && chests.length)) return (
			<SimpleText text={"Missing Chests"} />
		)

		if (! coords) return (
			<SimpleText text={"Missing Coords"} />
		)
		
		let centerChestId: string | undefined

		const proChests = processChests (chests, coords)

		proChests.forEach (chest => {
			const { zone, chestId } = chest
			if (zone.source === RADAR.CENTER) {
				centerChestId = chestId
			}
		})
		
		const zones:ImageSourceStyle[] = proChests.map (chest => {
			const { source, rotation } = chest.zone
			const style = {
				tintColor: THIN_RED,
				transform: [{ rotateZ: `${(rotation + facing)}deg` }]
			}
			return { source, style }
		})

		const baseZones = [ RADAR.ARROW, RADAR.FRAME ]
		baseZones.forEach (src => {
			zones.unshift ({
				source: src,
				style: { transform: [{ rotateZ: `${facing}deg` }]}
			})
		})
		
		return (
			<View style={styles.container}>
				<CompositeImage 
					style={styles.middle}
					wrapperStyle={styles.overlay}
					imageStyle={styles.pieslice}
					images={zones}
				/>
				<View style={styles.bottom}>
					{ (centerChestId) ? 
						<ClearButton
							text={'Scan'}
							onPress={() => this.toScanner (centerChestId)}
						/>
						:
						undefined 
					}
				</View>
			</View>
		)
	}
}