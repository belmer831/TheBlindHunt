import { LatLng } from 'react-native-maps'
import { DELTA } from '../config'

export function coordsToString (coords: LatLng) {
	const { latitude, longitude } = coords
	const latstr = latitude
	const lonstr = longitude
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

interface LineBetween {
	bearing: number,
	distance: number,
}

export function lineToString (line:LineBetween) {
	const { bearing, distance } = line
	
	
	function bearingToString () {
		if (bearing < 0)   return `${bearing}?`

		if (bearing <= 90) return `${bearing}* NE`
		if (bearing < 180) return `${-(bearing - 180)}* SE`
		if (bearing < 270) return `${ (bearing - 180)}* SW`
		if (bearing < 360) return `${-(bearing - 360)}* NW`

		return `${bearing}?`
	}

	function distanceToString () {
		return `${Math.round (distance)}m`
	}

	return `(${distanceToString()}, ${bearingToString()})`
}

const EARTH_RADIUS = 6371000

function degreesToRadians (deg: number) {
	return deg * Math.PI / 180
}

function radiansToDegrees (rad: number) {
	return rad * 180 / Math.PI
}

export function calcBetween (alpha: LatLng, bravo: LatLng): LineBetween {
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
		let deg = radiansToDegrees (Math.atan2 (y, x))
		if (deg < 0) deg += 360

		return deg
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