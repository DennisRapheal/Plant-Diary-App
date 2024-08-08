import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const ProfileBtn = ({ iconUrl, handlePress}) => {
    return (
        <TouchableOpacity style={styles.btnContainer} onPress={handlePress} className="flex-row">
        <Image 
            source={iconUrl}
            resizeMode="cover"
            style={styles.icon}
        />
        </TouchableOpacity>
    )
}
  
export default ProfileBtn

const styles = StyleSheet.create({
    btnContainer: {
        width: 12,
        height: 12,
        // borderRadius: 12 / 1.25,
        justifyContent: "center",
        alignItems: "center",
      },
    icon: {
        width: 60,
        height: 60,
        marginLeft: "800%",
        marginTop: "100%", 
        borderRadius: 80 / 1.25,
    }
})