import React, { Component } from 'react'
import {
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
} from 'react-native'

import { NavigationScene } from 'react-navigation'

import ClearButton from '../components/ClearButton'

const styles = StyleSheet.create ({
	container: {
		flex: 1,
		backgroundColor: 'black',
		alignItems: 'center',
		justifyContent: 'center',
	},
	area: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	title: {
		flex: 1,
		color: 'white',
		fontSize: 40,
		textAlign: 'center',
		textAlignVertical: 'center',
	}
})

const Padding = () => <View style={{ flex: 0.5 }} />

interface Props {
	navigation: any,
}

class HomeScreen extends Component<Props> {
	toPlacer () {
		this.props.navigation.navigate ('Placer')
	}

	render() {
		return (
			<View style={styles.container}>
				<Padding />

				<View style={styles.area}>
					<Text style={styles.title}> 
						The Blind Hunt 
					</Text>
				</View>

				<View style={styles.area}>
					<ClearButton
						text={"Start"}
						onPress={() => this.toPlacer()} />
				</View>

				<Padding />
			</View>
		)
	}
}

export default HomeScreen