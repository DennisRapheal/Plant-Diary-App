import { StyleSheet, Text, View, Image} from 'react-native'
import React from 'react'
import { images } from '../../constants'
import AddDiaryBtn from '../addButton/AddDiaryBtn'
import { router } from 'expo-router'

const EmptyState = () => {
  return (
    <View className="justify-center items-center px-4">
        <Image source={images.empty} className="w-[270px] h-[215px]" />
        <Text className="text-xl text-center font-psemibold text-gray-100 mt-2">
          No diary has been created yet.
        </Text>
        <AddDiaryBtn 
          title="Create a diary!"
          handlePress={() => router.push('/create')}
          isLoading={false}
        />
    </View>
  )
}

export default EmptyState