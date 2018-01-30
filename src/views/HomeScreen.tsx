import React, { Component } from 'react'
import {
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
} from 'react-native'

import { Location, Permissions } from 'expo'
import { NavigationScreenProps } from 'react-navigation'

import ClearButton from '../components/ClearButton'
import SimpleText from '../components/SimpleText'

import { delta, getLocationAsync } from '../utils/Maps'

const styles = StyleSheet.create ({
	container: {
		flex: 1,
		backgroundColor: 'black',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		flex: 1,
		color: 'white',
		fontSize: 40,
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	start: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
})

type Props = NavigationScreenProps<{}>

interface State {
	error: Error | null,
}

class HomeScreen extends Component<Props, State> {
	constructor (props:Props) {
		super (props)
		this.state = {
			error: null,
		}
	}

	async toPlacer () {
		try {
			const { latitude, longitude } = await getLocationAsync()
			this.props.navigation.navigate ('Placer', { 
				region: {
					latitude: latitude,
					longitude: longitude,
					latitudeDelta: delta,
					longitudeDelta: delta,
				} 
			})
		}
		catch (err) {
			this.setState ({ 
				error: err
			})
		}
	}

	render() {
		const { error } = this.state

		if (error) return (
			<SimpleText text={error.message}/>
		)
		else return (
			<View style={styles.container}>
				<Text style={styles.title}>
					The Blind Hunt
				</Text>
				<View style={styles.start}>
					<ClearButton
						text={"Start"}
						onPress={() => this.toPlacer()} />
				</View>
			</View>
		)
	}
}

export default HomeScreen