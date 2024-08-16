import { StyleSheet, Text, View, FlatList, ScrollView} from 'react-native'
import React, { useEffect, useState }from 'react'
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, Stack } from 'expo-router';
import { images } from "../../constants";
import { icons } from "../../constants";
import { useUserStore } from 'lib/userStore';
import { db, storage } from 'lib/firebase';
import { deleteDoc, getDocs, collection, query, where, doc, getDoc, updateDoc} from 'firebase/firestore';
import { auth } from 'lib/firebase';
import { useGlobalContext } from 'context/GlobalProvider';
import { useFocusEffect } from '@react-navigation/native';
import upload from 'lib/storage';
import { getDownloadURL, ref } from 'firebase/storage';

import DiaryCard from '../../components/home/DiaryCard';
import EmptyState from '../../components/home/EmptyState'
import LogoutBtn from "../../components/home/LogoutBtn";
import ProfileBtn from "../../components/home/ProfileBtn";

const home = () => {

  const [diaries, setDiaries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { user, Loading } = useGlobalContext()
  const [ profileImageUrl, setProfileImageUrl ] = useState(null)

  const handleHeader = async(imageUrl) => {
    const url = await upload(imageUrl)
    try {
      const userRef = doc(db, "users", user.id)
      const userSnap = updateDoc(userRef, {
        userImage: url,
      })
      console.log("successfully change header image")
    }catch (error) {
      console.log(error.message)
    }
  }

  console.log(diaries)



  const onDelete = async (docId) => {
    try {
      setDiaries((prevDiaries) => prevDiaries.filter(diary => diary.id !== docId));
      await deleteDoc(doc(db, "diaries", docId));

      const q = query(collection(db, "watercards"), where("diaryid", "==", docId));
      // Step 2: Execute the query
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, "watercards", document.id));
        console.log(`an water card with ID ${document.id} deleted successfully`);
      });
      console.log('Document deleted successfully');
   } catch (err) {
      console.error('Error deleting document:', err);
    }
  }

  const handlePress = async(diaryid) => {
    router.push(`/(diary)/${diaryid}`)
  }

  const getData = async () => {
    try {
      setLoading(true);
  
      const q = query(collection(db, "diaries"), where("uid", "==", user.id));
      const querySnapshot = await getDocs(q);
  
      const documents = await Promise.all(
        querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        })
      );
      setDiaries(documents);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  const handleLogout = (e) => {
    e.preventDefault(); 
    auth.signOut()
    .then(() => {
      router.replace('/')
    })
  };


  return (
    <SafeAreaView className="bg-white" style={{ flex: 1 }}>
      <View className="w-full flex-row justify-between  items-center"  style={{height: "15%" }}> 
        <ProfileBtn iconUrl = {user.userImage} handlePress={handleHeader}/>
        <Text>{user?.username}</Text>
        <LogoutBtn iconUrl = {icons.logout} handlePress={handleLogout}/>
      </View>

      <FlatList
        data={diaries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <DiaryCard 
          title={ item.plantName }
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
                Add your diary
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