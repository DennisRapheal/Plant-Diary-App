import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, Stack } from 'expo-router';
import DiaryCard from '../../components/DiaryCard';
import EmptyState from '../../components/EmptyState'
import { images } from "../../constants";
import { icons } from "../../constants";
import LogoutBtn from "../../components/LogoutBtn";
import ProfileBtn from "../../components/ProfileBtn";
import { useUserStore } from 'lib/userStore';
import { db } from 'lib/firebase';
import { deleteDoc, getDocs, collection, query, where, doc} from 'firebase/firestore';
import { auth } from 'lib/firebase';
import { useGlobalContext } from 'context/GlobalProvider';
// import useDiary from '../../hooks/useDiary';

const onDelete = async (docId) => {
  try {
    await deleteDoc(doc(db, "diaries", docId));
    console.log('Document deleted successfully');
    // Refresh the diaries list after deletion
    router.replace('/home')
  } catch (err) {
    console.error('Error deleting document:', err);
  }
}

const home = () => {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user, Loading } = useGlobalContext();
  useEffect(() => {
  const getData = async() => {
      try {
          setLoading(true); 
          const q = query(collection(db, "diaries"), where("uid", "==", user.id));
          const querySnapshot = await getDocs(q);
          const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setDiaries(documents);
      } catch (err) {
          setError(err as Error);
      } finally {
          setLoading(false);
      }
  };
      getData(); 
  }, []);

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
        <ProfileBtn iconUrl = {images.profile} handlePress={() => console.log('Header button pressed')}/>
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
          docid={ item.id }
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