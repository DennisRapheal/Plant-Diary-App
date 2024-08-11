import { View, Text, TextInput, Button, Image, TouchableOpacity, Switch, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router';
import { useState } from 'react'
import AddDiaryBtn from '../../components/AddDiaryBtn';
import * as ImagePicker from 'expo-image-picker';
import UplaodImgBlock from '../../components/UplaodImgBlock';
import DiarySettings from '../../components/DiarySettings';
import React from 'react';
import upload from 'lib/storage';
import { setDoc, doc, collection, addDoc } from 'firebase/firestore';
import { db } from 'lib/firebase';
import { useGlobalContext } from 'context/GlobalProvider';
import PlantInfo from 'app/(diarySetting)/[diarySettingId]';


const create = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const { user } = useGlobalContext()

  const [pressed, setIsPressed] = useState(false);
  const router = useRouter();
  const addToDiary = async () => {
// store to data base
    setIsPressed(true)
    router.push("/home")
    console.log(image)

    if(!image){
      console.log('no image available')
      return 
    }

    const imgUrl = await upload(image)

    console.log(imgUrl)

    await addDoc(collection(db, "diaries"), {
      uid: user.id,
      createdAt: Date.now(),
      plantName: plantName,
      plantType: plantType,
      wateringFrequency: wateringFrequency,
      waterReminder: reminder,
      startingImage: imgUrl,
    })
  };  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      await setImage(result.assets[0].uri);
      console.log(image)
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
          btnPressed={pressed}
        />
        <AddDiaryBtn
          title="Add to diary"
          handlePress={addToDiary}
          isLoading={isAdding}
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