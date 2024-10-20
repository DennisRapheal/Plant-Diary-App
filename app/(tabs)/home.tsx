import { StyleSheet, Text, View, FlatList, Alert} from 'react-native'
import React, { useEffect, useState }from 'react'
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Navigator, router, Stack } from 'expo-router';
import { images } from "../../constants";
import { icons } from "../../constants";
import upload from '@/lib/storage';
import { db } from '@/lib/firebase';
import { deleteDoc, getDocs, Timestamp, collection, query, where, doc, getDoc, updateDoc, setDoc, onSnapshot} from 'firebase/firestore';
import { auth } from '@/lib/firebase';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useFocusEffect } from '@react-navigation/native';
import { getStorage, ref, deleteObject } from 'firebase/storage';

import DiaryCard from '../../components/home/DiaryCard';
import EmptyState from '../../components/home/EmptyState'
import LogoutBtn from "../../components/home/LogoutBtn";
import ProfileBtn from "../../components/home/ProfileBtn";

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import useNotify from '@/hooks/useNotify';
import { deviceName } from 'expo-device';
import { isLoading } from 'expo-font';
import LoadingScreen from '@/components/Loading/Loading';
const home = () => {

  const [diaries, setDiaries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { user, Loading } = useGlobalContext()

  const { expoPushToken, notification } = useNotify(); 
  const data = JSON.stringify(notification, undefined, 2);

  useEffect(() => {
    const updateToken = async() => {
      if(!expoPushToken) return
      await setDoc(doc(db, "device_tokens", user.id), {
        token: expoPushToken,
        device_name: deviceName,
        createdAt: Timestamp.now(),
      })
      console.log("token has been updated")
    }
    if(user){
      updateToken()
    }
  }, [expoPushToken])

  async function registerForPushNotificationsAsync() {
    let token;
    try {
      if (Platform.OS === 'ios') {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
    
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
    
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    }catch(e){
      console.log(e)
    }
    return token;
  }


  const [profileImg, setProfileImg] = useState(user?.profileImg ? user?.profileImg : images.profile);
  const storage = getStorage();
  const deleteImg = async (fileRef) => {
    deleteObject(fileRef)
      .then(() => {
        console.log('File deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting file:', error);
      });
  }

  const onDelete = async (docId) => {
    try {
      setDiaries((prevDiaries) => prevDiaries.filter(diary => diary.id !== docId));
      const diaryRef = doc(db, "diaries", docId);
      const diaryDoc = await getDoc(diaryRef);

      if (!diaryDoc.exists()) {
        console.log("No such diary!");
        return;
      }

      const diaryData = diaryDoc.data();

      if (diaryData.startingImage) {
        console.log('Deleting diary starting image:', diaryData.startingImage);
        const fileRef = ref(storage, diaryData.startingImage);
        await deleteImg(fileRef);
      } else {
        console.warn('No starting image to delete for diary:', docId);
      }

      const wateringRecords = diaryData?.wateringRecords || [];
      if (wateringRecords.length === 0) {
        console.log("No watercards to delete.");
        return;
      }
      // Step 2: Execute the query
      const watercardsDeletionPromises = wateringRecords.map(async (watercardId) => {
        const watercardRef = doc(db, "watercards", watercardId);
        const waterDoc = await getDoc(watercardRef);

        if (!waterDoc.exists()) {
          console.log("No such waterCard!");
          return;
        }

        const waterData = waterDoc.data();

        if (waterData.startingImage) {
          console.log('Deleting watercard starting image:', waterData.startingImage);
          const fileRef = ref(storage, waterData.startingImage);
          await deleteImg(fileRef);
        } else {
          console.warn('No starting image to delete for watercard:', watercardId);
        }

        console.log("delete a watercard");
        return deleteDoc(watercardRef);
      });

      await Promise.all(watercardsDeletionPromises);
      await deleteDoc(diaryRef);
      console.log('Document deleted successfully');

   } catch (err) {
      console.error('Error deleting document:', err);
    }
  }

  const handlePress = async(diaryid) => {
    router.push(`/(diary)/${diaryid}`)
  }


  useEffect(() => {
    setLoading(true)

      registerForPushNotificationsAsync()
      const q = query(collection(db, "diaries"), where("uid", "==", user.id));
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDiaries(documents);

        const userDocRef = doc(db, "users", user.id);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
        setProfileImg(userData?.profileImg || "");

        setLoading(false);
      });

    return () => {
      unsubscribe()
    }
  }, [])

  const handleLogout = async(e) => {
    e.preventDefault()
    try {
      await auth.signOut();
      router.replace('/');
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle error (e.g., show a notification to the user)
    }
  };

  const changeProfile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    const temp_img = result.assets[0].uri;
    if (!result.canceled) {
      setProfileImg(temp_img);
    } else {
      Alert.alert('Oops...', 'Please upload an image again')
    }

    const imgUrl = await upload(temp_img)
    console.log(imgUrl)
    try{
      const docRef = doc(db, 'users', user.id);
      await updateDoc(docRef, {
        profileImg: temp_img, 
      })
      console.log('profileImg is revised',  temp_img)
    } catch (err) {
      console.error("Err",err);
    } 
  }

  if(loading){
    return <LoadingScreen/>
  }
  return (
    <SafeAreaView className="bg-white" style={{ flex: 1 }}>
      <View className="w-full flex-row justify-between  items-center"  style={{height: "15%" }}> 
        <ProfileBtn iconUrl = {profileImg ? profileImg : ""} handlePress={changeProfile}/>
        <Text>{user?.username}</Text>
        <LogoutBtn iconUrl = {icons.logout} handlePress={handleLogout}/>
      </View>

      <FlatList
        data={diaries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <DiaryCard 
          title={ item.diaryName }
          image={ item.startingImage }
          handlePress={ () => handlePress(item.id) }
          onDelete={ () => onDelete(item.id) }
        />
      )}

      ListHeaderComponent={() => (
        <View className="my-6 px-4 space-y-6">
          <View className="justify-between items-start flex-row" style={{flex: 1}}>
            <View>
              <Text className="text-xl font-psemibold text-white mt-2">
                Welcome Back!
              </Text>
              <Text className="text-sm font-pmedium text-gray-100">
                Add to your diary
              </Text>
            </View>
          </View>
        </View>
      )}

      ListEmptyComponent={() => (
        <EmptyState />
      )}
      
      style={{ flex: 1 }}
    />

    </SafeAreaView>
  )
}
export default home

const styles = StyleSheet.create({

})