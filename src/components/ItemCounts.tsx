import React, { PureComponent } from 'react';
import { View } from 'react-native';
import SimpleText from './SimpleText';
import { GameItems } from '../utils/Firebase';

const itemNames = [
	'Coins',
	'Crown',
	'Diamond',
	'Necklace',
	'Ring',
	'Amulet',
];

interface Props {
	style: any;
	items: GameItems;
}

export default class ItemCounts extends PureComponent<Props> {
	render() {
		const {
			style,
			items
		} = this.props;
		return (
			<View style={style}>
				{itemNames.map((name: string, index: number) => <SimpleText key={`line_${index}`} text={`${name}: ${items[name] || 0}`} />)}
			</View>
		);
	}
}
