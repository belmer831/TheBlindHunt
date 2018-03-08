/* Permissions
	- Currently Android only
	- AndroidManifest must also include permissions
*/

import { 
	PermissionsAndroid, 
	Platform,
} from 'react-native'

const appName = 'The Blind Hunt' // TODO: Factor this out

class Permission {
	private key:  string // TODO: Ensure this is valid
	private name: string
	private granted: boolean

	constructor (key: string, name: string) {
		this.key  = key
		this.name = name
		this.granted = false
	}

	isGranted () { return this.granted }

	async request () {
		switch (Platform.OS) {
			case 'android': return await this.requestForAndroid()
			case 'ios':     return await this.requestForIos()
			default: throw new Error (`Unsupported Platform: ${Platform.OS}`)
		}
	}

	async requestForAndroid () {
		const result = await PermissionsAndroid.request (PermissionsAndroid.PERMISSIONS[this.key], {
			title: `${appName} ${this.name} Permission`,
			message: `${appName} needs to use your ${this.name}`
		})

		this.granted = (result === PermissionsAndroid.RESULTS.GRANTED)
		if (! this.granted) throw new Error (`${this.name} Permission Denied`)
	}

	// TODO
	async requestForIos () {
		throw new Error ("Permission.prototype.requestForIos is not yet implemented")
	}
}

const CameraPermission = new Permission ('CAMERA', 'Camera')
const LocationPermission = new Permission ('ACCESS_FINE_LOCATION', 'Location')

export {
	CameraPermission,
	LocationPermission,
}