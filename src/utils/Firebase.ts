import firebase, { RNFirebase } from 'react-native-firebase';

export type User = RNFirebase.User;
export type UserCredential = RNFirebase.UserCredential;
export type UserInfo = RNFirebase.UserInfo;
export type UserMetadata = RNFirebase.UserMetadata;
export type AuthProvider = RNFirebase.auth.AuthProvider;
export type AuthResult = RNFirebase.auth.AuthResult;
export type DataSnapshot = RNFirebase.database.DataSnapshot;
export type Reference = RNFirebase.database.Reference;

import { LatLng } from 'react-native-maps';
import Watcher, { Callback } from './Watcher';

export interface GameItems {
	Coins: number;
	[key: string]: number;
}

export interface ChestContent {
	id: string;
	items: GameItems;
}

export interface ChestData extends LatLng {
	chestId: string;
}

export interface Entry<T> {
	key: string;
	val: T;
}

export function exists(thing: any) { return (!(!thing)); }

export function getEntries(snapshot: DataSnapshot): Entry<any>[] {
	if(!snapshot.exists()) throw new Error('Snapshot does not exist');
	if(typeof snapshot !== 'object') throw new Error('Snapshot is not an object');

	const values: { [key: string]: any } = snapshot.val();
	return Object.keys(values).map(key => ({
		key: key,
		val: values[key],
	}));
}

export function getCurrentUser() {
	const { currentUser } = firebase.auth();
	if(!currentUser) throw new Error('No Current User');
	return currentUser;
}

export function getUserData(child?: string) {
	let data = firebase.database().ref()
		.child('UserData')
		.child(getCurrentUser().uid);

	if(child) data = data.child(child);

	return data;
}

export async function ensureRegistration() {
	const currentUser = getCurrentUser();
	const userRef = firebase.database().ref()
		.child('Users')
		.child(currentUser.uid);

	const userSnap = await userRef.once('value');
	if(!userSnap.exists()) {
		await userRef.set({
			Email: currentUser.email,
			Name: currentUser.displayName,
		});
	}
}

export async function updateLocation(coords: LatLng) {
	return getUserData('Location').set({
		Latitude: coords.latitude,
		Longitude: coords.longitude,
	});
}

export async function openChest(chestId: string): Promise<void> {
	const wasOpenedRef = getUserData('Chests')
		.child(chestId)
		.child('Properties')
		.child('WasOpened');

	return wasOpenedRef.set(true);
}

abstract class FirebaseWatcher<T> extends Watcher<T> {
	protected abstract Ref: Reference;

	public constructor(OnSuccess: Callback<T>, OnFailure: Callback<Error>) {
		super(OnSuccess, OnFailure);
		this.OnChange = this.OnChange.bind(this);
	}

	protected abstract OnChange(data: DataSnapshot): void;

	public async Start() { this.Ref.on('value', this.OnChange, (err) => this.OnFailure(err)); }

	public async Stop() { this.Ref.off('value', this.OnChange); }
}

export class InventoryWatcher extends FirebaseWatcher<GameItems> {
	protected Ref: Reference = getUserData('Inventory');

	protected OnChange(snapshot: DataSnapshot) {
		try {
			let items: GameItems = {
				Coins: 0,
			};

			if(snapshot.exists()) {
				const coinSnap = snapshot.child('Coins');
				const itemsSnap = snapshot.child('Items');

				if(coinSnap.exists()) items.Coins = coinSnap.val();

				// TODO: Fix itemsSnap.exists() is false
				if(itemsSnap.exists()) {
					getEntries(itemsSnap).forEach(entry => {
						try {
							const name = entry.val.Item.Name as string;
							const count = entry.val.Count as number;
							items[name] = count;
						}
						catch(error) { }
					});
				}
			}

			this.OnSuccess(items);
		}
		catch(error) { this.OnFailure(error); }
	}
}

export class ChestContentWatcher extends FirebaseWatcher<ChestContent> {
	protected Ref: Reference = getUserData('ChestContent');

	OnChange(snapshot: DataSnapshot) {
		try {
			if(!snapshot.exists()) throw new Error('No Snapshot');

			let items: GameItems = {
				Coins: 0,
			};

			const id = snapshot.child('ChestID').val() as string;
			items.Coins = snapshot.child('Coins').val() as number;

			getEntries(snapshot.child('ItemNames')).forEach(entry => {
				try {
					const name = entry.val;
					items[name] += 1;
				}
				catch(error) { }
			});

			this.OnSuccess({ id, items });
		}
		catch(error) { this.OnFailure(error); }
	}
}

export class ChestDataWatcher extends FirebaseWatcher<ChestData[]> {
	protected Ref: Reference = getUserData('Chests');

	OnChange(snapshot: DataSnapshot) {
		try {
			if(!snapshot.exists()) throw new Error('No Snapshot');

			const chests = getEntries(snapshot)
				.map(entry => {
					try {
						const { Latitude, Longitude } = entry.val;
						return {
							chestId: entry.key,
							latitude: Latitude,
							longitude: Longitude,
						};
					}
					catch(error) { return null; }
				})
				.filter(exists) as ChestData[];

			this.OnSuccess(chests);
		}
		catch(error) { this.OnFailure(error); }
	}
}
