import React, { Component } from 'react';

import {
	GameItems,
	InventoryWatcher,
} from '../utils/Firebase';
import ItemCounts from '../components/ItemCounts';
import SimpleText from '../components/SimpleText';

interface Props { }
interface State {
	items?: GameItems;
	error?: Error;
}

export default class InventoryLogs extends Component<Props, State> {
	private readonly inventoryWatcher: InventoryWatcher;

	constructor(props: Props) {
		super(props);
		this.state = {};

		this.inventoryWatcher = new InventoryWatcher(
			(items) => this.setState({ items }),
			(error) => this.setState({ error })
		);
	}

	componentDidMount() { this.inventoryWatcher.Start(); }

	componentWillUnmount() { this.inventoryWatcher.Stop(); }

	render() {
		const {
			items,
			error,
		} = this.state;

		if(error) throw error;

		if(!items) return <SimpleText text={'Missing Items'} />;

		return (
			<ItemCounts style={{ flex: 1 }} items={items} />
		);
	}
}
