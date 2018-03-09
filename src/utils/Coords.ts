import { LatLng } from '../types/Maps'
import { DELTA } from '../config'

export function coordsToString (coords: LatLng) {
	const { latitude, longitude } = coords
	const latstr =  latitude.toFixed (5)
	const lonstr = longitude.toFixed (5)
	return `(${latstr}, ${lonstr})`
}

export function coordsToRegion (coords: LatLng) {
	return {
		latitude:  coords.latitude,
		longitude: coords.longitude,
		latitudeDelta:  DELTA,
		longitudeDelta: DELTA,
	}
}

const EARTH_RADIUS = 6371000

function degreesToRadians (deg: number) {
	return deg * Math.PI / 180
}

function radiansToDegrees (rad: number) {
	return rad * 180 / Math.PI
}

export function calcBetween (alpha: LatLng, bravo: LatLng) {
	const aLat = degreesToRadians (alpha.latitude)
	const aLon = degreesToRadians (alpha.longitude)
	const bLat = degreesToRadians (bravo.latitude)
	const bLon = degreesToRadians (bravo.longitude)

	const dLat = bLat - aLat
	const dLon = bLon - aLon

	function calcBearing () {
		const y = Math.sin (dLon) * Math.cos (bLat)
		const x = ( 
			(Math.cos (aLat) * Math.sin (bLat)) 
			- (Math.sin (aLat) * Math.cos (bLat) * Math.cos (dLon))
		)
		return radiansToDegrees (Math.atan2 (y, x))
	}

	function calcDistance () {
		const a = (
			Math.cos (aLat) * Math.cos (bLat)
			* Math.pow (Math.sin (dLon / 2), 2)
			+ Math.pow (Math.sin (dLat / 2), 2)
		)
		const c = 2 * Math.atan2 (Math.sqrt (a), Math.sqrt (1-a))
		return EARTH_RADIUS * c
	}

	return {
		bearing:  calcBearing(),
		distance: calcDistance()
	}
}