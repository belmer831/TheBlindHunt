/* Zones
 - Representation of the user location in the zones for the detector experience.
 - The values in Rings correlate with the relative sizes of the pieslices - Scalar converts those relative sizes into real world distances (in meters)
*/

import { PIESLICES } from '../config/Assets'
import { ImageRequireSource } from 'react-native';

const SCALAR = 10
const RINGS = {
	CENTER: 1 * SCALAR,
	INNER:  2 * SCALAR,
	MEDIUM: 4 * SCALAR,
	OUTER: 10 * SCALAR,
}

export interface ZoneData {
	source: ImageRequireSource,
	rotation: number,
}

export function findZone (bearing: number, distance: number): ZoneData | null {
	let source
	
	if (distance <= RINGS.OUTER)  source = PIESLICES.LARGE
	if (distance <= RINGS.MEDIUM) source = PIESLICES.MEDIUM
	if (distance <= RINGS.INNER)  source = PIESLICES.SMALL
	if (distance <= RINGS.CENTER) source = PIESLICES.CENTER
	
	if (! source) return null

	const rotation = 60 * Math.floor (bearing / 60)

	return { source, rotation }
}