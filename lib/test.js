import axios from 'axios';

const functionsTest = async () => {
  try {
    const response = await axios.get('https://us-central1-plant-diary-357fb.cloudfunctions.net/helloWorld', {
      timeout: 10000 // 10 seconds timeout
    });
    console.log(response.data);
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out');
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
  }
};

functionsTest();