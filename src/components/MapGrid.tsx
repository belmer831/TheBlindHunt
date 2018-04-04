import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import SquareImage from './SquareImage';
import { TILE } from '../assets';
import { LatLng } from 'react-native-maps';
import LocationWatcher from '../utils/Location';
import { GetDistance } from '../utils/Coords';

interface Props {
	origin: LatLng;
	radius: number;
}

interface State {
	loc: LatLng;
	error?: Error;
}

export default class MapGrid extends Component<Props, State> {
	private mMinSideSize: number;

	private MaxSideSize: number;

	private mMetersPerPixel: number;

	private mLocationWatcher: LocationWatcher;

	public constructor(props: Props) {
		super(props);
		this.state = { loc: props.origin };
		this.mLocationWatcher = new LocationWatcher(
			({ coords }) => this.setState({ loc: coords }),
			(error) => this.setState({ error })
		);
		const { height, width } = Dimensions.get('window');
		this.mMinSideSize = Math.min(height, width);
		this.MaxSideSize = Math.max(height, width);
		this.mMetersPerPixel = this.props.radius / (this.mMinSideSize / 2);
	}

	public componentWillMount(): void { this.mLocationWatcher.Start(); }

	public componentWillUnmount(): void { this.mLocationWatcher.Stop(); }

	public render() {
		const { origin } = this.props;
		const { loc } = this.state;
		const step: number = 50 / this.mMetersPerPixel;
		console.log(`step:${step}`);
		const margin: number = 2 * step;
		const min: number = -margin;
		console.log(`min:${min}`);
		const max: number = this.MaxSideSize + margin;
		console.log(`max:${max}`);
		const offsetTop: number = (GetDistance({ latitude: origin.latitude, longitude: 0 }, { latitude: loc.latitude, longitude: 0 }) / this.mMetersPerPixel) % step;
		console.log(`offsetTop:${offsetTop}`);
		const offsetLeft: number = (GetDistance({ latitude: 0, longitude: origin.longitude }, { latitude: 0, longitude: loc.longitude }) / this.mMetersPerPixel) % step;
		console.log(`offsetLeft:${offsetLeft}`);
		let tiles: { top: number, left: number }[] = [];
		for(let top = min; top < max; top += step)
			for(let left = min; left < max; left += step)
				tiles.push({ top: top + offsetTop, left: left + offsetLeft });
		return tiles.map(tile => <SquareImage key={`r_${tile.top}_c_${tile.left}`} source={TILE} top={tile.top} left={tile.left} size={step} />);
	}
}
