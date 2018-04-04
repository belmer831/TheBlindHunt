import React, { PureComponent } from 'react';
import { ImageRequireSource, Image } from 'react-native';

interface Props {
	top: string | number;
	left: string | number;
	size: string | number;
	source: ImageRequireSource;
}

export default class SquareImage extends PureComponent<Props> {
	public render() {
		return (
			<Image
				source={this.props.source}
				style={{
					position: 'absolute',
					top: this.props.top,
					left: this.props.left,
					width: this.props.size,
					height: this.props.size
				}}
			/>
		);
	}
}
