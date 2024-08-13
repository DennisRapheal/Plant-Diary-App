import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Switch, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import DiarySetting from 'components/DiarySetting';
import { useLocalSearchParams } from 'expo-router';

const PlantInfo = () => {
  const [plantName, setPlantName] = useState('');
  const [plantDetail, setPlantDetail] = useState('');
  const [wateringInterval, setWateringInterval] = useState(0);
  const [reminderEnabled, setReminderEnabled] = useState(false);

  const { diarySettingId } = useLocalSearchParams()
  console.log(diarySettingId)

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Plant Info.</Text>
      
      <View style={styles.imageContainer}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.imageWrapper}>
            {/* <Image
              source={require('./path-to-your-plant-image.png')}
              style={styles.plantImage}
            /> */}
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>organ</Text>
            </View>
          </View>
        ))}
      </View>
      <DiarySetting addToDiary={()=>{console.log("setdiary")}} btntitle = "submit"/>      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageWrapper: {
    alignItems: 'center',
  },
  plantImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  tagContainer: {
    backgroundColor: '#6B7A5D',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 5,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  infoCard: {
    backgroundColor: '#6B7A5D',
    borderRadius: 10,
    padding: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  label: {
    color: '#FFFFFF',
    marginBottom: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  reminderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default PlantInfo;