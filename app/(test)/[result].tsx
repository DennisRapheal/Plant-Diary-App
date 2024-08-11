import { View, Text, TextInput, Button, Image, Switch, Alert, StyleSheet, ActivityIndicator} from 'react-native'
import { useState, useEffect} from 'react'
import React from 'react'
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams} from 'expo-router';
import UplaodImgBlock from '../../components/UplaodImgBlock';
import AddDiaryBtn from '../../components/AddDiaryBtn';
import useFetch from '../../hooks/useFetch'; 
import PlantInfo from '../../components/PlantInfo';
import DiarySettings from '../../components/DiarySettings';

const result = () => {
  const params = useLocalSearchParams();
  // const [returnData, setReturnData]= useState(null);
  
  const [returnData, setReturnData] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const [error, setError] = useState(null)
  const { Data, Loading, err, fetching} = useFetch(params.result);
      
  
  const [isAdding, setIsAdding] = useState(false);
  // const [waitFetch, setWaitFetch] = useState(true);
  const [isPlant, setIsPlant] = useState(false);
  const [plantName, setPlantName] = useState("");
  const [plantType, setPlantType] = useState("");
  const [plantWater, setPlantWater] = useState("");
  const [plantDetail, setPlantDetail] = useState("");
  const [pressed, setPressed] = useState(false);

  // useEffect(() => {
  //   if (returnData) {
  //     console.log('Return Data:', returnData);
  //     setIsPlant(returnData.result.is_plant.binary);
  //     if(returnData.result.classification.suggestions.length > 0){
  //       const suggestions = returnData.result.classification.suggestions[0].details;
  //       setPlantName(suggestions.common_names);
  //       setPlantType(suggestions.taxonomy?.genus);
  //       setPlantWater(''); // Replace with actual logic if needed
  //       setPlantDetail(suggestions.description?.value);
  //     }else{
  //       console.warn('No suggestions available.');
  //     }
  //   } else {
  //     console.log('Return Data Not Fetched:', returnData);
  //   }
  // }, [returnData, isLoading]);
  useEffect(() => {
    if (returnData==null || returnData=='undefined') {
      fetching
      setReturnData(Data)
      setIsLoading(Loading)
      setError(err)
      console.log("ere", JSON.stringify(returnData))
    }else{
      console.log("YA!!", JSON.stringify(returnData))
    }
  }, [returnData])

  const addToDiary = () => {
    setPressed(true)
  }
  return (
    <View style={styles.container}>
      <>
        { false? (
          <ActivityIndicator size="large" />
        ) : (
          <PlantInfo 
           isPlant={true}
           details= {returnData}
          />
        )}
      </>
      <View style={styles.formContainer}>
        <DiarySettings 
          identifyPlantName={plantName}
          identifyPlantType={plantType}
          identifyWater={plantWater}
          btnPressed={pressed}
        />
        <AddDiaryBtn
          title="Add to diary"
          handlePress={addToDiary}
          isLoading={isAdding}
        />
      </View>
    </View>
  )
}

export default result

const styles = StyleSheet.create({
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
    height: '40%',
    width: '100%',
    padding: 16,
    backgroundColor: '#4a5b4c',
    borderRadius: 10,
  },
})
