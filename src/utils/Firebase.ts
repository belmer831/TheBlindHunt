import RNFirebase, {
	RNFirebase as RNFirebaseStatic 
} from 'react-native-firebase'

export type User           = RNFirebaseStatic.User
export type UserCredential = RNFirebaseStatic.UserCredential
export type UserInfo       = RNFirebaseStatic.UserInfo
export type UserMetadata   = RNFirebaseStatic.UserMetadata
export type AuthProvider   = RNFirebaseStatic.auth.AuthProvider
export type AuthResult     = RNFirebaseStatic.auth.AuthResult
export type DataSnapshot   = RNFirebaseStatic.database.DataSnapshot

import { LatLng } from 'react-native-maps'

interface Callback<T> { (param: T): void }

export interface GameItems {
	Coins: number,
	[key:string]: number,
}

class InventoryWatcher {
	// TODO
}

/* Chests Watcher
 - Gets the user's ten closest chests

export default class ChestsWatcher {

	onSuccess: Callback<Chest[]>
	onError:   Callback<Error>

	constructor (events: {
		onSuccess: Callback<Chest[]>
		onError:   Callback<Error>
	}) {
		this.onSuccess = events.onSuccess
		this.onError   = events.onError

		// I need the same function pointer when turning on and off the callback.
		this.onResponse = this.onResponse.bind (this)
	}

	private onResponse (snap: DataSnapshot) {
		
	}

	isRunning () {
		
	}

	start () {

	}

	end () {

	}
}
*/

function exists (thing:any) {
	return (! (! thing))
}
/*
function snapshotToList (snapshot: DataSnapshot) {
	let list:any[] = []

	snapshot.forEach (child => {
		if (child) list.push (child)
		return exists (child)
	})

	return ( list
		.map (child => child.val())
		.filter (child => exists (child))
	)
}
*/
interface Entry<T> {
	key: string,
	val: T,
}
function getEntries (snapshot: DataSnapshot): Entry<any>[] {
	const values:{[key:string]:any} = snapshot.val()
	return Object.keys (values).map (key => ({
		key: key,
		val: values[key]
	}))
}

function getCurrentUser () {
	const { currentUser } = RNFirebase.auth()
	if (! currentUser) throw new Error ("No Current User")
	return currentUser
}

function getUserData (child?: string) {
	let data = RNFirebase.database().ref()
		.child ('UserData')
		.child (getCurrentUser().uid)

	if (child) data = data.child (child)

	return data
}

export async function ensureRegistration () {
	const currentUser = getCurrentUser()
	const userRef = RNFirebase.database().ref()
		.child ('Users')
		.child (currentUser.uid)
	
	const userSnap = await userRef.once ('value')
	if (! userSnap.exists ()) {
		await userRef.set ({
			Email: currentUser.email,
			Name:  currentUser.displayName,
		})
	}
}

// TODO: Refractor all this code

export async function setupUserChests () {
	const snapshot = await getUserData ('Chests').once ('value')
	if (! snapshot.exists ()) {
		// TODO: I don't know why this is this way
		getUserData ('Location').remove()
	}
}

export async function updateLocation (coords:LatLng) {
	return ( getUserData ('Location').set ({
		Latitude: coords.latitude,
		Longitude: coords.longitude,
	}))
}

export async function openChest (chestId: string) {
	return ( getUserData ('Chests')
		.child (chestId)
		.child ('Properties')
		.child ('WasOpened')
		.set (true)
	)
}

export function watchInventory (callback: Callback<GameItems>) {
	return getUserData ('Inventory').on ('value', (snapshot) => {
		if (snapshot.exists ()) {
			let items:GameItems = {
				Coins: 0
			}

			const coinSnap = snapshot.child ('Coins')
			if (coinSnap.exists()) items.Coins = coinSnap.val()

			getEntries (snapshot.child ('Items')).forEach (entry => {
				try {
					const name = entry.val.Item.Name as string
					const count = entry.val.Count as number
					items[name] = count
				}
				catch {}
			})

			callback (items)
		}
	})
}

// TODO
export function watchChestContents (callback: Callback<GameItems>) {
	return getUserData ('ChestContent').on ('value', (snapshot) => {
		if (snapshot.exists ()) {
			let items:GameItems = {
				Coins: 0,
			}

			items.Coins = snapshot.child ('Coins').val() as number
			getEntries (snapshot.child ('ItemNames')).forEach (entry => {
				try {
					const name = entry.val
					items[name] += 1
				}
				catch {}
			})
			callback (items)
		}
	})
}

// TODO: Use closest chests and use child_added/child_removed
export function watchClosestChests (callback: Callback<LatLng[]>) {
	return getUserData ('Chests').on ('value', (snapshot) => {
		if (snapshot.exists ()) {
			console.log (`Number of Chests Received: ${snapshot.numChildren()}`)

			const chests = getEntries (snapshot)
				.map (entry => {
					try {
						const { Latitude, Longitude } = entry.val
						return {
							key: entry.key,
							latitude: Latitude,
							longitude: Longitude,
						}
					}
					catch { return null }
				})
				.filter (exists) as LatLng[]

			callback (chests)
		}
	})
}