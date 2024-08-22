// npx expo install expo-notifications expo-device expo-constants

import {useState, useEffect, useRef} from "react";

import * as Device from "expo-device"; 
import * as Notifications from "expo-notifications";

import Constants from "expo-constants";
import { Platform } from "react-native"; 

export interface PushNotificationState {
    notification?: Notifications.Notification; 
    expoPushToken?: Notifications.ExpoPushToken; 
}

const useNotify = (): PushNotificationState => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: false, 
            shouldShowAlert: true, 
            shouldSetBadge: false, 
        })
    })

    const [expoPushToken, setExpoPushToken] = useState< Notifications.ExpoPushToken | undefined >();
    const [notification, setNotification] = useState< Notifications.Notification | undefined >();

    const notificationListener = useRef<Notifications.Subscription>(); 
    const responseListener = useRef<Notifications.Subscription>(); 

    const registerForPushNotificationAsync = async () => {
        let token; 
    
        if (Device.isDevice) {
            // Request notification permissions
            const { status: existingStatus } = await Notifications.getPermissionsAsync(); 
            let finalStatus = existingStatus; 
    
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync(); 
                finalStatus = status; 
            }
    
            if (finalStatus !== 'granted') {
                alert('Failed to get push token');
                return;
            }
    
            // Get Expo push token
            try {
                token = await Notifications.getExpoPushTokenAsync({
                    projectId: Constants.expoConfig?.extra?.eas?.projectId,
                });
                console.log('Fetched token: ', token); // Debugging statement
            } catch (error) {
                console.error('Error fetching push token:', error);
            }
    
            // Set notification channel for Android
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                });
            }
    
            return token; 
        } else {
            console.log('Error, use a physical device');
            return null;
        }
    };

    useEffect (() => {

        registerForPushNotificationAsync().then((token) => {
            setExpoPushToken(token.data);
        })
        
        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
        })

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log(response); 
        })

        return () => {
            Notifications.removeNotificationSubscription(
                notificationListener.current!
            );

            Notifications.removeNotificationSubscription(
                responseListener.current!
            );
        }
    }, [])

    return { expoPushToken, notification }

}

export default useNotify; 


