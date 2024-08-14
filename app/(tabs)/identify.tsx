import { View, Text, TextInput, Button, Image, Switch, Alert, StyleSheet } from 'react-native'
import { useState, useEffect} from 'react'

import React from 'react'
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import UplaodImgBlock from '../../components/UplaodImgBlock';
import AddDiaryBtn from '../../components/AddDiaryBtn';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
const ApiKey = '2b10sL5sTH5tnq7zhTwNVCvYge';

const identify = () => {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  // deal with btn
  const [isLoading, setIsLoading] = useState(false);
  const [resData, setResData] = useState("");
  const [pressed, setIsPressed] = useState(false);


  const clickIdentify = async () => {
    if (image != null) {
      const getMimeType = (uri) => {
        // Extract file extension from the URI
      const extension = uri.split('.').pop().toLowerCase();
        // Map extensions to MIME types
        switch (extension) {
          case 'jpg':
          case 'jpeg':
            return 'image/jpeg';
          case 'png':
            return 'image/png';
          case 'gif':
            return 'image/gif';
          case 'pdf':
            return 'application/pdf';
          case 'txt':
            return 'text/plain';
          case 'html':
            return 'text/html';
          case 'csv':
            return 'text/csv';
          case 'zip':
            return 'application/zip';
          default:
            return 'application/octet-stream'; // Default MIME type for unknown file types
        }
      };
      try{
        setIsLoading(true)
        const fileInfo = await FileSystem.getInfoAsync(image);
        const form = new FormData();
        form.append('images', {
          uri: image,
          type: getMimeType(fileInfo.uri), // Get MIME type from file extension or content
          name: fileInfo.uri.split('/').pop(), // Use the file name from URI
        });
        const url = 'https://my-api.plantnet.org/v2/identify/all' + '?api-key=' + ApiKey
        const response = await axios.post(url, form , {
          params: {
              'include-related-images': 'false',
              'no-reject': 'false',
              'nb-results': '3',
              'lang': 'en',
              'type': 'kt',
          },
          headers: {
              'Content-Type': 'multipart/form-data',
          }
        });
        await setResData(response.data)
        console.log('Success:', typeof response.data);
        const strData = response.data
        strData.startingImage = image
        const jsonString = JSON.stringify(strData);
        const encodedData = encodeURIComponent(jsonString);
        router.push(`/(test)/${encodedData}`);
      } catch (err){
        console.error(err);
      } finally {
        setIsLoading(true)
      }
    } else {
      Alert.alert('Oops...', 'No image is selected. ')
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Allow only images
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log('success upload img');
    } else {
      Alert.alert('Oops...', 'Please upload an image again')
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's find your plant</Text>
      <UplaodImgBlock 
        image={image}
        pickImage={pickImage}
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