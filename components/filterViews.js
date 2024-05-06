import { View, Text, Pressable } from "react-native";
import React from "react";
import { capitalize } from "../helpers/common";

const SectionView = ({ title, content }) => {
	return (
		<View>
			<Text className='text-lg font-medium '>{title}</Text>
			<View>{content}</View>
		</View>
	);
};

export const CommonFilterRow = ({ data, filterName, filters, setFilters }) => {
	const onSelect = (item) => {
		setFilters({ ...filters, [filterName]: item });
	};
	return (
		<View className='gap-3 flex-row flex-wrap'>
			{data &&
				data.map((item, index) => {
					let isActive = filters && filters[filterName] === item;

					return (
						<Pressable
							onPress={() => onSelect(item)}
							key={item}
							className={`p-2 px-4  rounded-xl  ${
								isActive ? " bg-orange-400  " : " bg-orange-100"
							}`}
						>
							<Text className='font-medium'>{capitalize(item)}</Text>
						</Pressable>
					);
				})}
		</View>
	);
};
export const ColorFilterRow = ({ data, filterName, filters, setFilters }) => {
	const onSelect = (item) => {
		setFilters({ ...filters, [filterName]: item });
	};
	return (
		<View className='gap-2 items-center justify-center mt-1 flex-row flex-wrap'>
			{data &&
				data.map((item, index) => {
					let isActive = filters && filters[filterName] === item;

					return (
						<Pressable
							onPress={() => onSelect(item)}
							key={item}
							className={`   p-1 px-1 rounded-xl  
							${isActive ? " border-2 border-orange-400  " : "border-white"}
							`}
							// style={{ backgroundColor: item }}
						>
							<View
								className=' h-9  rounded-xl w-10   '
								style={{ backgroundColor: item }}
							>
								<View />
							</View>
						</Pressable>
					);
				})}
		</View>
	);
};

export default SectionView;
