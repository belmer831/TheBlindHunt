import { StackNavigator } from 'react-navigation'

import HomeScreen   from './views/HomeScreen'
import PlacerScreen from './views/PlacerScreen'
import FinderScreen from './views/FinderScreen'
import ArtempScreen from './views/ArtempScreen'

const screens = {
	Home: {
		title: 'home',
		screen: HomeScreen,
	},
	Placer: {
		title: 'placer',
		screen: PlacerScreen,
	},
	Finder: {
		title: 'finder',
		screen: FinderScreen,
	},
	Artemp: {
		title: 'artemp',
		screen: ArtempScreen,
	},
}

const configs = {

}

export default StackNavigator (screens, configs)