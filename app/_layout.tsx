import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SplashScreen, Slot, Stack } from 'expo-router'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'
import GlobalProvider from '../context/GlobalProvider'
import { useUserStore } from 'lib/userStore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'lib/firebase'

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const [fontsLoaded, error] = useFonts({
        "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
        "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    });
    
    useEffect(() => {
        if (error) throw error;
    
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);
    
    if (!fontsLoaded && !error) {
        return null;
    }
    
    return (
        <GlobalProvider>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false}} />
                <Stack.Screen name="(auth)" options={{ headerShown: false}} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
                <Stack.Screen name="(diary)/[diaryId]" options={{ headerShown: false}} />
                <Stack.Screen name="(diarySetting)/[diarySettingId]" options={{ headerShown: false}} />
                <Stack.Screen name="(waterCard)/[wateringId]" options={{ headerShown: false}} />
                <Stack.Screen name="(test)" options={{ headerShown: false}} />
            </Stack>
        </GlobalProvider>
    )
}

export default RootLayout

