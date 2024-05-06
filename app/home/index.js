import {
	View,
	Text,
	Pressable,
	ScrollView,
	TextInput,
	ActivityIndicator,
} from "react-native";
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
import { useRouter } from "expo-router";

const HomeScreen = () => {
	const { top } = useSafeAreaInsets();
	const paddingTop = top > 0 ? top + 10 : 30;
	const [search, setSearch] = useState("");
	const searchInputRef = useRef(null);
	const [activeCategory, setActiveCategory] = useState(null);
	const [filters, setFilters] = useState(null);
	const [images, setImages] = useState([]);
	const [isEndReached, setIsEndReached] = useState(false);
	const modalRef = useRef(null);
	const scrollRef = useRef(null);
	const router = useRouter();

	useEffect(() => {
		fetchImages();
	}, []);
	const fetchImages = async (params = { page: 1 }, append = true) => {
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
			...filters,
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
			fetchImages({ page, ...filters }, false);
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
		if (filters) {
			page = 1;
			setImages([]);
			let params = { page, ...filters };
			if (activeCategory) params.category = activeCategory;
			if (search) params.q = search;
			fetchImages(params, false);
		}
		closeFilterModal();
	};
	const resetFilters = () => {
		if (filters) {
			page = 1;
			setFilters(null);
			setImages([]);
			let params = { page };
		}
		closeFilterModal();
	};

	const clearThisFilter = (filterName) => {
		let filterz = { ...filters };
		delete filterz[filterName];
		setFilters({ ...filterz });
		page = 1;
		setImages([]);
		let params = {
			page,
			...filterz,
		};
		if (activeCategory) params.category = activeCategory;
		if (search) params.q = search;
		fetchImages(params, false);
	};

	const handleScroll = (event) => {
		const contentHeight = event.nativeEvent?.contentSize?.height;
		const scrollViewHeight = event.nativeEvent?.layoutMeasurement?.height;
		const scrollOffset = event.nativeEvent?.contentOffset?.y;
		const bottomPosition = contentHeight - scrollViewHeight;

		if (scrollOffset >= bottomPosition - 1) {
			if (!isEndReached) {
				setIsEndReached(true);

				console.log("bottom reached");

				++page;
				let params = {
					page,
					...filters,
				};
				if (activeCategory) params.category = activeCategory;
				if (search) params.q = search;
				fetchImages(params);
			} else if (isEndReached) {
				setIsEndReached(false);
			}
		}
	};

	const handleScrollUp = () => {
		scrollRef?.current?.scrollTo({
			y: 0,
			animated: true,
		});
	};

	console.log("filters : ", filters);
	return (
		<View className={`flex-1 gap-4 `} style={{ paddingTop }}>
			<View className='mx-4 flex-row justify-between items-center '>
				<Pressable onPress={handleScrollUp}>
					<Text className='pl-4  font-medium text-2xl'>Wallpaper Saga</Text>
				</Pressable>
				<Pressable onPress={openFilterModal}>
					<FontAwesome6 name='bars-staggered' size={24} color='orange' />
				</Pressable>
			</View>
			<ScrollView
				onScroll={handleScroll}
				scrollEventThrottle={5}
				ref={scrollRef}
				contentContainerStyle={{ gap: 15 }}
			>
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

				{/* filters */}
				{filters && (
					<View className='mx-3'>
						<ScrollView
							className='gap-2 '
							horizontal
							showsHorizontalScrollIndicator={false}
						>
							{Object.keys(filters).map((key, index) => {
								return (
									<View
										key={key}
										className='bg-orange-200 flex-row items-center p-1 justify-center rounded-xl  px-3  gap-1 '
									>
										{key === "colors" ? (
											<View
												style={{
													height: 20,
													width: 35,
													borderRadius: 7,
													backgroundColor: filters[key],
												}}
											/>
										) : (
											<Text className='font-medium   '>{filters[key]}</Text>
										)}

										<Pressable
											onPress={() => clearThisFilter(key)}
											className='bg-orange-100  rounded-2xl'
										>
											<Ionicons name='close' size={14} color='orange' />
										</Pressable>
									</View>
								);
							})}
						</ScrollView>
					</View>
				)}

				{/* images masonary grid */}

				<View>
					{images.length > 0 ? (
						<ImageGrid images={images} router={router} />
					) : null}
				</View>
				<View
					style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
				>
					<ActivityIndicator size='large' color='orange' />
				</View>
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
