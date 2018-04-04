import React, { Component } from 'react';

import {
	Image,
	ImageRequireSource,
	View,
	ImageStyle,
	ViewStyle,
} from 'react-native';

export interface ImageSourceStyle {
	source: ImageRequireSource;
	style: ImageStyle;
}

interface Props {
	style: ViewStyle;
	wrapperStyle: any;
	imageStyle: any;
	images: ImageSourceStyle[];
}

export default class CompositeImage extends Component<Props> {
	render() {
		const {
			style,
			wrapperStyle,
			imageStyle,
			images
		} = this.props;
		return (
			<View style={style}>
				{images.map((image: ImageSourceStyle, index: number) => (
					<View key={`img_${index}`} style={wrapperStyle}>
						<Image style={[imageStyle, image.style]} source={image.source} />
					</View>
				))}
			</View>
		);
	}
}
