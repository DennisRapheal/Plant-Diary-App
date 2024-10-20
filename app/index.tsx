import React from 'react'
import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton  from "../components/addButton/CustomButton";
import { useGlobalContext } from "../context/GlobalProvider";
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import useNotify from '@/hooks/useNotify';

const App = () => {
    const { expoPushToken, notification } = useNotify(); 
    const data = JSON.stringify(notification, undefined, 2);
    const { user, isLogged } = useGlobalContext()
    if( isLogged ) return <Redirect href="/home"/>

    return (
        <SafeAreaView className="#fffbeb h-full">
      {/* <Loader isLoading={loading} /> */}

      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center min-h-[85xh] px-4">
          <Image
            source={images.cards}
            className="w-[1000px] h-[600px]"
            resizeMode="contain"
          />
          <CustomButton
            title="Continue with Email"
            handlePress={async () => router.push("/(auth)/sign-in")}
            containerStyles="w-[300px] mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" /> 
    
    </SafeAreaView>
    );
}

export default App

