import { View, Text, Alert, StyleSheet, ScrollView } from 'react-native'

import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';

import UplaodImgBlock from '../../components/UplaodImgBlock';
import DiarySettings from '@/components/SettingField/DiarySettings';


const create = () => {
  const [image, setImage] = useState<string | null>(null);

  const { user } = useGlobalContext()


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    } else {
      Alert.alert('Oops...', 'Please upload an image again')
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          identifyPlantDetail=""
          user={user}
          image={image}
        />
      </View>
    </ScrollView>
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