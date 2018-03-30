import { LocationPermission } from './Permissions'
import {
	GeolocationReturnType as Geostamp, 
	GeolocationError
} from 'react-native'

interface Callback<T> { (param: T): void }

// TODO: Use Geolocation Options
async function getCurrentLocation () {
	if (! LocationPermission.isGranted()) throw new Error ("Location Permission Required")

	return new Promise<Geostamp> ((resolve, reject) => {
		navigator.geolocation.getCurrentPosition (resolve, reject)
	})
}

class LocationWatcher {
	onSuccess: Callback<Geostamp>
	onError:   Callback<Error>
	private id?: number

	constructor (events: { 
		onSuccess: Callback<Geostamp>,
		onError:   Callback<Error>
	}) {
		this.onSuccess = events.onSuccess
		this.onError   = events.onError
	}

	isRunning () {
		return (this.id !== undefined)
	}

	async start () {
		try {
			if (! LocationPermission.isGranted()) throw new Error ("Location Permission Required")
			if (this.id) throw new Error ("Location Watcher is already running")

			this.id = navigator.geolocation.watchPosition (
				(geo) => this.onSuccess (geo), 
				(err) => this.onError (new Error (err.message)),
				{
					enableHighAccuracy: true,
					timeout: 10000,
					distanceFilter: 2,
				}
			)
		}
		catch (error) {
			this.onError (error)
		}
	}

	async end () {
		try {
			if (! this.id) throw new Error ("Location Watcher is not running")
			navigator.geolocation.clearWatch (this.id)
			this.id = undefined
		}
		catch (error) {
			this.onError (error)
		}
	}
}

export {
	Geostamp,
	getCurrentLocation,
	LocationWatcher,
}