import React, { Component } from 'react';

import SimpleText from '../components/SimpleText';
import { LatLng } from 'react-native-maps';
import { ChestData } from '../utils/Firebase';

interface Props { }
interface State {
	chests?: ChestData[];
	coords?: LatLng;
	error?: Error;
}

export default class DetectorLogs extends Component<Props, State> {
	render() {
		return (
			<SimpleText text='DetectorLogs' />
		);
	}
}
