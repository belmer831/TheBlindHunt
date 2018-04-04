import { LatLng } from 'react-native-maps';


/**
 *  DELTA
 * - Deltas are used to set the "height" of the camera in MapView.
 * - The default delta when creating a Region from a LatLng.
 */
const DELTA = 0.01;

export const DELTAS: LatLngDelta = {
	latitudeDelta: DELTA,
	longitudeDelta: DELTA
};

export interface LatLngDelta {
	latitudeDelta: number;
	longitudeDelta: number;
}

export function coordsToString(coords: LatLng) { return `(${coords.latitude}, ${coords.longitude})`; }

export function coordsToRegion(coords: LatLng, deltas: LatLngDelta = DELTAS) {
	return {
		latitude: coords.latitude,
		longitude: coords.longitude,
		latitudeDelta: deltas.latitudeDelta,
		longitudeDelta: deltas.longitudeDelta
	};
}

interface LineBetween {
	bearing: number;
	distance: number;
}

export function lineToString(line: LineBetween) {
	const { bearing, distance } = line;

	function bearingToString() {
		if(bearing < 0) return `${bearing}?`;

		if(bearing <= 90) return `${bearing}* NE`;
		if(bearing < 180) return `${-(bearing - 180)}* SE`;
		if(bearing < 270) return `${(bearing - 180)}* SW`;
		if(bearing < 360) return `${-(bearing - 360)}* NW`;

		return `${bearing}?`;
	}

	function distanceToString() { return `${Math.round(distance)}m`; }

	return `(${distanceToString()}, ${bearingToString()})`;
}

const EARTH_RADIUS = 6371000;

function degreesToRadians(deg: number) { return deg * Math.PI / 180; }

function radiansToDegrees(rad: number) { return rad * 180 / Math.PI; }

export function calcCoords(origin: LatLng, dNorth: number, dEast: number): LatLng {
	return {
		latitude: origin.latitude + radiansToDegrees(dNorth / EARTH_RADIUS),
		longitude: origin.longitude + radiansToDegrees(dEast / (EARTH_RADIUS * Math.cos(degreesToRadians(origin.latitude)))),
	};
}

export function calcBetween(alpha: LatLng, bravo: LatLng): LineBetween {
	const aLat = degreesToRadians(alpha.latitude);
	const bLat = degreesToRadians(bravo.latitude);
	const dLon = degreesToRadians(bravo.longitude) - degreesToRadians(alpha.longitude);

	function calcBearing() {
		let deg = radiansToDegrees(Math.atan2(Math.sin(dLon) * Math.cos(bLat), (Math.cos(aLat) * Math.sin(bLat)) - (Math.sin(aLat) * Math.cos(bLat) * Math.cos(dLon))));
		if(deg < 0) deg += 360;
		return deg;
	}

	function calcDistance() {
		const a = Math.cos(aLat) * Math.cos(bLat) * Math.pow(Math.sin(dLon / 2), 2) + Math.pow(Math.sin((bLat - aLat) / 2), 2);
		return EARTH_RADIUS * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
	}

	return {
		bearing: calcBearing(),
		distance: calcDistance(),
	};
}

export function GetDistance(alpha: LatLng, bravo: LatLng): number {
	const aLat = degreesToRadians(alpha.latitude);
	const bLat = degreesToRadians(bravo.latitude);
	const a = Math.cos(aLat) * Math.cos(bLat) * Math.pow(Math.sin((degreesToRadians(bravo.longitude) - degreesToRadians(alpha.longitude)) / 2), 2) + Math.pow(Math.sin((bLat - aLat) / 2), 2);
	return EARTH_RADIUS * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
