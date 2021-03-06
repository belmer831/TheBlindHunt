import React, { Component } from 'react'
import { 
	Dimensions,
	Image,
	Text,
	View,
	StyleSheet,
	TouchableHighlight,
	KeyboardAvoidingView,
	ImageBackground,
} from 'react-native'

import Firebase from 'react-native-firebase'
import { 
	GoogleSignin, 
	GoogleSigninButton,
} from 'react-native-google-signin'

import { SocialIcon } from 'react-native-elements'

import UserInput from '../components/UserInput'
import SubmitButton from '../components/SubmitButton'

import {
	REACT_LOGO,
	USERNAME_ICON,
	PASSWORD_ICON,
	WALLPAPER,
} from '../config/Assets'

const WINDOW_WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create ({
	background: {
		flex: 1,
	},
	container: {
		flex: 1,
		backgroundColor: 'transparent',
		padding: 40,
	},
	brandContainer: {
		flex: 3,
		alignItems: 'center',
		justifyContent: 'center',
	},
	brandImage: {
		width: 80,
		height: 80,
	},
	brandText: {
		color: 'white',
		fontWeight: 'bold',
		backgroundColor: 'transparent',
		marginTop: 20,
	},
	messageContainer: {
		flex: 1,
	},
	messageText: {
		color: 'white',
		backgroundColor: 'transparent',
	},
	form: {
		flex: 2,
		alignItems: 'center',
	},
	submit: {
		flex: 1,
		top: -95,
		alignItems: 'center',
		justifyContent: 'center',
	},
	socialContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	socialButton: {
		borderRadius: 4,
	},
	socialText: {
		color: 'white',
	}
})

interface Props {}
interface State {
	username: string,
	password: string,
	message?: string,
	error?:   Error,
}

export default class Login extends Component<Props, State> {
	constructor (props: Props) {
		super (props)
		this.state = {
			username: '',
			password: '',
		}
	}

	onSubmit () {
		this.setState ({
			message: "Email login is currently not supported"
		})
	}

	async loginWithGoogle () {
		const data = await GoogleSignin.signIn()
		if (! data.idToken) throw new Error ("No idToken")

		const cred = Firebase.auth.GoogleAuthProvider.credential (data.idToken, data.accessToken)

		await Firebase.auth().signInWithCredential (cred)
		this.setState ({ message: "You should've been redirected" })
	}

	onPressGoogle () {
		this.loginWithGoogle ()
			.catch (error => this.setState ({ error }))
	}

	render () {
		const { 
			username,
			password,
			message, 
			error,
		} = this.state

		if (error) throw error
		
		return (
			<ImageBackground 
				source={WALLPAPER} 
				style={{ flex: 1 }}
				resizeMode='contain'
			>
				<View style={styles.container}>

					<View style={styles.brandContainer}>
						<Image source={REACT_LOGO} style={styles.brandImage} />
						<Text style={styles.brandText}> 
							The Blind Hunt 
						</Text>
					</View>

					<View style={styles.messageContainer}>
						<Text style={styles.messageText}>
							{ message }
						</Text>
					</View>

					{ /* TODO: Email/Password Login
					<KeyboardAvoidingView 
						style={styles.form}
						behavior='padding'
						>
						<UserInput 
							placeholder={'Username'}
							logo={USERNAME_ICON} 
							onChangeText={(text) => this.setState ({
								username: text 
							})}
							/>
						<UserInput 
							placeholder={'Password'}
							logo={PASSWORD_ICON}
							secure
							onChangeText={(text) => this.setState ({
								password: text
							})}
							/>
					</KeyboardAvoidingView>

					<View style={styles.submit}>
						<SubmitButton onPress={() => this.onSubmit()} />
					</View>
						*/ }
					
					<View style={styles.socialContainer}>
						<GoogleSigninButton
							style={{ width: 230, height: 48 }}
							size={GoogleSigninButton.Size.Standard}
							color={GoogleSigninButton.Color.Light}
							onPress={() => this.onPressGoogle()}
						/>
					</View>
				</View>
			</ImageBackground>
		)
	}
}

