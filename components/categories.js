import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import React from "react";
import { data } from "../constants/data";

import { wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Animated, { FadeInRight } from "react-native-reanimated";

const Categories = ({ activeCategory, handleChangeCategory }) => {
	return (
		<FlatList
			contentContainerStyle={styles.flatlistCOntainer}
			horizontal
			showsHorizontalScrollIndicator={false}
			data={data.categories}
			keyExtractor={(item) => item}
			renderItem={({ item, index }) => (
				<CategoryItem
					title={item}
					index={index}
					isActive={activeCategory === item}
					handleChangeCategory={handleChangeCategory}
				/>
			)}
		>
			<Text>Categories</Text>
		</FlatList>
	);
};

const CategoryItem = ({ title, index, isActive, handleChangeCategory }) => {
	let color = isActive ? theme.colors.white : theme.colors.neutral(0.8);
	let backgroundColor = isActive
		? theme.colors.neutral(0.8)
		: theme.colors.white;
	return (
		<Animated.View
			entering={FadeInRight.delay(index * 200)
				.duration(2000)
				.springify()
				.damping(14)}
		>
			<Pressable
				onPress={() => handleChangeCategory(isActive ? null : title)}
				// style={{ backgroundColor }}
				className={`p-1 px-4  rounded-xl  ${
					isActive ? " bg-orange-400  " : " bg-orange-100"
				}`}
			>
				<Text
					className={` font-medium text-base ${
						isActive ? " text-white " : " text-black"
					}`}
				>
					{title}
				</Text>
			</Pressable>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	flatlistCOntainer: {
		paddingHorizontal: wp(4),
		gap: 8,
	},
});

export default Categories;
