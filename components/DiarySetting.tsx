import { View, Text, TextInput, Button, Image, TouchableOpacity, Switch, StyleSheet } from 'react-native'
import Slider from '@react-native-community/slider'; 
import { useState } from 'react'
import AddDiaryBtn from './AddDiaryBtn';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';


const DiarySetting = ({addToDiary, btntitle}) => {
    const [plantName, setPlantName] = useState('');
    const [plantType, setPlantType] = useState('');
    const [wateringFrequency, setWateringFrequency] = useState(0);
    const [reminder, setReminder] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    return (
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
        title={btntitle}
        handlePress={addToDiary}
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