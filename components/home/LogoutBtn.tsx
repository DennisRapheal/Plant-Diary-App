import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const LogoutBtn = ({ iconUrl, handlePress}) => {
    return (
        <TouchableOpacity style={styles.btnContainer} onPress={handlePress}>
        <Image 
            source={iconUrl}
            resizeMode="cover"
            style={styles.icon}
        />
        </TouchableOpacity>
    )
}
  
export default LogoutBtn

const styles = StyleSheet.create({
    btnContainer: {
        width: 12,
        height: 12,
        // borderRadius: 12 / 1.25,
        justifyContent: "center",
        alignItems: "center",
      },
    icon: {
        width: 20,
        height: 20,
        marginRight: "500%",
        marginTop: "100%", 
    }
})