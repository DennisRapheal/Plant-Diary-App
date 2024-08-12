import { StyleSheet, Text, View, TextInput, Switch} from 'react-native'
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AddDiaryBtn from './AddDiaryBtn';
import Slider from '@react-native-community/slider'; 
import React from 'react'; 
import upload from 'lib/storage';
import { useRoute } from '@react-navigation/native';
import { setDoc, doc, collection, addDoc } from 'firebase/firestore';
import { db } from 'lib/firebase';

const DiarySettings = ({identifyPlantName, identifyPlantType, identifyWater, user, image}) => {
  const [plantName, setPlantName] = useState('');
  const [plantType, setPlantType] = useState('');
  const [wateringFrequency, setWateringFrequency] = useState(0);
  const [reminder, setReminder] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter()
  const addToDiary = async () => {
    // console.log(image)
    const imgUrl = await upload(image)
    console.log(imgUrl)
    
    await addDoc(collection(db, "diaries"), {
      uid: user.id,
      createdAt: Date.now().toString(),
      plantName: plantName,
      plantType: plantType,
      wateringFrequency: wateringFrequency,
      waterReminder: reminder,
      startingImage: imgUrl,
      wateringRecords: [],
    })

    router.replace('/home')
  };  

    useEffect(() => {
        if(identifyPlantName != ""){
            setPlantName(identifyPlantName);
        }
        if(identifyPlantType != ""){
            setPlantType(identifyPlantType);
        }
        if(identifyWater != ""){
            setWateringFrequency(identifyWater);
        }
    }, [identifyPlantName, identifyPlantType, identifyWater]);

  return (
    <>
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
    </>
  )
}

export default DiarySettings

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: '#fff',
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