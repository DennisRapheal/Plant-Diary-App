import { View, Text, ScrollView, Alert, StyleSheet, ActivityIndicator} from 'react-native'
import { useState, useEffect} from 'react'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams} from 'expo-router';
import useFetch from '../../hooks/useFetch';
import PlantInfo from '../../components/PlantInfo';
import DiarySettings from '@/components/SettingField/DiarySettings';
import { useGlobalContext } from '@/context/GlobalProvider';

const result = () => {
  // const [returnData, setReturnData]= useState(null);
  const data= useLocalSearchParams().result;
  const { user } = useGlobalContext()
  
  // const [waitFetch, setWaitFetch] = useState(true);
  const [plantName, setPlantName] = useState("");
  const [percent, setPersent] = useState(0);
  const [plantType, setPlantType] = useState("");
  const [details, setDetails] = useState("");
  const [plantWater, setPlantWater] = useState("");
  const [image, setImage] = useState("");
  const [plantDetail, setPlantDetail] = useState("");

  
  useEffect(() => {
    const decodedData = decodeURIComponent(data);
    // Parse the JSON string to get the original object
    const strData = JSON.parse(decodedData);
    const temp = strData.result.classification.suggestions[0]
    const isPlant = strData.result.is_plant.binary; 
    if (isPlant) {
      setPersent(strData.result.is_plant.probability * 100);
      setPlantName(temp.details.common_names[0])
      setPlantType(temp.details.taxonomy.family)
      setDetails(temp.details.description.value)
      setImage(strData.startingImage);
    } else {
      Alert.alert('Oops...', 'This image is probably not a plant!!!')
    }
  }, []);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>We Find Your Plant!</Text>
      <View style={styles.infoContainer}>
        <ScrollView>
          <Text className='text-2xl text-center'>This is a {'\n'}{percent}%{'\n'}{plantName}{'\n'}</Text>
          <Text>{details}</Text>
       </ScrollView>
      </View>
      <View style={styles.formContainer}>
        <DiarySettings 
          identifyPlantName={plantName}
          identifyPlantType={plantType}
          identifyWater={plantWater}
          identifyPlantDetail={details}
          user={user}
          image={image}
        />
      </View>
    </ScrollView>
  )
}

export default result

const styles = StyleSheet.create({
  infoContainer: {
    width: '100%',
    height: "30%",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
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
    height: '30%',
    width: '100%',
    padding: 16,
    backgroundColor: '#4a5b4c',
    borderRadius: 10,
  },
})

//hook 
// imagePath should be like: images.plant !!!!!

