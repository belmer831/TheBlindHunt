export type Callback<T> = (param: T) => void;

export default abstract class Watcher<T>{
	public constructor(protected OnSuccess: Callback<T>, protected OnFailure: Callback<Error>) { }
	public async abstract Start(): Promise<void>;
	public async abstract Stop(): Promise<void>;
}
