import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Compass from 'react-native-simple-compass';
import { LatLng } from 'react-native-maps';
import { RADAR } from '../assets';
import SimpleText from '../components/SimpleText';
import ClearButton from '../components/ClearButton';
import { calcBetween } from '../utils/Coords';
import LocationWatcher, { CurrentLocation } from '../utils/Location';
import { findZone, RINGS, ZoneData } from '../utils/Zones';
import CompositeImage, { ImageSourceStyle } from '../components/CompositeImage';
import { ChestDataWatcher, ChestData } from '../utils/Firebase';
import MapGrid from '../components/MapGrid';
import { Dictionary } from 'lodash';
import _ from 'lodash';
import { User } from '../utils/User';

const THIN_RED = 'rgba(243,53,6,0.5)';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black',
	},
	middle: {
		flex: 6,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	overlay: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	pieslice: {
		flex: 1,
		flexDirection: 'column',
		width: width,
		height: width,
		resizeMode: 'contain',
	},
	bottom: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 40,
	},
});
interface ProChest extends ChestData {
	bearing: number;
	distance: number;
	zone: ZoneData;
}
interface Props { }
interface State {
	facing: number;
	coords?: LatLng;
	chests?: Dictionary<ChestData>;
	error?: Error;
}

export function processChests(chests: Dictionary<ChestData>, coords: LatLng) {
	return _.map(chests, (chest) => {
		const { bearing, distance } = calcBetween(coords, chest);
		const zone = findZone(bearing, distance);
		return { bearing, distance, zone, ...chest };
	}).filter((chest) => (chest.zone !== null)) as ProChest[];
}

export default class Detector extends Component<Props, State> {
	mOrigin: any;
	private readonly chestsWatcher: ChestDataWatcher;
	private readonly locationWatcher: LocationWatcher;

	public constructor(props: Props) {
		super(props);

		this.locationWatcher = new LocationWatcher(
			({ coords }) => {
				this.setState({ coords });
				User.UpdateLocation(coords).catch((error: Error) => this.setState({ error }));
			},
			(error) => this.setState({ error })
		);

		this.chestsWatcher = new ChestDataWatcher(
			(chests) => this.setState({ chests }),
			(error) => this.setState({ error })
		);

		this.state = { facing: 0 };
		this.GetOrigin();
	}

	private async GetOrigin() {
		this.mOrigin = (await CurrentLocation()).coords;
	}

	public componentDidMount() {
		this.locationWatcher.Start();
		this.chestsWatcher.Start();
		Compass.start(3, facing => this.setState({ facing: (-1 * facing) }));
	}

	public componentWillUnmount() {
		this.locationWatcher.Stop();
		this.chestsWatcher.Stop();
		Compass.stop();
	}

	public render() {
		const {
			coords,
			facing,
			chests,
			error,
		} = this.state;

		if(error) {
			setTimeout(() => this.setState({ error: undefined }), 2000);
			return <SimpleText text={error.message} />;
		}

		if(!(chests && chests.length)) return <SimpleText text={'Missing Chests'} />;

		if(!coords) return <SimpleText text={'Missing Coords'} />;

		let centerChestId: string | undefined;

		const zones: ImageSourceStyle[] = processChests(chests, coords).map(chest => {
			const { source, rotation } = chest.zone;
			if(source === RADAR.CENTER) centerChestId = chest.chestId;
			const style = {
				tintColor: THIN_RED,
				transform: [{ rotateZ: `${(rotation + facing)}deg` }]
			};
			return { source, style };
		});

		[RADAR.ARROW, RADAR.FRAME].forEach(src => {
			zones.unshift({
				source: src,
				style: { transform: [{ rotateZ: `${facing}deg` }] }
			});
		});

		return (
			<View style={styles.container}>
				<MapGrid origin={this.mOrigin} radius={RINGS.LARGE} />
				<CompositeImage style={styles.middle} wrapperStyle={styles.overlay} imageStyle={styles.pieslice} images={zones} />
				<View style={styles.bottom}>
					{(centerChestId) ?
						<ClearButton text={'Scan'} onPress={() => Actions.Scanner({ centerChestId })} />
						:
						undefined
					}
				</View>
			</View>
		);
	}
}
