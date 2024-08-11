import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "../../context/GlobalProvider";
import React from "react";
import { useUserStore } from "lib/userStore";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "lib/firebase";

const AuthLayout = () => {

    const { user, Loading } = useGlobalContext()
    if( !Loading && user ) return <Redirect href='/home'/>
    return (
    <>
        <Stack>
            <Stack.Screen
                name="sign-in"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="sign-up"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>

        {/* <Loader isLoading={loading} /> */}
        <StatusBar backgroundColor="#161622" style="light" />
    </>
  ); 
}

export default AuthLayout
