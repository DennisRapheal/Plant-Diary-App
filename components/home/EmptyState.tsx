import { StyleSheet, Text, View, Image} from 'react-native'
import React from 'react'
import { images } from '../../constants'
import AddDiaryBtn from '../AddDiaryBtn'
import { router } from 'expo-router'

const EmptyState = () => {
  return (
    <View className="justify-center items-center px-4">
        <Image source={images.empty} className="w-[270px] h-[215px]" />
        <Text className="text-xl text-center font-psemibold text-white mt-2">
            No Diary Created
        </Text>
        <Text className="text-sm text-center font-pmedium text-gray-100">
           Go add your first plant diary
        </Text>
        <AddDiaryBtn 
          title="Create the first video"
          handlePress={() => router.push('/create')}
          isLoading={false}
        />
    </View>
  )
}

export default EmptyState