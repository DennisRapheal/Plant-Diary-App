import { StyleSheet, Text, View, TextInput, Switch} from 'react-native'
import { useEffect, useState } from 'react';
import Slider from '@react-native-community/slider'; 
import React from 'react'

const DiarySettings = ({identifyPlantName, identifyPlantType, identifyWater, btnPressed}) => {
  const [plantName, setPlantName] = useState('');
  const [plantType, setPlantType] = useState('');
  const [wateringFrequency, setWateringFrequency] = useState(0);
  const [reminder, setReminder] = useState(false);
  useEffect(() => {
    if(btnPressed){
      // add to bd
      console.log('add a diary')
    }
  }, [btnPressed])

    // useEffect(() => {
    //     if(identifyPlantName != ""){
    //         setPlantName(identifyPlantName);
    //     }
    //     if(identifyPlantType != ""){
    //         setPlantType(identifyPlantType);
    //     }
    //     if(identifyWater != ""){
    //         setWateringFrequency(identifyWater);
    //     }
    // }, [identifyPlantName, identifyPlantType, identifyWater]);

    if(identifyPlantName != ""){
        setPlantName(identifyPlantName);
    }
    if(identifyPlantType != ""){
        setPlantType(identifyPlantType);
    }
    if(identifyWater != ""){
        setWateringFrequency(identifyWater);
    }

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
    </>
  )
}

export default DiarySettings

const styles = StyleSheet.create({
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