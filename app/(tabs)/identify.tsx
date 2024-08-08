import { View, Text, TextInput, Button, Image, TouchableOpacity, Switch, StyleSheet } from 'react-native'
import { useState } from 'react'
import React from 'react'
import * as ImagePicker from 'expo-image-picker';
import UplaodImgBlock from '../../components/UplaodImgBlock';
import AddDiaryBtn from '../../components/AddDiaryBtn';

const search = () => {

  const [image, setImage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const identify = async () => {

  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's find your plant</Text>
      {/* // upload image  */}
      <UplaodImgBlock 
        image={image}
        pickImage={pickImage}
        script={"pick an image to identify"}
      />
      <View style={styles.formContainer} >
        <AddDiaryBtn 
          title="identify the plant!"
          handlePress={identify}
          isLoading={isAdding}
        />
      </View>
      
    </View>
  )
}

export default search

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 50,
  },
  formContainer: {
    flex: 1,
    width: '100%',
    height: '40%', 
    padding: 16,
    paddingTop: "50%", 
    backgroundColor: '#4a5b4c',
    borderRadius: 10,
  },
})