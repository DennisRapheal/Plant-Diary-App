import { StyleSheet, Text, View, Image} from 'react-native'
import React from 'react'
import { images } from '../constants'

const EmptyState = () => {
  return (
    <View className="justify-center items-center px-4">
        <Image source={images.empty} className="w-[270px] h-[215px]" />
        <Text className="text-xl text-center font-psemibold text-white mt-2">
            No Diary created
        </Text>
        <Text className="text-sm text-center font-pmedium text-gray-100">
           hiii
        </Text>
    </View>
  )
}

export default EmptyState