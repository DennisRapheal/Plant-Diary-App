import { useState, useEffect } from 'react';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

const ApiKey = '2b10sL5sTH5tnq7zhTwNVCvYge';

// imagePath should be like: images.plant !!!!!
const useFetch = async (imagePath) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // const [hasData, setHasData] = useState(false); // Track if returnData is available

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
      try {
        if (!imagePath) {
          throw new Error('Image path is not set.');
        }
        const base64String = await convertFileToBase64(imagePath);

        const response = await axios.post('https://plant.id/api/v3/identification', {
          params: {
            'nb-results': '3', 
            'type': 'kt', 
            'api-key': ApiKey,
            'images': [base64String]
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setData(response.data);
        console.log('Success:', response.data);
        return { data, isLoading, error };
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
  // let promise = new Promise((resolve, reject) => {
  //   if (data){
  //     resolve; 
  //   } else {
  //     reject; 
  //   }
  // })
  // promise.
  //   then(() => {
  //     return {data, isLoading, error}
  //   }).catch (() => {
  //     console.log('promise fail ')
  //   })
  return { data, isLoading, error }
};

export default useFetch;
