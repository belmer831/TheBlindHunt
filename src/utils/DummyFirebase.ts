import {
	coordsToString,
} from './Coords'
import { LatLng } from 'react-native-maps'

interface Callback<T> { (param: T): void }

const userChests = [
	{
		"Latitude": 47.685088,
		"Longitude": -122.392192,
		"Name": "Reed's Neighborhood",
		"Type": "Debug Location"
	},
	{
		"Latitude": 47.685063,
		"Longitude": -122.393014,
		"Name": "Reed's Neighborhood",
		"Type": "Debug Location"
	},
	{
		"Latitude": 47.685022,
		"Longitude": -122.391920,
		"Name": "Reed's Neighborhood",
		"Type": "Debug Location"
	},
	{
		"Latitude": 47.684675,
		"Longitude": -122.392016,
		"Name": "Reed's Neighborhood",
		"Type": "Debug Location"
	},
	{
		"Latitude": 47.685093,
		"Longitude": -122.388594,
		"Name": "Reed's Neighborhood",
		"Type": "Debug Location"
	},
	{
		"Latitude": 47.686674,
		"Longitude": -122.391788,
		"Name": "Reed's Neighborhood",
		"Type": "Debug Location"
	},
	{
		"Latitude": 47.686685,
		"Longitude": -122.387861,
		"Name": "Reed's Neighborhood",
		"Type": "Debug Location"
	},
	{
		"Latitude": 47.686665,
		"Longitude": -122.387362,
		"Name": "Reed's Neighborhood",
		"Type": "Debug Location"
	},
	{
		"Latitude": 47.687052,
		"Longitude": -122.387493,
		"Name": "Reed's Neighborhood",
		"Type": "Debug Location"
	},
	{
		"Latitude": 47.684871,
		"Longitude": -122.384167,
		"Name": "Reed's Neighborhood",
		"Type": "Debug Location"
	},
	{
		"Latitude": 47.684187,
		"Longitude": -122.384167,
		"Name": "Reed's Neighborhood",
		"Type": "Debug Location"
	}
]

async function delay (ms: number) {
	return new Promise<void> ((resolve, reject) => {
		setTimeout (() => {
			resolve ()
		}, ms)
	})
}

let currentCoords: LatLng | null = null
export async function updateLocation (coords: LatLng) {
	if (currentCoords) return

	currentCoords = coords
	console.log (`Current Location: ${currentCoords}`)
	await delay (5000)
	currentCoords = null
}

export function watchClosestChests (callback: Callback<LatLng[]>) {
	delay (2000)
		.then(() => {
			const list = userChests
			console.log (`Number of Chests Received: ${list.length}`)

			callback ( list.map (child => ({
				latitude: child.Latitude,
				longitude: child.Longitude,
			})))
		})
}