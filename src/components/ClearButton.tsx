import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
} from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',

		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {

		borderRadius: 25,
		borderWidth: 1,

		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 40,
		paddingRight: 40,

		borderColor: 'white',

		alignItems: 'center',
		justifyContent: 'center',

	},
	text: {
		color: 'white',
		fontSize: 40,
	},
});

interface Props {
	onPress: () => void;
	text: string;
}

export default class ClearButton extends Component<Props> {
	render() {
		return (
			<View style={styles.container}>
				<TouchableHighlight onPress={this.props.onPress}>
					<View style={styles.button}>
						<Text style={styles.text}>
							{this.props.text}
						</Text>
					</View>
				</TouchableHighlight>
			</View>
		);
	}
}
