import { View, Text, TextInput, Button, Image, TouchableOpacity, Switch, StyleSheet } from 'react-native'
import Slider from '@react-native-community/slider'; 
import { useState } from 'react'
import AddDiaryBtn from '../../components/AddDiaryBtn';
import * as ImagePicker from 'expo-image-picker';
import UplaodImgBlock from '../../components/UplaodImgBlock';
import DiarySettings from '../../components/DiarySettings';
import React from 'react';


const create = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const addToDiary = async () => {
    
  };  

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
      {/* // upload image  */}
      <UplaodImgBlock 
        image={image}
        pickImage={pickImage}
        script={"uplaod plant image"}
      />
      <View style={styles.formContainer}>
        <DiarySettings
          identifyPlantName=""
          identifyPlantType=""
          identifyWater=""
        />
        <AddDiaryBtn
          title="Add to diary"
          handlePress={addToDiary}
          isLoading={isAdding}
        />
      </View>
    </View>
  )
}

export default create

const styles = StyleSheet.create({
  container: {
    marginTop: 50, 
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    width: '100%',
    height: "40%",
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  uploadContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#888',
  },
  formContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#4a5b4c',
    borderRadius: 10,
  },
})