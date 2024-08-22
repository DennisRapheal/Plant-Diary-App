import axios from "axios";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {Timestamp} from "firebase-admin/firestore";

admin.initializeApp();

const sendPushNotification = async (plantName: string, token: string) => {
  try {
    const response = await axios.post(
      "https://exp.host/--/api/v2/push/send",
      {
        to: token,
        title: "Watering Reminder",
        body: `Your ${plantName} is thirsty, you should give it some water!`,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Notification sent:", response.data);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

interface UserToken {
  uid: string;
  token: string;
}

interface Diary {
  id: string;
  wateringFrequency: number;
  plantName: string;
}

interface WaterCard {
  id: string;
  createdAt: Timestamp;
  wateringFrequency: number;
}

const UsersDiariesCollection = admin.firestore().collection("diaries");

const getUserDiaries = async (uid: string): Promise<Diary[]> => {
  try {
    const q = UsersDiariesCollection.where("uid", "==", uid);
    const querySnapshot = await q.get();
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Diary[];
  } catch (err) {
    console.error("Get Diary Info ERROR: ", err);
    return [];
  }
};

const diariesCardsCollection = admin.firestore().collection("watercards");

const getLastWatercards = async (diaryId: string): Promise<WaterCard[]> => {
  try {
    const q = diariesCardsCollection
      .where("diaryid", "==", diaryId)
      .where("waterReminder", "==", true)
      .where("wateringFrequency", "!=", 0)
      .orderBy("createdAt", "desc");
    const querySnapshot = await q.get();
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as WaterCard[];
  } catch (err) {
    console.error("Get Card Info ERROR: ", err);
    return [];
  }
};

const tokensCollection = admin.firestore().collection("device_tokens");

const sendUserNotification = async (token: UserToken) => {
  const diaries = await getUserDiaries(token.uid);
  if (!diaries) return;

  for (const diary of diaries) {
    const waterCards = await getLastWatercards(diary.id);
    if (!waterCards) continue;

    for (const waterCard of waterCards) {
      const now = Timestamp.now();
      if ((now.seconds - waterCard.createdAt.seconds) / (60 * 60 * 24) <
          diary.wateringFrequency) {
        await sendPushNotification(diary.plantName, token.token);
        break;
      }
    }
  }
};

export const sendNotifications = functions.pubsub.schedule("every 1 hours")
  .onRun(async () => {
    try {
      const tokensSnapshot = await tokensCollection.get();
      if (tokensSnapshot.empty) {
        console.log("No valid tokens found.");
        return null;
      }

      const UserTokens: UserToken[] = tokensSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: data.uid as string, // Ensure these properties exist
          token: data.token as string, // Ensure these properties exist
        };
      });

      for (const token of UserTokens) {
        await sendUserNotification(token);
      }
    } catch (error) {
      console.error("Error during scheduled function:", error);
    }
    return null;
  });
