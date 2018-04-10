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

// TODO: Enumerate items
// TODO: Possibly refractor so coins are seperate from other items
export interface GameItems {
	coins: number,
	[key: string]: number,
}

export interface ChestContent {
	id: string,
	items: GameItems,
}

export interface ChestData extends LatLng {
	id: string,
}

export interface Entry<T> {
	key: string,
	val: T,
}

export function exists (thing:any) {
	return (! (! thing))
}

// TODO: Clean Up?
export function getEntries (snapshot: DataSnapshot): Entry<any>[] {
	if (! snapshot.exists()) throw new Error ("Snapshot does not exist")
	if (typeof snapshot !== 'object') throw new Error ("Snapshot is not an object")

	const values:{[key:string]:any} = snapshot.val()
	return Object.keys (values).map (key => ({
		key: key,
		val: values[key],
	}))
}

/* Find Current User
	- Returns the database reference for the current user.
*/
export function findCurrentUser () {

	const { currentUser } = RNFirebase.auth()
	if (! currentUser) throw new Error ("No Current User")

	let data = RNFirebase.database().ref()
		.child ('Users')
		.child (currentUser.uid)

	return data
}

/* Update Location
	- Sets current user's location to the provided coordinates.
*/
export async function updateLocation (coords: LatLng): Promise<void> {
	return findCurrentUser().child ('location').set ({
		latitude: coords.latitude,
		longitude: coords.longitude,
	})
}

/* Open Chest
	- 
*/
export async function openChest (chestId: string): Promise<void> {
	const wasOpenedRef = findCurrentUser().child ('chests')
		.child (chestId)
		.child ('properties')
		.child ('wasOpened')
	
	return wasOpenedRef.set (true)
}

/* Abstract Firebase Watcher
	- Template for all Firebase database watchers.
	- onSuccess: The callback for a successful update and processing from the database.
	- onError: The callback if an error is encountered anywhere in the class.
	- onChange: is used to process the snapshot into a known format. It also acts as the ID for the listener.
	- ref: The path to the node reference in the RNRF database.
	- start: Async call to start the watcher.
	- end: Async call to end the watcher.
*/
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

	abstract onChange (snapshot: DataSnapshot): void
	abstract ref (): Reference

	async start () {
		this.ref().on ('value', this.onChange, (err) => this.onError(err))
	}

	// TODO: This is causing a warning when switching away from a component that calls with before unmounting.
	async end () {
		this.ref().on ('value', this.onChange, (err) => this.onError(err))
	}
}

/* Inventory Watcher
	- Watches the user's inventory and returns a map of item names to the amount the user has of that item.
*/
export class InventoryWatcher extends FirebaseWatcher<GameItems> {
	
	ref () {
		return findCurrentUser().child ('inventory')
	}

	// TODO: Fix for database changes
	onChange (snapshot: DataSnapshot) {
		try {
			let items: GameItems = {
				coins: 0,
			}
			
			if (snapshot.exists ()) {
				const coinSnap = snapshot.child ('coins')
				const itemsSnap = snapshot.child ('items')

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

export class ChestContentWatcher extends FirebaseWatcher<GameItems> {
	
	ref () {
		return findCurrentUser().child ('chestContent') 
	}

	// TODO: Fix for database changes
	onChange (snapshot: DataSnapshot) {
		try {
			if (! snapshot.exists()) throw new Error ("No Snapshot")

			let items: GameItems = {
				coins: 0,
			}

			// TODO: Should there be an id in chestContent
			// const id = snapshot.child ('ChestID').val() as string

			items.coins = snapshot.child ('coins').val() as number

			getEntries (snapshot.child ('items')).forEach (entry => {
				try {
					const { key, val } = entry
					items[key] = val
				}
				catch {}
			})

			this.onSuccess (items)
		}
		catch (error) {
			this.onError (error)
		}
	}
}

export class ChestDataWatcher extends FirebaseWatcher<ChestData[]> {
	
	// TODO: Fix for database changes
	// NOTE: Temporary workaround using all chests
	ref () {
		return findCurrentUser().child ('chests')
	}

	onChange (snapshot: DataSnapshot) {
		try {
			if (! snapshot.exists ()) throw new Error ("No Snapshot")
	
			const chests = getEntries (snapshot)
				.map (entry => {
					try {
						const id = entry.key
						const { latitude, longitude } = entry.val
						return { id, latitude, longitude }
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
