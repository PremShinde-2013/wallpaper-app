import { View, Text, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedStyle,
} from "react-native-reanimated";
import SectionView, { CommonFilterRow } from "./filterViews";
import { capitalize } from "../helpers/common";
import { data } from "../constants/data";

const FiltersModal = ({
	modalRef,
	onClose,
	onApply,
	onReset,
	filters,
	setFilters,
}) => {
	const snapPoints = useMemo(() => ["75%"], []);
	return (
		<View>
			<BottomSheetModal
				ref={modalRef}
				index={0}
				snapPoints={snapPoints}
				enablePanDownToClose={true}
				backdropComponent={CustomBackdrop}
				// onChange={handleSheetChanges}
			>
				<BottomSheetView style={styles.contentContainer}>
					<View
						className='flex-1 gap-2 py-3 px-5 w-full
					 '
					>
						{/*  w-full bg-red-600 */}
						<Text className='text-2xl font-bold mb-2'>Filters</Text>
						{Object.keys(sections).map((sectionName, index) => {
							let sectionData = data.filters[sectionName];
							let sectionView = sections[sectionName];
							let title = capitalize(sectionName);

							return (
								<View key={sectionName}>
									<SectionView
										title={title}
										content={sectionView({
											data: sectionData,
											filters,
											setFilters,
											filterName: sectionName,
										})}
									/>
								</View>
							);
						})}
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		</View>
	);
};

const sections = {
	order: (props) => <CommonFilterRow {...props} />,
	orientation: (props) => <CommonFilterRow {...props} />,
	type: (props) => <CommonFilterRow {...props} />,
	colors: (props) => <CommonFilterRow {...props} />,
};

const CustomBackdrop = ({ animatedIndex, style }) => {
	const containerAnimatedStyle = useAnimatedStyle(() => {
		let opacity = interpolate(
			animatedIndex.value,
			[-1, 0],
			[0, 1],
			Extrapolation.CLAMP
		);
		return {
			opacity,
		};
	});
	const containerStyle = [
		StyleSheet.absoluteFill,
		style,
		styles.overlay,
		containerAnimatedStyle,
	];
	return (
		<Animated.View style={containerStyle}>
			<BlurView style={StyleSheet.absoluteFill} tint='dark' intensity={25} />
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		justifyContent: "center",
		backgroundColor: "grey",
	},
	contentContainer: {
		flex: 1,
		alignItems: "center",
	},
	overlay: {
		backgroundColor: "rgba(0,0,0,0.5)",
	},
});

export default FiltersModal;
