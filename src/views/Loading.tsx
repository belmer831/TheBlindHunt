import React, { PureComponent } from 'react'
import {
	View,
	Text,
	Image,
	ActivityIndicator,
	StyleSheet,
	ImageBackground
} from 'react-native'

import { DARKROOM_SPLASH } from '../config/Assets'

const styles = StyleSheet.create ({
	container: { 
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
})

interface Props {}
interface State {}

export default class Loading extends PureComponent {
	render () {
		return (
			<ImageBackground 
				source={DARKROOM_SPLASH} 
				style={{ flex: 1 }}
				resizeMode='cover'
			>
				<View style={styles.container}>
					<ActivityIndicator animating />
				</View>
			</ImageBackground>
		)
	}
}