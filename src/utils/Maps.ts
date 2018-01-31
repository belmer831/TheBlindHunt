export const delta = 0.02
export const targetRadius = 10
const earthRadius = 6371000

export interface Region {
	latitude: number,
	longitude: number,
	latitudeDelta: number,
	longitudeDelta: number,
}

export interface LatLng {
	latitude: number,
	longitude: number,
}

export interface Point {
	x: number,
	y: number,
}

export interface EdgePadding {
	top: number,
	bottom: number,
	right: number,
	left: number,
}

export interface EdgeInsets {
	top: number,
	left: number,
	bottom: number,
	right: number,
}

function toRadians (deg:number):number {
	return deg * Math.PI / 180
}

export function calcDistance (alpha:LatLng, bravo:LatLng) {

	const aLat = toRadians (alpha.latitude)
	const aLon = toRadians (alpha.longitude)
	const bLat = toRadians (bravo.latitude)
	const bLon = toRadians (bravo.longitude)

	const dLat = bLat - aLat
	const dLon = bLon - aLon

	const a = (
		Math.cos (aLat) * Math.cos (bLat)
		* Math.pow (Math.sin (dLon / 2), 2)
		+ Math.pow (Math.sin (dLat / 2), 2)
	)

	const c = 2 * Math.atan2 (Math.sqrt(a), Math.sqrt(1-a))

	return earthRadius * c
}

