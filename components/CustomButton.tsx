import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'

interface CustomButtonProps {
    title: string;
    handlePress: (e: any) => Promise<void>;
    containerStyles: string;
    textStyles?: string; // Make this optional
    isLoading?: boolean;
}
// a button components
const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    handlePress,
    containerStyles,
    textStyles,
    isLoading,
}) => {
  return (
    <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.7}
        className={`bg-secondary rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles} ${
            isLoading ? "opacity-50" : ""
        }`}
        disabled={isLoading}
    >
        <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
            {title}
        </Text>

        {isLoading && (
            <ActivityIndicator
            animating={isLoading}
            color="#fff"
            size="small"
            className="ml-2"
            />
        )}
    </TouchableOpacity>
  )
}

export default CustomButton;