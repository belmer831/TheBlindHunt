import React, { Component } from 'react'
import {
	Text,
	View,
	StyleSheet,
	FlatList,
	Dimensions,
	Image,
	ImageRequireSource,
	TouchableOpacity,
	Animated,
	PanResponder,
	PanResponderInstance,
} from 'react-native'

import { Actions } from 'react-native-router-flux'

import SimpleText from '../components/SimpleText'

import { ITEMS } from '../config/Assets'
import {
	InventoryWatcher,
	GameItems,
	Entry,
} from '../utils/Firebase'

const WINDOW_HEIGHT = Dimensions.get('window').height
const WINDOW_WIDTH  = Dimensions.get('window').width
const SIZE = WINDOW_WIDTH / 5

interface GameItemEntry {
	key:  string,
	val?: ImageRequireSource,
}

interface Props {}
interface State {
	drag?: {
		item: GameItemEntry,
		position: Animated.ValueXY,

	}
	coins?: number,
	items?: GameItemEntry[],
	error?: Error,
}

const styles = StyleSheet.create ({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'black',
		paddingTop:    WINDOW_HEIGHT / 8,
		paddingBottom: WINDOW_HEIGHT / 8,
		paddingLeft:   WINDOW_WIDTH  / 8,
		paddingRight:  WINDOW_WIDTH  / 8,
	},
	listOuter: {
		flex: 6,
	},
	listInner: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	tile: {
		position: 'relative',
		height: SIZE,
		width:  SIZE,
		margin:  SIZE / 10,
		padding: SIZE / 10,
		borderRadius: SIZE / 10,
		borderWidth: 5,
		borderColor: 'lightgrey',
		alignItems:     'center',
		justifyContent: 'center',
		backgroundColor: 'whitesmoke',
	},
	row: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	rowTile: {
		flex: 1,
		flexDirection: 'row',

		height: SIZE,
		width: SIZE * 3,

		borderRadius: SIZE / 10,
		borderWidth: 5,
		borderColor: 'lightgrey',

		alignItems:     'center',
		justifyContent: 'center',
		backgroundColor: 'whitesmoke',
	},
	text: {
		flex: 2,
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: 24,
	},
	image: {
		flex: 1,
		alignSelf: 'center',
		height: SIZE * 7 / 10,
		width:  SIZE * 7 / 10,
		tintColor: 'teal'
	},
})

function findItemImage (name: string): ImageRequireSource | null {
	switch (name) {
		case 'Amulet':   return ITEMS.AMULET
		case 'Crown':    return ITEMS.CROWN
		case 'Diamond':  return ITEMS.DIAMOND
		case 'Necklace': return ITEMS.NECKLACE
		case 'Ring':     return ITEMS.RING
	}

	return null
}

export default class Inventory extends Component<Props, State> {
	private readonly inventoryWatcher: InventoryWatcher

	constructor (props: Props) {
		super (props)
		this.state = {}

		this.inventoryWatcher = new InventoryWatcher ({
			onSuccess: (items) => this.onInventoryChange (items),
			onError:   (error) => this.setState ({ error }),
		})
	}

	onInventoryChange (gameItems: GameItems) {
		let items: GameItemEntry[] = []

		items = Object.keys (gameItems)
			.filter (key => (key !== 'Coins'))
			.map (key => ({
				key, 
				val: gameItems[key]
			}))
			.reduce ((list, entry) => {
				for (let i = 0; i < entry.val; i++) {
					const key = `${entry.key}_${i}`
					const val = findItemImage (entry.key)
					if (val) list.push ({ key, val })
				}
				return list
			}, [] as Entry<ImageRequireSource>[])
		
		let idx = 0
		while (items.length < 9) items.push ({
			key: `empty_${idx++}`
		})

		if (items.length > 9) items = items.slice (0, 9)

		this.setState ({ coins: gameItems.Coins })
		this.setState ({ items })
	}

	componentDidMount () {
		this.inventoryWatcher.start()
	}

	componentWillUnmount () {
		this.inventoryWatcher.end()
	}

	toDetector () {
		Actions.Detector()
	}

	render () {
		const {
			coins,
			items,
			error,
		} = this.state

		if (error) {
			setInterval (() => this.setState ({ 
				error: undefined 
			}), 2000)
			return <SimpleText text={error.message} />
		}

		if (! items) return (
			<SimpleText text='Missing Items' />
		)

		return (
			<View style={styles.container}>
				<View style={styles.row}>
					<View style={styles.rowTile}>
						<Image 
							style={styles.image}
							source={ITEMS.COIN}
							resizeMode='contain'
						/>
						<Text style={styles.text}>
							{ coins }
						</Text>
					</View>
				</View>

				<View style={styles.listOuter}>
					<FlatList
						contentContainerStyle={styles.listInner}
						data={items}
						keyExtractor={entry => entry.key}
						numColumns={3}
						renderItem={ ({ item }) =>
							<View style={styles.tile}>
								{ (item.val) ?
									<Image
										style={styles.image}
										source={item.val}
										resizeMode='contain'
									/>
									:
									undefined
								}
							</View>
						}
					/>
				</View>
				
				<View style={styles.row}>
					<TouchableOpacity
						style={styles.rowTile}
						onPress={() => this.toDetector()}
					>
						<Text style={styles.text}>
							Detector
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}