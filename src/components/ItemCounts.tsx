import _ from 'lodash';
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import SimpleText from './SimpleText';
import { GameItems } from '../utils/Firebase';

interface Props {
	style: any;
	gameItems: GameItems;
}

export default class ItemCounts extends PureComponent<Props> {
	render() {
		const {
			style,
			gameItems
		} = this.props;
		let count: number = 0;
		return (
			<View style={style}>
				<SimpleText key={`line_${count++}`} text={`Coins: ${gameItems.coins}`} />
				{_.map(gameItems.items, (value: number, key: string) => <SimpleText key={`line_${count++}`} text={`${key}: ${value}`} />)}
			</View>
		);
	}
}
