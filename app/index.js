import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { theme } from "../constants/theme";
import { useRouter } from "expo-router";

import { NativeWindStyleSheet } from "nativewind";

const WelcomeScreen = () => {
	const router = useRouter();

	NativeWindStyleSheet.setOutput({
		default: "native",
	});

	return (
		<View className='flex-1' style={styles.container}>
			<StatusBar style='light' />
			<Image
				className='h-[100]  w-[100] absolute '
				source={require("../assets/images/welcome.png")}
				resizeMode='cover'
				style={styles.bgImage}
			/>
			<Animated.View entering={FadeInDown.duration(600)} style={{ flex: 1 }}>
				<LinearGradient
					colors={[
						"rgba(255,255,255,0)",
						"rgba(255,255,255,0.5)",
						"white",
						"white",
					]}
					style={styles.gradient}
					start={{ x: 0.5, y: 0 }}
					end={{ x: 0.5, y: 0.8 }}
				/>
				<View
					// style={styles.contentContainer}
					className='flex-1 items-center justify-end gap-8  mb-12'
				>
					<Animated.Text
						entering={FadeInDown.delay(400).springify()}
						className='text-4xl font-semibold '
						style={styles.title}
					>
						Wallpaper Saga
					</Animated.Text>

					<Animated.Text
						entering={FadeInDown.delay(600).springify()}
						className='font-semibold  mb-1   text-xl'
					>
						Embark on an Epic Journey{" "}
					</Animated.Text>
					<Animated.View entering={FadeInDown.delay(800).springify()}>
						<Pressable
							className='mb-12 bg-orange-500  p-4 px-24 rounded-2xl  '
							onPress={() => router.push("home")}
						>
							<Text className='text-xl text-white '>Start Explore</Text>
						</Pressable>
					</Animated.View>
				</View>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	bgImage: {
		width: wp(100),
		height: hp(100),
	},
	gradient: {
		width: wp(100),
		height: hp(65),
		bottom: 0,
		position: "absolute",
	},
	title: {
		color: theme.colors.neutral(0.9),
	},
});

export default WelcomeScreen;
