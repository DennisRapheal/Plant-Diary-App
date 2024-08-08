import { View, Text, TextInput, Button, Image, TouchableOpacity, Switch, StyleSheet } from 'react-native'
import Slider from '@react-native-community/slider'; 
import { useState } from 'react'
import AddDiaryBtn from '../../components/AddDiaryBtn';
import * as ImagePicker from 'expo-image-picker';


const create = () => {
  const [image, setImage] = useState<string | null>(null);
  const [plantName, setPlantName] = useState('');
  const [plantType, setPlantType] = useState('');
  const [wateringFrequency, setWateringFrequency] = useState(0);
  const [reminder, setReminder] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const addToDiary = async () => {
    
  };  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* // upload image  */}
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.uploadContainer}>
            <Text style={styles.uploadText}>upload an image!</Text>
          </View>
        )}
      </TouchableOpacity>


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
    </View>
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