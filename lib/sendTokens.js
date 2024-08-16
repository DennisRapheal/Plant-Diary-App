import 'firebase/firestore';
import { db } from './firebase';

import { useGlobalContext } from "context/GlobalProvider";
import { useState } from "react";
import { deleteDoc, getDocs, getDoc, collection, query, where, doc, updateDoc, orderBy, Timestamp} from 'firebase/firestore';
import admin from "firebase-admin"; 

const user = useGlobalContext();
const [isLoading, setIsLoading] = useState(false);
const [diaries, setDiaries] = useState([]); 
const [waterCards, setWaterCards] = useState([]);

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

const sendMsg = async (token) => {
  // Define the device token object
  const message = {
    notification: {
      title: "Watering Reminder",
      body: "Your plant is dying, please give them water",
    },
    token: token,
  };

  try {
    const response = await admin.messaging.send(message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert('../serviceAccountKey.json'),
  databaseURL: 'https://plant-diary-357fb.firebaseio.com'
});

const notifier = async() => {
  await getDiaryWaterInfo(); 
  for (const diary of diaries) {
    await getLastWater(diary.id);
    const userId = diary.uid; 
    const docRef = doc(db, 'tokens', userId);
    const docSnap = await getDoc(docRef);
    const token = docSnap.tokenId;

    for (const waterCard of waterCards) {
      if (waterCard) {
        const now = Timestamp.now(); 
        if (( now.seconds - waterCard.createdAt.seconds ) / (60 * 60 * 24) < diary.wateringFrequency) {
          await sendMsg(token); 
          break;  // Use break correctly within a loop
        }
      }
    }
  }
}

notifier()