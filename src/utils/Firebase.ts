import RNFirebase, {
	RNFirebase as RNFirebaseStatic 
} from 'react-native-firebase'

export type User = RNFirebaseStatic.User
export type UserCredential = RNFirebaseStatic.UserCredential
export type UserInfo = RNFirebaseStatic.UserInfo
export type UserMetadata = RNFirebaseStatic.UserMetadata
export type AuthProvider = RNFirebaseStatic.auth.AuthProvider
export type AuthResult = RNFirebaseStatic.auth.AuthResult
export type DataSnapshot = RNFirebaseStatic.database.DataSnapshot
export type Reference = RNFirebaseStatic.database.Reference

import { LatLng } from 'react-native-maps'

export interface Callback<T> { (param: T): void }
export interface Events<T> {
	onSuccess: Callback<T>
	onError:   Callback<Error>
}

export interface GameItems {
	Coins: number,
	[key:string]: number,
}

export interface ChestContent {
	id: string,
	items: GameItems,
}

export interface ChestData extends LatLng {
	chestId: string,
}

export interface Entry<T> {
	key: string,
	val: T,
}

export function exists (thing:any) {
	return (! (! thing))
}

export function getEntries (snapshot: DataSnapshot): Entry<any>[] {
	if (! snapshot.exists()) throw new Error ("Snapshot does not exist")
	if (typeof snapshot !== 'object') throw new Error ("Snapshot is not an object")

	const values:{[key:string]:any} = snapshot.val()
	return Object.keys (values).map (key => ({
		key: key,
		val: values[key],
	}))
}

export function getCurrentUser () {
	const { currentUser } = RNFirebase.auth()
	if (! currentUser) throw new Error ("No Current User")
	return currentUser
}

export function getUserData (child?: string) {
	let data = RNFirebase.database().ref()
		.child ('UserData')
		.child (getCurrentUser().uid)

	if (child) data = data.child (child)

	return data
}

/* NOTE: Probably unnecessary
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
*/

/* NOTE: Probably unnecessary 
*/
export async function setupUserChests () {
	const snapshot = await getUserData ('Chests').once ('value')
	if (! snapshot.exists ()) {
		// TODO: I don't know why this is this way
		getUserData ('Location').remove()
	}
}
/*
*/

export async function updateLocation (coords:LatLng) {
	return getUserData ('Location').set ({
		Latitude: coords.latitude,
		Longitude: coords.longitude,
	})
}

export async function openChest (chestId: string): Promise<void> {
	const wasOpenedRef = getUserData ('Chests')
		.child (chestId)
		.child ('Properties')
		.child ('WasOpened')
	
	return wasOpenedRef.set (true)
}

export abstract class FirebaseWatcher<T> {
	onSuccess: Callback<T>
	onError:   Callback<Error>

	constructor (events: {
		onSuccess: Callback<T>
		onError:   Callback<Error>
	}) {
		this.onSuccess = events.onSuccess
		this.onError   = events.onError

		this.onChange = this.onChange.bind (this)
	}

	abstract onChange (snapshot:DataSnapshot): void
	abstract ref (): Reference

	async start () {
		this.ref().on ('value', this.onChange, (err) => this.onError(err))
	}

	async end () {
		this.ref().on ('value', this.onChange, (err) => this.onError(err))
	}
}

export class InventoryWatcher extends FirebaseWatcher<GameItems> {
	ref () {
		return getUserData ('Inventory')
	}

	onChange (snapshot: DataSnapshot) {
		try {
			let items: GameItems = {
				Coins: 0,
			}
			
			if (snapshot.exists ()) {
				const coinSnap = snapshot.child ('Coins')
				const itemsSnap = snapshot.child ('Items')

				if (coinSnap.exists()) items.Coins = coinSnap.val()
				
				getEntries (itemsSnap).forEach (entry => {
					const { key, val } = entry
					items[key] = val
				})
			}
			
			this.onSuccess (items)
		}
		catch (error) {
			this.onError (error)
		}
	}
}

export class ChestContentWatcher extends FirebaseWatcher<ChestContent> {
	ref () {
		return getUserData ('ChestContent') 
	}

	onChange (snapshot: DataSnapshot) {
		try {
			if (! snapshot.exists()) throw new Error ("No Snapshot")

			let items: GameItems = {
				Coins: 0,
			}

			const id = snapshot.child ('ChestID').val() as string
			items.Coins = snapshot.child ('Coins').val() as number

			getEntries (snapshot.child ('Items')).forEach (entry => {
				try {
					const { key, val } = entry
					items[key] = val
				}
				catch {}
			})

			this.onSuccess ({ id, items })
		}
		catch (error) {
			this.onError (error)
		}
	}
}

export class ChestDataWatcher extends FirebaseWatcher<ChestData[]> {
	ref () {
		return getUserData ('Chests')
		// return RNFirebase.database().ref().child ('Chests')
	}

	onChange (snapshot: DataSnapshot) {
		try {
			if (! snapshot.exists ()) throw new Error ("No Snapshot")
	
			const chests = getEntries (snapshot)
				.map (entry => {
					try {
						const { Latitude, Longitude } = entry.val
						return {
							chestId: entry.key,
							latitude: Latitude,
							longitude: Longitude,
						}
					}
					catch { return null }
				})
				.filter (exists) as ChestData[]
	
			this.onSuccess (chests)
		}
		catch (error) {
			this.onError (error)
		}
	}
}
