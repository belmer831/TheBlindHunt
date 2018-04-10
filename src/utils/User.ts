import firebase, { RNFirebase } from 'react-native-firebase';
import { Reference, Database } from './Database';
import { LatLng } from 'react-native-maps';

type RNFUser = RNFirebase.User;

export class User {
	private static get CurrentUser(): RNFUser {
		const { currentUser } = firebase.auth();
		if(!currentUser) throw new Error('No Current User');
		return currentUser;
	}

	public static get Ref() { return Database(`Users/${this.CurrentUser.uid}`); }

	public static Data(path?: string): Reference { return this.Ref.child('data' + path ? `/${path}` : ''); }

	public static async UpdateLocation(location: LatLng): Promise<void> { return this.Data('location').set(location); }

	public static async OpenChest(chestId: string): Promise<void> { return this.Data(`chests/${chestId}/properties/wasOpened`).set(true); }

}
