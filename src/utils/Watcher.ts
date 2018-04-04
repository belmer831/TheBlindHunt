export type Callback<T> = (param: T) => void;

export default abstract class Watcher<T>{
	public constructor(protected OnSuccess: Callback<T>, protected OnFailure: Callback<Error>) { }
	public abstract async Start(): Promise<void>;
	public abstract async Stop(): Promise<void>;
}
