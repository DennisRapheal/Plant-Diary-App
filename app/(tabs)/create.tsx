import { View, Text, TextInput, Button, Image, TouchableOpacity, Switch, StyleSheet, ScrollView } from 'react-native'
import Slider from '@react-native-community/slider'; 
import { useState } from 'react'
import AddDiaryBtn from '../../components/AddDiaryBtn';
import * as ImagePicker from 'expo-image-picker';
import UplaodImgBlock from '../../components/UplaodImgBlock';
import React from 'react';
import upload from 'lib/storage';
import { setDoc, doc, collection, addDoc } from 'firebase/firestore';
import { db } from 'lib/firebase';
import { useGlobalContext } from 'context/GlobalProvider';
import PlantInfo from 'app/(diarySetting)/[diarySettingId]';

const create = () => {
  const [image, setImage] = useState<string | null>(null);
  const [plantName, setPlantName] = useState('');
  const [plantType, setPlantType] = useState('');
  const [wateringFrequency, setWateringFrequency] = useState(0);
  const [reminder, setReminder] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const { user } = useGlobalContext()

  const addToDiary = async () => {

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
        <TextInput
          style={styles.input}
          placeholder="Name your plant"
          value={plantName}
          onChangeText={setPlantName}
        />
        <Text className="text-white">
          What's Your Plant? 
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the type of your plant"
          value={plantType}
          onChangeText={setPlantType}
        />
        <View style={styles.sliderContainer}>
          <Text className="text-white">How often do you want to water it? (days)</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={30}
            step={1}
            value={wateringFrequency}
            onValueChange={setWateringFrequency}
          />
          <Text className="text-white">{wateringFrequency} days</Text>
        </View>
        <View style={styles.switchContainer}>
          <Text className="text-white">Watering reminder:</Text>
          <Switch value={reminder} onValueChange={setReminder} />
        </View>
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: '#ddd',
  },
  sliderContainer: {
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
})