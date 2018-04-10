import React, { Component } from 'react';
import {
	View,
	StyleSheet,
} from 'react-native';

import { ChestContentWatcher, GameItems } from '../utils/Firebase';

import ItemCounts from '../components/ItemCounts';
import SimpleText from '../components/SimpleText';
import { User } from '../utils/User';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black',
	}
});

interface Props {
	chestId: string;
}
interface State {
	content?: GameItems;
	error?: Error;
}

/* TODO:
	- Currently gives a warning for using setState when unmounted or something.
*/
export default class Scanner extends Component<Props, State> {
	private readonly contentWatcher: ChestContentWatcher;

	constructor(props: Props) {
		super(props);
		this.state = {};
		this.contentWatcher = new ChestContentWatcher(
			(content) => this.setState({ content }),
			(error) => this.setState({ error })
		);
	}

	async onMount() {
		await User.OpenChest(this.props.chestId);
		await this.contentWatcher.Start();
	}

	componentDidMount() {
		this.onMount()
			.catch(error => this.setState({ error }));
	}

	componentWillUnmount() {
		this.contentWatcher.Stop();
	}

	render() {
		const {
			content,
			error,
		} = this.state;

		if(error) {
			setInterval(() => this.setState({
				error: undefined
			}), 2000);
		}

		if(!content) return (
			<SimpleText text={'Chest Unopened'} />
		);

		const message = `Chest ${(content) ? 'Opened' : 'Unopened'}`;

		return (
			<View style={styles.container}>
				<SimpleText text={message} />
				<ItemCounts
					style={{ flex: 6 }}
					gameItems={content}
				/>
			</View>
		);
	}
}
