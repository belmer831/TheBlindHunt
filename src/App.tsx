import React, { Component } from 'react'
import { StyleSheet } from 'react-native'

// TODO: Fix broken types
import * as RNRF from 'react-native-router-flux'
const Router:any = RNRF.Router
const Scene:any  = RNRF.Scene
const Stack:any  = RNRF.Stack
const Tabs:any   = RNRF.Tabs

import { GoogleSignin } from 'react-native-google-signin'
import Firebase from 'react-native-firebase'

import { LocationPermission } from './utils/Permissions'
import { User } from './utils/Firebase'

import { GOOGLE_SIGNIN_WEB_CLIENT_ID } from './config'

import Loading   from './views/Loading'
import Login     from './views/Login'
import Detector  from './views/Detector'
import Inventory from './views/Inventory'
import Scanner   from './views/Scanner'

const styles = StyleSheet.create ({
	scene: {
		backgroundColor: 'black'
	},
	text: {
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: 20,
		color: 'whitesmoke',
	},
	navbar: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,1)',
	},
	tabbar: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,1)',
	},
})

interface Props {}
interface State {
	ready:  boolean,
	user?:  User,
	error?: Error,
}

export default class App extends Component<Props, State> {
	private authSubscription?: Function

	constructor (props: Props) {
		super (props)
		
		this.state = {
			ready: false,
		}
	}

	async onStart () {
		await GoogleSignin.hasPlayServices ({ autoResolve: true })
		await GoogleSignin.configure ({
			webClientId: GOOGLE_SIGNIN_WEB_CLIENT_ID,
		})

		if (! LocationPermission.isGranted()) await LocationPermission.request()
		if (! LocationPermission.isGranted()) throw new Error ("Location Permission Required")
	}

	async onAuthStateChanged (user?: User) {
		this.setState ({ user })
		console.log (`onAuthStateChanged: user: ${user}`)
	}

	componentDidMount () {
		this.authSubscription = Firebase.auth().onAuthStateChanged ((user?: User) => {
			this.setState ({ user })
			console.log (`onAuthStateChanged: user: ${user}`)
		})
		
		this.onStart()
			.then (() => this.setState ({ ready: true }))
			.catch (error => this.setState ({ error }))
	}

	componentWillUnmount () {
		if (this.authSubscription) this.authSubscription()
	}

	render () {
		const { 
			ready, 
			user,
			error,
		} = this.state

		if (error) throw error

		if (! ready) return <Loading />

		return (
			<Router
				navigationBarStyle={styles.navbar}
				title={styles.text}
			>
				<Scene key='root'>
					<Stack key='Auth' 
						initial={(! user)}
					>
						<Scene key='Login' 
							title='Login' 
							component={Login} 
						/> 
					</Stack>

					<Stack key='Main' 
						initial={(user)}
					>
						<Tabs key='Wander'
							swipeEnabled
							showLabel
							hideNavBar
							tabBarStyle={styles.tabbar}
							labelStyle={styles.text}
							inactiveBackgroundColor='rgba(255,255,255,0.2)'
						>
							<Scene key='Detector' 
								title='Detector' 
								component={Detector} 
								initial 
							/>
							<Scene key='Inventory'
								title='Inventory'
								component={Inventory}
							/>
						</Tabs>
						<Scene key='Scanner' 
							title='Scanner' 
							component={Scanner} 
						/>
					</Stack>
				</Scene>
			</Router>
		)
	}
}