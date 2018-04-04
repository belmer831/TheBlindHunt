/* Zones
 - Representation of the user location in the zones for the detector experience.
 - The values in Rings correlate with the relative sizes of the pieslices - Scalar converts those relative sizes into real world distances (in meters)
*/

import { RADAR } from '../assets';
import { ImageRequireSource } from 'react-native';

export const SCALAR = 10;
export const RINGS = {
	CENTER: 1 * SCALAR,
	SMALL: 5 * SCALAR,
	MEDIUM: 10 * SCALAR,
	LARGE: 15 * SCALAR,
	OUTER: 30 * SCALAR,
};

export enum ZoneRing {
	Center,
	Small,
	Medium,
	Large,
	Outer,
}

export interface ZoneData {
	source: ImageRequireSource;
	rotation: number;
}

export interface ZoneInfo {
	ring: ZoneRing;
	turn: number;
}

/*function toZoneRing(distance: number) {
	if(distance <= RINGS.CENTER) return ZoneRing.Center;
	if(distance <= RINGS.SMALL) return ZoneRing.Small;
	if(distance <= RINGS.MEDIUM) return ZoneRing.Medium;
	if(distance <= RINGS.LARGE) return ZoneRing.Large;
	if(distance <= RINGS.OUTER) return ZoneRing.Outer;

	return null;
}*/

/*function toZoneInfo(bearing: number, distance: number): ZoneInfo | null {
	const turn = Math.ceil(bearing / 90);
	const ring = toZoneRing(distance);

	if(ring) return { ring, turn };
	else return null;
}*/

export function findZone(bearing: number, distance: number): ZoneData | null {
	let source;

	if(distance <= RINGS.OUTER) source = RADAR.OUTER;
	if(distance <= RINGS.LARGE) source = RADAR.LARGE;
	if(distance <= RINGS.MEDIUM) source = RADAR.MEDIUM;
	if(distance <= RINGS.SMALL) source = RADAR.SMALL;
	if(distance <= RINGS.CENTER) source = RADAR.CENTER;

	if(!source) return null;

	const rotation = 90 * Math.ceil(bearing / 90);

	return { source, rotation };
}
