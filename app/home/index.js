import { View, Text, Pressable, ScrollView, TextInput } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
	AntDesign,
	FontAwesome,
	FontAwesome6,
	Ionicons,
} from "@expo/vector-icons";
import Categories from "../../components/categories";
import { apiCall } from "../../api";
import ImageGrid from "../../components/ImageGrid";
import { debounce } from "lodash";
import FiltersModal from "../../components/filtersModal";

const HomeScreen = () => {
	const { top } = useSafeAreaInsets();
	const paddingTop = top > 0 ? top + 10 : 30;
	const [search, setSearch] = useState("");
	const searchInputRef = useRef(null);
	const [activeCategory, setActiveCategory] = useState(null);
	const [filters, setFilters] = useState(null);
	const [images, setImages] = useState([]);
	const modalRef = useRef(null);

	useEffect(() => {
		fetchImages();
	}, []);
	const fetchImages = async (params = { page: 1 }, append = false) => {
		console.log("params: ", params, append);
		let res = await apiCall(params);
		// console.log("results: ", res.data?.hits[0]);
		if (res.success && res?.data?.hits) {
			if (append) {
				setImages([...images, ...res.data.hits]);
			} else {
				setImages([...res.data.hits]);
			}
		}
	};

	const handleChangeCategory = (cat) => {
		setActiveCategory(cat);
		clearSearch();
		setImages([]);
		page = 1;
		let params = {
			page,
		};
		if (cat) params.category = cat;
		fetchImages(params, false);
	};

	const handleSearch = (text) => {
		console.log("search: ", text);
		setSearch(text);
		if (text.length > 2) {
			page = 1;
			setImages([]);
			setActiveCategory(null);
			fetchImages({ page, q: text }, false);
		}
		if (text == "") {
			page = 1;
			searchInputRef?.current?.clear();

			setActiveCategory(null);
			setImages([]);
			fetchImages({ page });
		}
	};
	const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

	const clearSearch = () => {
		setSearch("");
		searchInputRef?.current?.clear();
	};

	const openFilterModal = () => {
		modalRef?.current?.present();
	};
	const closeFilterModal = () => {
		modalRef?.current?.close();
	};

	const applyFilters = () => {
		console.log("apply filters");
		closeFilterModal();
	};
	const resetFilters = () => {
		console.log("reset filters");
		closeFilterModal();
	};

	console.log("filters : ", filters);
	return (
		<View className={`flex-1 gap-4 `} style={{ paddingTop }}>
			<View className='mx-4 flex-row justify-between items-center '>
				<Pressable>
					<Text className='pl-4  font-medium text-2xl'>Wallpaper Saga</Text>
				</Pressable>
				<Pressable onPress={openFilterModal}>
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
						className='flex-1 rounded-sm border-none py-1 text-lg'
						// value={search}
						ref={searchInputRef}
						onChangeText={handleTextDebounce}
					/>
					{search && (
						<Pressable
							onPress={() => handleSearch("")}
							className='bg-orange-100  rounded-2xl'
						>
							<Ionicons name='close' size={28} color='orange' />
						</Pressable>
					)}
				</View>
				{/* categories */}
				<View>
					<Categories
						activeCategory={activeCategory}
						handleChangeCategory={handleChangeCategory}
					/>
				</View>

				{/* images masonary grid */}

				<View>{images.length > 0 ? <ImageGrid images={images} /> : null}</View>
			</ScrollView>

			<FiltersModal
				modalRef={modalRef}
				filters={filters}
				setFilters={setFilters}
				onClose={closeFilterModal}
				onApply={applyFilters}
				onReset={resetFilters}
			/>
		</View>
	);
};

export default HomeScreen;
