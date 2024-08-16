import { db } from './firebase';
import { messaging} from './firebase';

import 'firebase/firestore'; // Make sure you import Firestore
import { useGlobalContext } from "context/GlobalProvider";
import { useState, useEffect } from "react";
import { deleteDoc, getDocs, getDoc, collection, query, where, doc, updateDoc, orderBy, Timestamp} from 'firebase/firestore';
import BackgroundTimer from 'react-native-background-timer';
// Initialize the Firebase Admin SDK
const sendNotification = async () => {

  const user = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [diaries, setDiaries] = useState([]); 
  const [waterCards, setWaterCards] = useState([]);
  const [token, setToken] = useState("");

  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  const getDiaryWaterInfo = async() => {
    try {
      setIsLoading(true); 
      const q = query(collection(db, "diaries"), 
        where("uid", "==", user.id),
        where("waterReminder", "==", true), 
        where("wateringFrequency", "!=", 0) );
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDiaries(documents);
    } catch (err) {
      console.error("Get Diary Info ERROR: ", err);
    } finally {
      setIsLoading(false);
    }
  }

  const getLastWater = async(diaryId) => {
    try {
      setIsLoading(true); 
      const q = query(collection(db, "watercards"), 
        where("diaryid", "==", diaryId),
        where("waterReminder", "==", true), 
        where("wateringFrequency", "!=", 0) , 
        orderBy("createdAt", "desc") ); // recent to older
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWaterCards(documents);
    } catch (err) {
      console.error("Get Diary Info ERROR: ", err);
    } finally {
      setIsLoading(false);
    }
  }

  const sendMsg = async (script) => {
    // Define the device token object
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const message = {
      notification: {
        title: 'Watering Reminder!',
        body: `Your plant ${script} need some water!` 
      },
      token: '<DEVICE_FCM_TOKEN>',
    };

    messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  }

  const notifier = async() => {
    await getDiaryWaterInfo(); 
    diaries.forEach( async (diary) => {
      await getLastWater(diary.id);
      const userId = diary.uid; 
      // const docRef = doc(db, 'tokens', userId);
      // const docSnap = await getDoc(docRef);
      // const token = docSnap.tokenId;
      if ( waterCards ){
        waterCards.forEach((waterCard) => {
          const now = Timestamp.now(); 
          if (( now.seconds - waterCard.createdAt.seconds ) / (60 * 60 * 24) < diary.wateringFrequency ){
            sendMsg(diary.plantName); 
            return; 
          }
        })
      }
    });
  }; 

  // Register the background task
  useEffect(() => {
    requestPermission(); 
    notifier(); 
    const intervalId = BackgroundTimer.setInterval(() => {
      // This code will be executed every 5 seconds
      notifier(); 
      console.log('Hello from a background timer');
      // Perform any background tasks here
    }, 5000000); // 5000 milliseconds = 5 seconds

    return () => {
      // Clear the interval when the component unmounts
      BackgroundTimer.clearInterval(intervalId);
    };
  }, []);


  return null; 
}; 

export default sendNotification; 
