import { View, Text, ScrollView, Alert, StyleSheet, ActivityIndicator} from 'react-native'
import { useState, useEffect} from 'react'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams} from 'expo-router';
import useFetch from '../../hooks/useFetch';
import PlantInfo from '../../components/PlantInfo';
import DiarySettings from '../../components/DiarySettings';
import { useGlobalContext } from 'context/GlobalProvider';

const result = () => {
  // const [returnData, setReturnData]= useState(null);
  const data= useLocalSearchParams().result;
  const [returnData, setReturnData] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useGlobalContext()
  
  // const [waitFetch, setWaitFetch] = useState(true);
  const [isPlant, setIsPlant] = useState(false);
  const [plantName, setPlantName] = useState("");
  const [percent, setPersent] = useState(0);
  const [plantType, setPlantType] = useState("");
  const [plantWater, setPlantWater] = useState("");
  const [image, setImage] = useState("");
  const [plantDetail, setPlantDetail] = useState("");
  const [pressed, setPressed] = useState(false);

  
  
  useEffect(() => {
    const decodedData = decodeURIComponent(data);
    // Parse the JSON string to get the original object
    const strData = JSON.parse(decodedData);
    console.log(typeof strData, strData)
    setPersent(strData.results[0].score);
    setPlantName(strData.results[0].species.commonNames[0])
    setPlantType(strData.results[0].species.family.scientificName)
    setImage(strData.startingImage);
    console.log(strData.results[0].gbif)
    console.log(strData.results[0].iucn)
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>We Find Your Plant!</Text>
      <View style={styles.infoContainer}>
       <Text className='text-xl'>This is a {percent} {plantName}</Text>
      </View>
      <View style={styles.formContainer}>
        <DiarySettings 
          identifyPlantName={plantName}
          identifyPlantType={plantType}
          identifyWater={plantWater}
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
    height: "20%",
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

