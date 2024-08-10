import { View, Text, TextInput, Button, Image, Switch, Alert, StyleSheet } from 'react-native'
import { useState, useEffect} from 'react'
import React from 'react'
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import UplaodImgBlock from '../../components/UplaodImgBlock';
import AddDiaryBtn from '../../components/AddDiaryBtn';

const identify = () => {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  // deal with btn
  const [isAdding, setIsAdding] = useState(false);


  const clickIdentify = () => {
    if (image != null) {
      router.push({
        pathname: '/(test)/[result]',
        params: { result: image },
      });
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
          isLoading={isAdding}
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