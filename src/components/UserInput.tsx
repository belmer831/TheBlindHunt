import React, { Component } from 'react';
import {
	Image,
	StyleSheet,
	View,
	TextInput,
} from 'react-native';

const LOGO_SIZE = 22;
const TEXT_COLOR = 'white';
const FILL_COLOR = 'rgba(255, 255, 255, 0.4)';

// TODO: Review this
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	logo: {
		position: 'absolute',
		zIndex: 99,
		width: LOGO_SIZE,
		height: LOGO_SIZE,
		left: 35,
		top: 9,
	},
	input: {
		backgroundColor: FILL_COLOR,
		color: TEXT_COLOR,
		height: 40,
		paddingLeft: 45,
		borderRadius: 20,
	},
});

interface Props {
	logo: any;
	placeholder: string;
	onChangeText: (text: string) => void;
	secure?: boolean;
}
interface State { }

export default class UserInput extends Component<Props, State> {
	public constructor(props: Props) { super(props); }

	public render() {
		const { logo, placeholder, secure } = this.props;
		return (
			<View style={styles.container}>
				<Image source={logo} style={styles.logo} />
				<TextInput
					style={styles.input}
					placeholder={placeholder}
					secureTextEntry={secure}
					placeholderTextColor={TEXT_COLOR}
					underlineColorAndroid='transparent'
				/>
			</View>
		);
	}
}
