import React, { Component } from 'react'

import {
	Image,
	ImageRequireSource,
	StyleSheet,
	View,
	ImageStyle,
	ViewStyle,
} from 'react-native'

interface PositionedViewStyle extends ViewStyle {
	position: 'absolute',
	top: number,
	bottom: number,
	left: number,
	right: number,
}

interface SizedImageStyle extends ImageStyle {
	width: number,
	height: number,
}

export interface ImageSourceStyle {
	source: ImageRequireSource,
	style:  ImageStyle,
}

interface Props {
	style: ViewStyle,
	wrapperStyle: any, // PositionedViewStyle,
	imageStyle: any, // SizedImageStyle,
	images: ImageSourceStyle[],
}

export default class CompositeImage extends Component<Props> {
	
	render () {
		let count = 0
		return (
			<View style={this.props.style}>
				{ this.props.images.map (image => (
					<View key={`img_${++count}`}
						style={this.props.wrapperStyle}>
						<Image
							style={[this.props.imageStyle, image.style]}
							source={image.source}
						/>
					</View>
				))}
			</View>
		)
	}
}