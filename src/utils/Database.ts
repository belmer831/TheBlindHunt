import firebase, { RNFirebase } from 'react-native-firebase';

export type DataSnapshot = RNFirebase.database.DataSnapshot;
export type Reference = RNFirebase.database.Reference;

export function Database(path?: string): Reference { return firebase.database().ref(path); }
