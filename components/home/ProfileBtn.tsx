import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import * as ImagePicker from 'expo-image-picker';


const ProfileBtn = ({ iconUrl, handlePress }) => {
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        // Open the image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            handlePress(result.assets[0].uri); // Pass the selected image URI to handlePress
        }
    };
    return (
        <TouchableOpacity style={styles.btnContainer} onPress={pickImage} className="flex-row">
        <Image 
          source={{ uri: iconUrl }}
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