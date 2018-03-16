import React, { Component } from 'react'

// NOTE: Roundabout way to override type of Scene
import * as RNRF from 'react-native-router-flux'
const Router:any = RNRF.Router
const Scene:any =  RNRF.Scene
const Stack:any =  RNRF.Scene

import { GoogleSignin } from 'react-native-google-signin'
import Firebase from 'react-native-firebase'

import { LocationPermission } from './utils/Permissions'
import { 
	User,
	ensureRegistration,
	setupUserChests, 
} from './utils/Firebase'

import Loading  from './views/Loading'
import Login    from './views/Login'
import Detector from './views/Detector'
import Scanner  from './views/Scanner'

interface Props {}
interface State {
	ready:     boolean,
	listener?: Function,
	user?:     User,
	error?:    Error,
}

export default class App extends Component<Props, State> {
	constructor (props: Props) {
		super (props)
		
		this.state = {
			ready: false,
		}
	}

	async onStart () {
		await GoogleSignin.hasPlayServices ({ autoResolve: true })
		await GoogleSignin.configure ({
			webClientId: "471839243508-hdrmdajhps25j4rhtr9jurt3fng29bja.apps.googleusercontent.com",
		})

		if (! LocationPermission.isGranted()) await LocationPermission.request()
		if (! LocationPermission.isGranted()) throw new Error ("Location Permission Required")
	}

	async onAuthStateChanged (user?: User) {
		console.log (`onAuthStateChanged: user: ${user}`)
		
		if (user) {
			// await ensureRegistration()
			// await setupUserChests()
		}
	}

	componentDidMount () {
		const listener = Firebase.auth().onAuthStateChanged ((user?: User) => {
			this.onAuthStateChanged (user)
				.then (() => this.setState ({ user }))
				.catch (error => this.setState ({ error }))
		})
		this.setState ({ listener })
		
		this.onStart()
			.then (() => this.setState ({ ready: true }))
			.catch (error => this.setState ({ error }))
	}

	componentWillUnmount () {
		const { listener } = this.state
		if (listener) listener() // ends auth subscription
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
			<Router>
				<Scene key='root'>
					<Stack key='Auth' initial={(! user)}>
						<Scene key='Login' title='Login' component={Login} /> 
					</Stack>

					<Stack key='Main' initial={(user)}>
						<Scene key='Detector' title='Detector' component={Detector} initial/>
						<Scene key='Scanner' title='Scanner' component={Scanner} />
					</Stack>
				</Scene>
			</Router>
		)
	}
}