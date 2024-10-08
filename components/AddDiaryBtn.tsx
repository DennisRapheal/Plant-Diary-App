import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'

const AddDiaryBtn = ({
    title,
    handlePress,
    isLoading,
}) => {
  return (
    <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.7}
        className={`bg-white rounded-xl min-h-[50px] flex flex-row justify-center items-center mt-7 mb-1 ${
            isLoading ? "opacity-50" : ""
        }`}
        disabled={isLoading}
    >

        {isLoading ? (
            <ActivityIndicator
                animating={isLoading}
                size="small"
                className="ml-2"
            />
        ) : (
            <Text className={`text-green font-psemibold text-lg`}>
                {title}
            </Text>
        )}
    </TouchableOpacity>
  )
}

export default AddDiaryBtn

// const styles = StyleSheet.create({})