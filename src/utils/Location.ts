import { LocationPermission } from './Permissions';
import { GeolocationReturnType } from 'react-native';
import Watcher from './Watcher';

export type Geostamp = GeolocationReturnType;

export async function CurrentLocation() {
	if(!LocationPermission.isGranted()) throw new Error('Location Permission Required');
	return new Promise<Geostamp>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true }));
}

export default class LocationWatcher extends Watcher<Geostamp> {
	private mId: number | undefined;

	public get IsRunning(): boolean { return (this.mId !== undefined); }

	public async Start(): Promise<void> {
		try {
			if(!LocationPermission.isGranted()) throw new Error('Location Permission Required');
			if(this.mId) throw new Error('Location Watcher is already running');

			const options: any = {
				enableHighAccuracy: true,
				distanceFilter: 0.01
			};

			this.mId = navigator.geolocation.watchPosition(
				(geo) => this.OnSuccess(geo),
				(error) => this.OnFailure(new Error(error.message)),
				options);
		}
		catch(error) { this.OnFailure(error); }
	}

	public async Stop(): Promise<void> {
		try {
			if(!this.mId) throw new Error('Location Watcher is not running');
			navigator.geolocation.clearWatch(this.mId);
			this.mId = undefined;
		}
		catch(error) { this.OnFailure(error); }
	}
}
