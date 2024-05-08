import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	Platform,
	ActivityIndicator,
	Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { wp } from "../../helpers/common";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Toast from "react-native-toast-message";

const showToast = ({ message }) => {
	Toast.show({
		position: "bottom",
		type: "success",
		text1: message,
	});
};

const toastConfig = {
	success: ({ text1, props, ...rest }) => (
		<View
			className=' rounded-xl border-2 border-orange-300  p-2 '
			style={styles.toast}
		>
			<Text className='font-bold text-base text-white'>{text1}</Text>
		</View>
	),
};

const Images = () => {
	const router = useRouter();
	const item = useLocalSearchParams();
	const [status, setStatus] = useState("loading");
	let uri = item?.webformatURL;
	const fileName = item?.previewURL?.split("/").pop();
	const imageUrl = uri;
	const filePath = `${FileSystem.documentDirectory}${fileName}`;

	const onLoad = () => {
		setStatus("");
	};

	const getSize = () => {
		const aspectRatio = item?.imageWidth / item?.imageHeight;
		const maxWidth = Platform.OS == "web" ? wp(50) : wp(92);
		let calculatedHeight = maxWidth / aspectRatio;
		let calculatedWidth = maxWidth;

		if (aspectRatio < 1) {
			calculatedWidth = calculatedHeight * aspectRatio;
		}

		return {
			width: calculatedWidth,
			height: calculatedHeight,
		};
	};

	const handleDownloadImage = async () => {
		if (Platform.OS == "web") {
			const anchor = document.createElement("a");
			anchor.href = imageUrl;
			anchor.target = "_blank";
			anchor.download = fileName || "download";
			document.body.appendChild(anchor);
			anchor.click();
			document.body.removeChild(anchor);
		}
		setStatus("downloading");
		const uri = await downloadFile();
		if (uri) {
			console.log("image downloaded");
			showToast({ message: "Image Downloaded Successfully" });
		}
		setStatus("");
	};
	const handleShareImage = async () => {
		if (Platform.OS == "web") {
			showToast({ message: "Link Copied" });
		} else {
			setStatus("sharing");
			let uri = await downloadFile();
			if (uri) {
				await Sharing.shareAsync(uri);
			}
		}
	};

	// const downloadFile = async () => {
	// 	try {
	// 		// Check if the file already exists to prevent re-downloading
	// 		const fileInfo = await FileSystem.getInfoAsync(filePath);
	// 		if (fileInfo.exists) {
	// 			return fileInfo.uri;
	// 		}

	// 		// Download the image if it doesn't exist
	// 		const downloadResumable = FileSystem.createDownloadResumable(
	// 			imageUrl,
	// 			filePath
	// 		);
	// 		const { uri } = await downloadResumable.downloadAsync();
	// 		console.log("Downloaded file uri:", uri);
	// 		return uri;
	// 	} catch (error) {
	// 		console.error("Download Error:", error);
	// 		throw error; // Propagate the error to the caller
	// 	}
	// };

	const downloadFile = async () => {
		try {
			console.log("Starting download...");
			// Check if the file already exists to prevent re-downloading
			const fileInfo = await FileSystem.getInfoAsync(filePath);
			console.log("File info:", fileInfo);

			if (fileInfo.exists) {
				console.log("File already exists, returning URI:", fileInfo.uri);
				return fileInfo.uri;
			}

			// Download the image if it doesn't exist
			const downloadResumable = FileSystem.createDownloadResumable(
				imageUrl,
				filePath
			);
			const { uri } = await downloadResumable.downloadAsync();
			console.log("Downloaded file uri:", uri);
			return uri;
		} catch (error) {
			console.error("Download Error:", error);
			throw error; // Propagate the error to the caller
		}
	};

	console.log("image: ", item);
	console.log("filePath:", filePath);
	console.log("imageUrl:", imageUrl);

	return (
		<BlurView
			style={styles.container}
			// experimentalBlurMethod='dimezisBlurView'
			tint='dark'
			intensity={60}
		>
			<View style={getSize()}>
				<View style={styles.loading}>
					{status == "loading" && (
						<ActivityIndicator size='large' color='orange' />
					)}
				</View>
				<Image
					transition={100}
					source={{ uri: uri }}
					onLoad={onLoad}
					style={[getSize(), styles.image]}
				/>
			</View>

			{/* <Button title='Back' onPress={() => router.back()} />
			 */}

			<View style={styles.buttons} className=' flex-row items-center gap-11  '>
				<Animated.View
					entering={FadeInDown.springify()}
					className='h-14 w-14 justify-center items-center rounded-2xl bg-orange-300  '
					style={styles.button}
				>
					<Pressable onPress={() => router.back()}>
						<Ionicons name='close' size={24} color='orange' />
					</Pressable>
				</Animated.View>
				<Animated.View
					entering={FadeInDown.springify().delay(200)}
					className='h-14 w-14  justify-center items-center rounded-2xl bg-orange-300  '
					style={styles.button}
				>
					{status == "downloading" ? (
						<View>
							<ActivityIndicator size='small' color='orange' />
						</View>
					) : (
						<Pressable onPress={handleDownloadImage}>
							<Ionicons name='download' size={24} color='orange' />
						</Pressable>
					)}
				</Animated.View>
				<Animated.View
					entering={FadeInDown.springify().delay(400)}
					className='h-14 w-14  justify-center items-center rounded-2xl bg-orange-300  '
					style={styles.button}
				>
					{status == "sharing" ? (
						<View>
							<ActivityIndicator size='small' color='orange' />
						</View>
					) : (
						<Pressable onPress={handleShareImage}>
							<Ionicons name='share-social' size={24} color='orange' />
						</Pressable>
					)}
				</Animated.View>
			</View>
			<Toast config={toastConfig} visibilityTime={2500} />
		</BlurView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: wp(4),
		backfaceVisibility: "rgba(0,0,0,0.5)",
	},
	image: {
		borderRadius: 25,
		borderWidth: 2,
		backgroundColor: "rgba(255,255,255,0.1)",
		borderColor: "rgba(255,255,255,0.1)",
	},
	loading: {
		position: "absolute",
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	buttons: {
		marginTop: 40,
	},
	button: { backgroundColor: "rgba(255,255,255,0.2)" },
	toast: {
		padding: 15,
		paddingHorizontal: 30,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(255,85,0,0.3)",
	},
});

export default Images;
