declare module 'react-native-simple-compass' {

	import { NativeModules, NativeEventEmitter } from 'react-native'

	export type DegreeCallback = (degree:number) => void

	export interface RNSimpleCompass {
		start: (update_rate: number|null, callback:DegreeCallback) => void,
		stop: () => void
	}

	const RNSimpleCompass: RNSimpleCompass
	export default RNSimpleCompass
}