import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import * as FileSystem from 'expo-file-system';
import { images } from '../constants'; 
import { Asset } from 'expo-asset';

const ApiKey = 'sfJjUhGn2g6XrQ3qLZEt84vVLb4kImyyhPutUHOWgueF6edzkN';

// imagePath should be like: images.plant !!!!!

const useFetch = async (imagePath) => {
  const [returnData, setReturnData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const convertFileToBase64 = async (fileUri) => {
    if (!fileUri) {
      throw new Error('File URI is null or undefined.');
    }
    try {
      const base64String = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64String;
    } catch (err) {
      console.error('Error converting file to base64:', err);
      throw err;
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // const fileUri = await getValidUri(imagePath);
      if (!imagePath) {
        throw new Error('Image path is not set.');
      }
      console.log('Image Path:', imagePath);
      const base64String = await convertFileToBase64(imagePath);
      const plantData = {
        api_key: ApiKey,
        images: [base64String],
        /* modifiers docs: https://github.com/flowerchecker/Plant-id-API/wiki/Modifiers */
        modifiers: ["crops_fast", "similar_images"],
        plant_language: "en",
        /* plant details docs: https://github.com/flowerchecker/Plant-id-API/wiki/Plant-details */
        plant_details: ["common_names",
            "url",
            "name_authority",
            "wiki_description",
            "taxonomy",
            "synonyms"],
      };
      
    const response = await axios.post('https://api.plant.id/v2/identify', plantData);
      setReturnData(response.data);
      console.log('Success:', response.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [imagePath]); 

  const refetch = () => {
    setIsLoading(true); 
    fetchData(); 
  }

  return { returnData, isLoading, error, refetch }; 
};


export default useFetch;
