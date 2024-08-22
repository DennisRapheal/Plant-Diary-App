import { View, Text, TextInput, Button, Image, Switch, Alert, StyleSheet } from 'react-native'
import { useState, useEffect} from 'react'
import React from 'react'
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import UplaodImgBlock from '../../components/UplaodImgBlock';
import AddDiaryBtn from '../../components/AddDiaryBtn';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
const ApiKey = 'pDnMKtAz45bKVamyRJETuNGYMf4t472T9316950fqoVlWy83Aw';

const identify = () => {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  // deal with btn
  const [isLoading, setIsLoading] = useState(false);
  const [resData, setResData] = useState("");
  const [pressed, setIsPressed] = useState(false);


  const clickIdentify = async () => {
    const convertFileToBase64 = async (fileUri) => {
      if (!fileUri) {
        throw new Error('File URI is null or undefined.');
      }
      try {
        const base64String = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        return base64String;
      } catch (err) {
        console.error('Error converting file to base64:', err);
        throw err;
      }
    };

    if (image != null) {
      try{
        setIsLoading(true)
        const base64String = await convertFileToBase64(image);
        const apiInfo = {
          api_key: ApiKey,
          images: [base64String],
          classification_level: 'all',
        };

        const response = await axios.post('https://plant.id/api/v3/identification', apiInfo, {
          params: {
            details: 'common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering',
            language: 'en',
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setResData(response.data)
        console.log('Success:', typeof response.data);
        const strData = response.data
        strData.startingImage = image
        const jsonString = JSON.stringify(strData);
        const encodedData = encodeURIComponent(jsonString);
        router.push(`/(test)/${encodedData}`);
      } catch (err){
        console.error(err);
      } finally {
        setIsLoading(false)
      }
    } else {
      Alert.alert('Oops...', 'No image is selected. ')
    }
  }

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
    <View style={styles.container}>
      <Text style={styles.title}>Let's find your plant</Text>
      <UplaodImgBlock 
        image={image}
        pickImage={showImagePickerOptions}
        script={"pick an image to identify"}
      />

      <View style={styles.formContainer2} >
        <AddDiaryBtn 
          title="identify the plant!"
          handlePress={clickIdentify}
          isLoading={isLoading}
        />
      </View>
    </View>
  )
}

export default identify



const styles = StyleSheet.create({
  container: {
    marginTop: 50, 
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 50,
  },
  formContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#4a5b4c',
    borderRadius: 10,
  },
  formContainer2: {
    height: '40%',
    width: '100%',
    padding: 16,
    backgroundColor: '#4a5b4c',
    borderRadius: 10,
  },
})