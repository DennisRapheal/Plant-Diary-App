import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, Stack } from 'expo-router';
import DiaryCard from '../../components/DiaryCard';
import EmptyState from '../../components/EmptyState'
import { images } from "../../constants";
import { icons } from "../../constants";
import LogoutBtn from "../../components/LogoutBtn";
import ProfileBtn from "../../components/ProfileBtn";
import { useUserStore } from 'lib/userStore';
import { auth } from 'lib/firebase';
import { useGlobalContext } from 'context/GlobalProvider';

const home = () => {

  const handleLogout = (e) => {
    e.preventDefault(); 
    auth.signOut()
    router.push('/')
  };

  const { user, Loading } = useGlobalContext()

  return (
    <SafeAreaView className="bg-white" style={{ flex: 1 }}>
      <View className="w-full flex-row justify-between  items-center"  style={{height: "15%" }}> 
      {/* w-full flex justify-center items-center min-h-[85xh] px-4 */}
        <ProfileBtn iconUrl = {images.profile} handlePress={() => console.log('Header button pressed')}/>
        <Text>{user?.username}</Text>
        <LogoutBtn iconUrl = {icons.logout} handlePress={handleLogout}/>
      </View>
      
      <FlatList
        data={[{ id: '1', title: "rrr", imgpath: images.profile }, { id: '2', title: "rrr", imgpath: images.profile }]}
        // data={[]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DiaryCard 
            title={item.title}
            imgpath={item.imgpath}
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