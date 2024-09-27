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


  const pickImageFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Allow only images
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log('success pick img');
    } else {
      Alert.alert('Oops...', 'Please upload an image again')
    }
  };

  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera permissions to make this work!',
        [{ text: 'OK' }]
      );
      return;
    }
    
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Handle the captured photo
      setImage(result.assets[0].uri);
      console.log('success take a photo img');
    } else {
      Alert.alert('Oops...', 'Please take a photo img again')
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Select Image Source',
      'Choose an option to select an image:',
      [
        {
          text: 'Camera',
          onPress: takePhotoWithCamera,
        },
        {
          text: 'Library',
          onPress: pickImageFromLibrary,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* // upload image  */}
      <UplaodImgBlock 
        image={image}
        pickImage={showImagePickerOptions}
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