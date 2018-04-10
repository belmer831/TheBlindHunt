import { LatLng } from 'react-native-maps';
import Watcher from './Watcher';
import { Reference, DataSnapshot } from './Database';
import { User } from './User';
import { Dictionary } from 'lodash';

export interface GameItems {
	coins: number;
	items: Dictionary<number>;
}

export interface ChestData extends LatLng {
	chestId: string;
}

abstract class FirebaseWatcher<T> extends Watcher<T> {
	protected abstract Ref: Reference;

	protected abstract OnChange(data: DataSnapshot): void;

	public async Start() { this.Ref.on('value', this.OnChange, this.OnFailure); }

	public async Stop() { this.Ref.off('value', this.OnChange); }
}

export class InventoryWatcher extends FirebaseWatcher<GameItems> {
	protected Ref: Reference = User.Data('inventory');

	protected OnChange(snapshot: DataSnapshot) {
		try { this.OnSuccess(snapshot.exists() ? snapshot.val() : { coins: 0, items: {} }); }
		catch(error) { this.OnFailure(error); }
	}
}

export class ChestContentWatcher extends FirebaseWatcher<GameItems> {
	protected Ref: Reference = User.Data('chestContent');

	OnChange(snapshot: DataSnapshot) {
		try { this.OnSuccess(snapshot.exists() ? snapshot.val() : { coins: 0, items: {} }); }
		catch(error) { this.OnFailure(error); }
	}
}

export class ChestDataWatcher extends FirebaseWatcher<Dictionary<ChestData>> {
	protected Ref: Reference = User.Data('chests');

	OnChange(snapshot: DataSnapshot) {
		try {
			if(!snapshot.exists()) throw new Error('No Snapshot');
			this.OnSuccess(snapshot.val());
		}
		catch(error) { this.OnFailure(error); }
	}
}
