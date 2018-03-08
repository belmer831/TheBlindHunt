import { 
	StackNavigator,
	NavigationRouteConfigMap
} from 'react-navigation'

import HomeScreen   from './views/HomeScreen'
import PlacerScreen from './views/PlacerScreen'
import FinderScreen from './views/FinderScreen'
import ArtempScreen from './views/ArtempScreen'

// TODO: Was getting a type warning here, react-navigation may have changed.
const screens:any = {
	Home:   { screen: HomeScreen },
	Placer: { screen: PlacerScreen },
	Finder: { screen: FinderScreen },
	Artemp: { screen: ArtempScreen },
}

// const configs = {}

export default StackNavigator (screens)