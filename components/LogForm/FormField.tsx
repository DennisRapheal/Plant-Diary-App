import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React from "react";
import { icons } from "@/constants";

const FormField = ({
    title,
    value,
    placeholder,
    handleChangeText,
    otherStyles,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-[#4a5b4c] font-pmedium">{title}</Text>

      <View className="w-full h-16 px-4 bg-[#d4d4d4] rounded-2xl border-2 border-[#4a5b4c] focus:border-[#171717] flex flex-row items-center">
        <TextInput
          className="flex-1 text-[#4a5b4c] font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField