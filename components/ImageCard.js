import { Pressable, StyleSheet, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getImageSize } from "../helpers/common";

const ImageCard = ({ item, index, columns }) => {
	const isLastInRow = () => {
		return (index + 1) % columns === 0;
	};

	const getImageHeight = () => {
		let { imageHeight: height, imageWidth: width } = item;
		return { height: getImageSize(height, width) };
	};

	return (
		<Pressable
			className='bg-gray-800 rounded-2xl overflow-hidden mb-3 mx-1'
			style={[!isLastInRow()]}
		>
			<Image
				style={(styles.image, getImageHeight())}
				source={item?.webformatURL}
				transition={100}
			/>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	image: {
		height: 300,
		width: "100%",
	},
});

export default ImageCard;
