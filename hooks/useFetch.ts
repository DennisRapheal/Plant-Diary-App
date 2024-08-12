import { useState, useEffect } from 'react';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
const ApiKey = '2b10sL5sTH5tnq7zhTwNVCvYge';

// imagePath should be like: images.plant !!!!!
const useFetch = (imagePath) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // const [hasData, setHasData] = useState(false); // Track if returnData is available

  const getMimeType = (uri) => {
    // Extract file extension from the URI
  const extension = uri.split('.').pop().toLowerCase();
    // Map extensions to MIME types
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'pdf':
        return 'application/pdf';
      case 'txt':
        return 'text/plain';
      case 'html':
        return 'text/html';
      case 'csv':
        return 'text/csv';
      case 'zip':
        return 'application/zip';
      default:
        return 'application/octet-stream'; // Default MIME type for unknown file types
    }
  };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (!imagePath) {
                throw new Error('Image path is not set.');
            }
        // const pathPrefix = await getPrefix(imagePath)
        const fileInfo = await FileSystem.getInfoAsync(imagePath);
        const form = new FormData();
        form.append('images', {
            uri: imagePath,
            type: getMimeType(fileInfo.uri), // Get MIME type from file extension or content
            name: fileInfo.uri.split('/').pop(), // Use the file name from URI
        });
        const url = 'https://my-api.plantnet.org/v2/identify/all' + '?api-key=' + ApiKey
        const response = await axios.post(url, form , {
            params: {
                'include-related-images': 'false',
                'no-reject': 'false',
                'nb-results': '3',
                'lang': 'en',
                'type': 'kt',
            },
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

            setData(response.data);
            console.log('Success:', response.data);
            setIsLoading(false);
        // return { data, isLoading, error };
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

  const getfetch = async () => {
    await fetchData()
  }
//   const timer = setTimeout(() => {
//     return {data, isLoading, error }
//   }, 3000)
//   const returnData = await timer;  
  return ( {data, isLoading, error, getfetch} )
};

export default useFetch;
