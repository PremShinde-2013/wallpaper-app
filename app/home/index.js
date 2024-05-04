import { View, Text, Pressable, ScrollView, TextInput } from "react-native";
import React, { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
	AntDesign,
	FontAwesome,
	FontAwesome6,
	Ionicons,
} from "@expo/vector-icons";
import Categories from "../../components/categories";

const HomeScreen = () => {
	const { top } = useSafeAreaInsets();
	const paddingTop = top > 0 ? top + 10 : 30;
	const [search, setSearch] = useState("");
	const searchInputRef = useRef(null);

	return (
		<View className={`flex-1 gap-4 `} style={{ paddingTop }}>
			<View className='mx-4 flex-row justify-between items-center '>
				<Pressable>
					<Text className='pl-4  font-medium text-2xl'>Wallpaper Saga</Text>
				</Pressable>
				<Pressable>
					<FontAwesome6 name='bars-staggered' size={24} color='orange' />
				</Pressable>
			</View>
			<ScrollView contentContainerStyle={{ gap: 15 }}>
				<View className='flex-row justify-between items-center rounded-xl border-orange-200 bg-orange-50  p-1 pl-3 border-2  mx-4'>
					<View className='p-1'>
						<FontAwesome name='search' size={24} color='orange' />
					</View>
					<TextInput
						placeholder='Search for photos...'
						className='flex-1 rounded-sm py-1 text-lg'
						value={search}
						ref={searchInputRef}
						onChangeText={(value) => setSearch(value)}
					/>
					{search && (
						<Pressable className='bg-orange-100  rounded-2xl'>
							<Ionicons name='close' size={28} color='orange' />
						</Pressable>
					)}
				</View>
				<View>
					<Categories />
				</View>
			</ScrollView>
		</View>
	);
};

export default HomeScreen;
