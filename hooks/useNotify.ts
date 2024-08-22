// /hooks/useNotify.ts

import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { collection, addDoc, Timestamp} from 'firebase/firestore';
import { db } from 'lib/firebase';
import { useGlobalContext } from 'context/GlobalProvider';

const useNotify = () => {
  const { user, isLogged } = useGlobalContext()
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const uploadDeviceToken = async (token, deviceInfo) => {
    if (token){
      try{
        const device_token = await addDoc(collection(db, "device_tokens"), {
          uid: user.id, 
          device_name: deviceInfo.deviceName, 
          createdAt: Timestamp.now(),
          token: token,
        })
        console.log('uid: ', device_token.uid);
        console.log('device_name: ', device_token.device_name);
        console.log('device_token: ', device_token.token);
      } catch (err) {
        console.log('setWaterCard', err);
      }
    }
  }

  const getDeviceInfo = async () => {
    const info = await {
      brand: Device.brand,
      manufacturer: Device.manufacturer,
      modelName: Device.modelName,
      osName: Device.osName,
      osVersion: Device.osVersion,
      osBuildId: Device.osBuildId,
      deviceName: await Device.deviceName,
    };
    return info; 
  };

  useEffect(() => {
    const handleRegistrationError = (errorMessage: string) => {
      alert(errorMessage);
      throw new Error(errorMessage);
    };

    const registerForPushNotificationsAsync = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          handleRegistrationError('Permission not granted to get push token for push notification!');
          return;
        }
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
          handleRegistrationError('Project ID not found');
        }
        try {
          const pushTokenString = (
            await Notifications.getExpoPushTokenAsync({
              projectId,
            })
          ).data;

          setExpoPushToken(pushTokenString);
          console.log("Token: ", pushTokenString)
          const info = await getDeviceInfo();
          uploadDeviceToken(pushTokenString, info); 

        } catch (e: unknown) {
          handleRegistrationError(`${e}`);
        }
      } else {
        handleRegistrationError('Must use physical device for push notifications');
      }
    };

    registerForPushNotificationsAsync();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return { expoPushToken, notification };
};

export default useNotify;
