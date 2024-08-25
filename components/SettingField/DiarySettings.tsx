import { StyleSheet, Text, View, TextInput, Switch} from 'react-native'
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AddDiaryBtn from '../addButton/AddDiaryBtn';
import Slider from '@react-native-community/slider'; 
import React from 'react'; 
import upload from '@/lib/storage';
import { setDoc, doc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const DiarySettings = ({identifyPlantName, identifyPlantType, identifyWater, identifyPlantDetail, user, image}) => {
  const [plantName, setPlantName] = useState('');
  const [plantType, setPlantType] = useState('');
  const [plantDetail, setPlantDetail] = useState('');
  const [wateringFrequency, setWateringFrequency] = useState(0);
  const [reminder, setReminder] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter()
  console.log(image)
  const addToDiary = async () => {
    // console.log(image)
    setIsAdding(true)
    const imgUrl = await upload(image)
    // console.log(imgUrl)
    try{
      const docRef = await addDoc(collection(db, "diaries"), {
        uid: user.id,
        createdAt: Timestamp.now(), // need to be reconverted to date type 
        plantName: plantName,
        plantType: plantType,
        plantDetail: plantDetail,
        wateringFrequency: wateringFrequency,
        waterReminder: reminder,
        startingImage: imgUrl,
        wateringRecords: [],
      })
      router.replace(`/(diary)/${docRef.id}`)
    } catch (err) {
      console.log('add to diary fail', err);
    } finally {
      setIsAdding(false)
    }
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
        if(identifyPlantDetail != ""){
          setPlantDetail(identifyPlantDetail);
        }
    }, [identifyPlantName, identifyPlantType, identifyWater, identifyPlantDetail]);

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
        borderColor: '#A9A9A9',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 16,
        backgroundColor: '#ddd',
      },
      sliderContainer: {
        marginBottom: 15,
      },
      slider: {
        width: '100%',
        height: 40,
      },
      switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 0,
      },
})