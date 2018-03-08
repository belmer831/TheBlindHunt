import { LatLng, delta } from './Maps'

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
		latitudeDelta: delta,
		longitudeDelta: delta,
	}
}