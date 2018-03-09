/* DELTA
 - Deltas are used to set the "height" of the camera in MapView.
 - The default delta when creating a Region from a LatLng.
*/
export const DELTA = 0.02

/* DETECTOR
 - Rings are measured in meters from the user.
 - The zones exist inside of these rings.
 - The center zone is not sliced.
*/
export const DETECTOR = {
	SLICES: 6,
	RINGS: {
		CENTER: 10,
		INNER: 20,
		MEDIUM: 40,
		OUTER: 100,
	},
}

export const PIESLICE = {
	COMPLETE: require ('../../assets/pie-slices/complete.png'),
	CENTER:   require ('../../assets/pie-slices/center.png'),
	SMALL:    require ('../../assets/pie-slices/small.png'),
	MEDIUM:   require ('../../assets/pie-slices/medium.png'),
	LARGE:    require ('../../assets/pie-slices/large.png'),
}