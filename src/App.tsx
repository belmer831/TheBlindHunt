import React, { Component } from 'react';/*
import { StyleSheet } from 'react-native';

// TODO: Fix broken types
import * as RNRF from 'react-native-router-flux';
const Router: any = RNRF.Router;
const Scene: any = RNRF.Scene;
const Stack: any = RNRF.Stack;
const Tabs: any = RNRF.Tabs;*/

import { GoogleSignin } from 'react-native-google-signin';
import Firebase from 'react-native-firebase';

import { LocationPermission } from './utils/Permissions';
import { User } from './utils/Firebase';

import Loading from './views/Loading';
import MapGrid from './components/MapGrid';
import { LatLng } from 'react-native-maps';
import { CurrentLocation } from './utils/Location';
import { RINGS } from './utils/Zones';
/*
import Login from './views/Login';

import Scanner from './views/Scanner';

import Inventory from './views/Inventory';
import InventoryLogs from './views/InventoryLogs';

import Detector from './views/Detector';
import DetectorLogs from './views/DetectorLogs';
/*
const styles = StyleSheet.create({
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
});
*/
interface Props { }
interface State {
	ready: boolean;
	user?: User;
	error?: Error;
}
/*
const TabProps = {
	swipeEnabled: true,
	showLabel: true,
	hideNavBar: true,
	tabBarStyle: styles.tabbar,
	labelStyle: styles.text,
	inactiveBackgroundColor: 'grey'
};
*/
export default class App extends Component<Props, State> {
	mOrigin: LatLng;
	private authSubscription?: Function;

	public constructor(props: Props) {
		super(props);
		this.state = { ready: false };
	}

	private async Start() {
		await GoogleSignin.hasPlayServices({ autoResolve: true });
		await GoogleSignin.configure({
			webClientId: '471839243508-e4adts7gkiil76niaeceuos1s9tqdegd.apps.googleusercontent.com'
		});

		if(!LocationPermission.isGranted()) await LocationPermission.request();
		if(!LocationPermission.isGranted()) throw new Error('Location Permission Required');
		this.mOrigin = (await CurrentLocation()).coords;
	}

	public componentDidMount() {
		this.authSubscription = Firebase.auth().onAuthStateChanged((user?: User) => {
			this.setState({ user });
			console.log(`onAuthStateChanged: user: ${user}`);
		});

		this.Start()
			.then(() => this.setState({ ready: true }))
			.catch(error => this.setState({ error }));
	}

	public componentWillUnmount() { if(this.authSubscription) this.authSubscription(); }

	public render() {
		const {
			ready,
			//user,
			error,
		} = this.state;

		if(error) throw error;

		if(!ready) return <Loading />;

		return <MapGrid origin={this.mOrigin} radius={RINGS.LARGE} />;/*(
			<Router navigationBarStyle={styles.navbar} title={styles.text}>
				<Scene key='root'>
					<Stack key='Auth' initial={(!user)}>
						<Scene key='Login' title='Login' component={Login} />
					</Stack>
					<Stack key='Main' initial={(user)}>
						<Tabs key='Detector' initial={true} {...TabProps}>
							<Scene key='DetectorRadar' title='Radar' component={Detector} initial={true} />
							<Scene key='DetectorLogs' title='Logs' component={DetectorLogs} />
							<Scene key='InventoryTiles' title='Tiles' component={Inventory} />
							<Scene key='InventoryLogs' title='Logs' component={InventoryLogs} />
						</Tabs>
						<Scene key='Scanner' title='Scanner' component={Scanner} />
					</Stack>
				</Scene>
			</Router>
		);*/
	}
}
