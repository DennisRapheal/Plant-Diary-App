import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
import {Timestamp} from "firebase-admin/firestore";

admin.initializeApp();

interface PushNotificationMessage {
    to: string;
    sound: string;
    title: string;
    body: string;
  }

const resetToMidnight = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const toSendOrNotToSend = (interval: number, createdAt: Timestamp) => {
  const now = new Date();
  const today = resetToMidnight(now);
  if (!createdAt || typeof createdAt.toDate !== "function") {
    console.error("createdAt is missing or invalid.");
    return false; // Skip this record if createdAt is not valid
  }

  // Convert Firestore timestamp to JavaScript Date object
  const createdAtDate = createdAt.toDate();
  const nextWatering = new Date(createdAtDate);
  nextWatering.setDate(createdAtDate.getDate() + interval);
  const nextWateringDateReset = resetToMidnight(nextWatering);
  return today >= nextWateringDateReset;
};

// Cron job to run every hour
export const sendScheduledNotifications = functions.pubsub
  .schedule("every 10 minutes")
  .onRun(async () => {
    const Testmessage = {
      to: "ExponentPushToken[7ixQqJNuhY0IrTD7eiRJ0J]",
      sound: "default",
      title: "Test message ⚠️",
      body: "Save your career with something fun.",
    };
    sendPushNotifications(Testmessage);
    const db = admin.firestore();
    try {
      const diaryQuery = db.collection("diaries")
        .where("waterReminder", "==", true)
        .where("wateringFrequency", "!=", 0);

      const diariesSnapshot = await diaryQuery.get();

      if (diariesSnapshot.empty) {
        console.log("No diaries found with reminders.");
      }

      for (const diaryDoc of diariesSnapshot.docs) {
        const diaryData = diaryDoc.data();
        const wateringRecords = diaryData.wateringRecords || [];

        if (wateringRecords.length === 0) {
          // eslint-disable-next-line max-len
          if (toSendOrNotToSend(diaryData.wateringFrequency, diaryData.createdAt)) {
            const tokenDocRef = db.collection("device_tokens")
              .doc(diaryData.uid);
            const tokenDoc = await tokenDocRef.get();
            const tokenData = tokenDoc.data();
            const message = {
              to: tokenData?.token,
              sound: "default",
              title: `Remember to water your ${diaryData.plantName}`,
              body: "Your plant is dying, please give them water!",
            };
            await sendPushNotifications(message);
          }
        }
        // eslint-disable-next-line max-len
        const latestWateringRecord = wateringRecords[wateringRecords.length - 1];
        // eslint-disable-next-line max-len
        if (toSendOrNotToSend(diaryData.wateringFrequency, latestWateringRecord.createdAt)) {
          const tokenDocRef = db.collection("device_tokens").doc(diaryData.uid);
          const tokenDoc = await tokenDocRef.get();
          const tokenData = tokenDoc.data();
          const message = {
            to: tokenData?.token,
            sound: "default",
            title: `Remember to water your ${diaryData.plantName}`,
            body: "Your plant is dying, please give them water!",
          };
          await sendPushNotifications(message);
        }
      }
      console.log("Notifications sent!");
    } catch (error) {
      console.error("Error sending notifications: ", error);
    }
  });

// Function to send notifications via Expo
const sendPushNotifications = async (messages: PushNotificationMessage) => {
  const expoPushEndpoint = "https://exp.host/--/api/v2/push/send";
  if (!messages.to) {
    return;
  }
  try {
    const response = await fetch(expoPushEndpoint, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Push notification response:", data);
    } else {
      console.error("Error sending push notifications:", data);
    }
  } catch (error) {
    console.error("Error in sending push notifications: ", error);
  }
};
