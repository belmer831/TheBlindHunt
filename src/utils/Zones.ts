/* Zones
 - Representation of the user location in the zones for the detector experience.
 - The values in Rings correlate with the relative sizes of the pieslices - Scalar converts those relative sizes into real world distances (in meters)
*/

import { RADAR } from '../config/Assets'
import { ImageRequireSource } from 'react-native';

const SCALAR = 10
const RINGS = {
	CENTER:  2 * SCALAR,
	SMALL:   5 * SCALAR,
	MEDIUM:  9 * SCALAR,
	LARGE:  14 * SCALAR,
	OUTER:  24 * SCALAR,
}

export interface ZoneData {
	source: ImageRequireSource,
	rotation: number,
}

export function findZone (bearing: number, distance: number): ZoneData | null {
	let source

	if (distance <= RINGS.OUTER)  source = RADAR.OUTER
	if (distance <= RINGS.LARGE)  source = RADAR.LARGE
	if (distance <= RINGS.MEDIUM) source = RADAR.MEDIUM
	if (distance <= RINGS.SMALL)  source = RADAR.SMALL
	if (distance <= RINGS.CENTER) source = RADAR.CENTER
	
	if (! source) return null

	const rotation = 90 * Math.floor (bearing / 90)

	return { source, rotation }
}