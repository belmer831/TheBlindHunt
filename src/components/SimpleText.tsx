import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
} from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black',
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		flex: 1,
		color: 'white',
		fontSize: 20,
		textAlign: 'center',
		textAlignVertical: 'center',
	}
});

interface Props {
	text: string;
}

export default class SimpleText extends Component<Props> {
	public render() {
		return (
			<View style={styles.container}>
				<Text style={styles.text} adjustsFontSizeToFit={true}>
					{this.props.text}
				</Text>
			</View>
		);
	}
}
