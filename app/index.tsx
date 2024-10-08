import React from 'react'
import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton  from "../components/CustomButton";
import { useGlobalContext } from "../context/GlobalProvider";
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'lib/firebase';
import { useUserStore } from 'lib/userStore';
import useNotify from 'hooks/useNotify'; 

const App = () => {
    const { expoPushToken, notification } = useNotify(); 
    // const data = JSON.stringify(notification, undefined, 2); 

    useEffect(() => {
      console.log("Token: ", expoPushToken)
    }, [])

    const { user, isLogged } = useGlobalContext()
    if( isLogged ) return <Redirect href="/home"/>

    return (
        <SafeAreaView className="bg-primary h-full">
      {/* <Loader isLoading={loading} /> */}

      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center min-h-[85xh] px-4">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />

          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless{"\n"}
              Possibilities with{" "}
              <Text className="text-secondary-200">Plantary</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with Plantary
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={async () => router.push("/(auth)/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" /> 
    
    </SafeAreaView>
    );
}

export default App

