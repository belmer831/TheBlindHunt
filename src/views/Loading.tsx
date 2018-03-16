import React, { PureComponent } from 'react'
import {
	View,
	Text,
	Image,
	ActivityIndicator,
	StyleSheet,
	ImageBackground
} from 'react-native'

import { Splash } from '../config/Assets'

const styles = StyleSheet.create ({
	container: { 
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	background: {
		flex: 1,
		resizeMode: 'cover',
	},
})

interface Props {}
interface State {}

export default class Loading extends PureComponent {

	render () {
		return (
			<ImageBackground source={Splash} style={styles.background}>
				<View style={styles.container}>
					<ActivityIndicator animating={true} />
				</View>
			</ImageBackground>
		)
	}
}