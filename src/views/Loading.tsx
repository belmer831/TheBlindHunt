import React, { PureComponent } from 'react';
import {
	View,
	ActivityIndicator,
	StyleSheet,
	ImageBackground
} from 'react-native';

import { SPLASH } from '../assets';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default class Loading extends PureComponent {
	render() {
		return (
			<ImageBackground source={SPLASH} style={{ flex: 1 }} resizeMode='cover'>
				<View style={styles.container}>
					<ActivityIndicator animating={true} />
				</View>
			</ImageBackground>
		);
	}
}
