import { db } from './firebase';
import { storage } from './firebase';

import 'firebase/firestore'; // Make sure you import Firestore

import { useGlobalContext } from "context/GlobalProvider";
import { useState } from "react";
import { deleteDoc, getDocs, collection, query, where, doc, updateDoc} from 'firebase/firestore';
const user = useGlobalContext();
const [isLoading, setIsLoading] = useState(false);
const [diaries, setDiaries] = useState([]);

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

const getLastWater = async(diaryId, now) => {
    try {
        setIsLoading(true); 
        const q = query(collection(db, "watercards"), 
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
const sendTokenToServer = async (token: string | null) => {
    // Define the device token object
    const deviceToken = {
      token: token,
      timestamp: db.FieldValue.serverTimestamp(),
    };
  
    // Replace 'myuserid' with the actual user ID from Firebase Auth or your own server
    const userId = 'myuserid'; // You need to dynamically get the user ID from Firebase Auth or your server
  
    try {
      // Send the token to Firestore
      await storage.collection('fcmTokens').doc(userId).set(deviceToken);
      console.log('Token successfully sent to server');
    } catch (error) {
      console.error('Error sending token to server:', error);
    }
  }
