import React, { Component } from 'react'
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
} from 'react-native'

import { NavigationScreenProps } from 'react-navigation'

import Svg, { Circle } from 'react-native-svg'

import SimpleText from '../components/SimpleText'

import { 
	Region, 
	LatLng, 
	calcDistance,
	targetRadius,
} from '../utils/Maps'

import { coordsToString } from '../utils/Coords'
import { LocationWatcher } from '../utils/Location'

function coordsToText (coords: LatLng) {
	const { latitude, longitude } = coords
	return `(${latitude}, ${longitude})`
}

const styles = StyleSheet.create ({
	container: {
		flex: 10,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'black',
	}
})

type Props = NavigationScreenProps | any

interface State {
	coords:  LatLng,
	target:  LatLng,
	watcher: LocationWatcher,
	error?:  Error,
}

class FinderScreen extends Component<Props, State> {
	
	constructor (props: Props) {
		super (props)
		const { coords, target } = this.props.navigation.state.params
		const watcher = new LocationWatcher ({
			onSuccess: ({ coords }) => { this.setState ({ coords })},
			onError:   (error) =>      { this.setState ({ error }) }
		})
		this.state = { coords, target, watcher }
	}

	componentDidMount () {
		this.state.watcher.start()
			.catch ((error) => this.setState ({ error }))
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

		const { height, width } = Dimensions.get ('window')
		const size = (height < width) ? height : width

		if (error) throw error
		
		const distance = calcDistance (coords, target)
		const filler = (distance <= targetRadius) ? 'red' : 'transparent'
		
		const currentLine = `Current: ${coordsToString (coords)}`
		const targetLine  = `Target:  ${coordsToString (target)}`

		return (
			<View style={{ flex: 1 }}>
				<SimpleText text={currentLine} />
				<SimpleText text={targetLine} />
				<SimpleText text={`${distance}`} />
				<View style={styles.container}>
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
}

export default FinderScreen