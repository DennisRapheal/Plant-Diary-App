import { View, Text, TextInput, Button, Image, TouchableOpacity, Switch, StyleSheet } from 'react-native'
import Slider from '@react-native-community/slider'; 
import { useEffect, useState } from 'react'
import AddDiaryBtn from './AddDiaryBtn';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';


const DiarySetting = ({addToDiary, btntitle, diary, onSubmit}) => {

    useEffect(() => {
      setPlantName(diary?.plantName)
      setPlantType(diary?.plantType)
      setWateringFrequency(diary?.wateringFrequency)
      setReminder(diary?.waterReminder)
    }, [diary])

    const [plantName, setPlantName] = useState(diary?.plantName);
    const [plantType, setPlantType] = useState(diary?.plantType);
    const [wateringFrequency, setWateringFrequency] = useState(diary?.wateringFrequency);
    const [reminder, setReminder] = useState(diary?.waterReminder);
    const [isAdding, setIsAdding] = useState(false);

    return (
        <View style={styles.formContainer}>
            <TextInput
            style={styles.input}
            placeholder=""
            value={plantName}
            onChangeText={setPlantName}
            />
        <Text className="text-white">
        Description 
        </Text>
            <TextInput
            style={styles.input}
            placeholder=""
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
          title={btntitle}
          handlePress={() => onSubmit(plantName, plantType, wateringFrequency, reminder)}
          isLoading={isAdding}
        />
    </View>
  )
}

export default DiarySetting

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
      color: "#000000", 
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