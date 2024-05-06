import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from "./ImageCard";
import { getColumnCount, wp } from "../helpers/common";

const ImageGrid = ({ images, router }) => {
	const columns = getColumnCount();
	return (
		<View style={styles.container}>
			<MasonryFlashList
				data={images}
				numColumns={columns}
				initialNumRender={1000}
				className='px-10'
				contentContainerStyle={styles.listContainerStyle}
				renderItem={({ item, index }) => (
					<ImageCard
						item={item}
						index={index}
						columns={columns}
						router={router}
					/>
				)}
				estimatedItemSize={200}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	listContainerStyle: {
		paddingHorizontal: wp(4),
	},
	container: {
		minHeight: 3,
		width: wp(100),
	},
});

export default ImageGrid;
