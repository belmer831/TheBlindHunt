import React, { Component } from 'react'
import { NavigationScreenProps } from 'react-navigation'

import SimpleText from '../components/SimpleText'

type Props = NavigationScreenProps<{}>

export default (props:Props) => (
	<SimpleText text={"TODO: AR Screen"} />
)