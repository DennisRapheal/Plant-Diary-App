import { StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native'
import React from 'react'

const UplaodImgBlock = ({
    image, pickImage, script, btnPressed
  }) => {

  return (
    <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
      {image  ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={styles.uploadContainer}>
          <Text style={styles.uploadText}>{script}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

export default UplaodImgBlock

const styles = StyleSheet.create({
    imageContainer: {
        width: '100%',
        height: "40%",
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderRadius: 8,
        borderStyle: 'dashed',
      },
      image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
      },
      uploadContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      uploadText: {
        color: '#ccc',
      },
})