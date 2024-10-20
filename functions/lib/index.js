"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendScheduledNotifications = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const node_fetch_1 = require("node-fetch");
admin.initializeApp();
const resetToMidnight = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};
const toSendOrNotToSend = (interval, createdAt) => {
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
exports.sendScheduledNotifications = functions.pubsub
    .schedule("every 5 minutes")
    .onRun(async () => {
    const db = admin.firestore();
    try {
        const diaryQuery = db.collection("diaries")
            .where("waterReminder", "==", true);
        const diariesSnapshot = await diaryQuery.get();
        if (diariesSnapshot.empty) {
            console.log("No diaries found with reminders.");
        }
        for (const diaryDoc of diariesSnapshot.docs) {
            const diaryData = diaryDoc.data();
            const wateringRecords = diaryData.wateringRecords || [];
            const createdAt = diaryData === null || diaryData === void 0 ? void 0 : diaryData.createdAt;
            if (!createdAt || typeof createdAt.toDate !== "function") {
                console.log(`Processing diary: ${diaryDoc.id}`, diaryData);
                continue;
            }
            // eslint-disable-next-line max-len
            const latestWateringRecord = wateringRecords[wateringRecords.length - 1];
            let LatestWaterCardData;
            for (const wateringRecord of wateringRecords) {
                const WaterCardRef = db.collection("watercards").doc(wateringRecord);
                // eslint-disable-next-line max-len
                const WaterCardSnapshot = await WaterCardRef.get(); // Await the document fetch
                // eslint-disable-next-line max-len
                const WaterCardData = WaterCardSnapshot.data(); // Extract data from the document
                if (WaterCardData === null || WaterCardData === void 0 ? void 0 : WaterCardData.watered) {
                    LatestWaterCardData = WaterCardData;
                    break; // Exit the loop if the plant has already been watered
                }
            }
            if (wateringRecords.length === 0 || !LatestWaterCardData) {
                // eslint-disable-next-line max-len
                if (toSendOrNotToSend(diaryData.wateringFrequency, diaryData === null || diaryData === void 0 ? void 0 : diaryData.createdAt)) {
                    const tokenDocRef = db.collection("device_tokens")
                        .doc(diaryData.uid);
                    const tokenDoc = await tokenDocRef.get();
                    const tokenData = tokenDoc.data();
                    const message = {
                        to: tokenData === null || tokenData === void 0 ? void 0 : tokenData.token,
                        sound: "default",
                        title: `Remember to water your ${diaryData.plantName}`,
                        body: "Your plant is dying, please give them water!",
                    };
                    await sendPushNotifications(message);
                }
                continue;
            }
            const wateringCardTime = LatestWaterCardData === null || LatestWaterCardData === void 0 ? void 0 : LatestWaterCardData.createdAt;
            // eslint-disable-next-line max-len
            if (!wateringCardTime || typeof wateringCardTime.toDate !== "function") {
                console.log(`Processing waterCard: ${latestWateringRecord}`);
                continue;
            }
            // eslint-disable-next-line max-len
            if (toSendOrNotToSend(diaryData.wateringFrequency, latestWateringRecord === null || latestWateringRecord === void 0 ? void 0 : latestWateringRecord.createdAt)) {
                const tokenDocRef = db.collection("device_tokens").doc(diaryData.uid);
                const tokenDoc = await tokenDocRef.get();
                const tokenData = tokenDoc.data();
                const message = {
                    to: tokenData === null || tokenData === void 0 ? void 0 : tokenData.token,
                    sound: "default",
                    title: `Remember to water your ${diaryData.plantName}`,
                    body: "Your plant is dying, please give them water!",
                };
                await sendPushNotifications(message);
            }
        }
        console.log("Notifications sent!");
    }
    catch (error) {
        console.error("Error sending notifications: ", error);
    }
});
// Function to send notifications via Expo
const sendPushNotifications = async (messages) => {
    const expoPushEndpoint = "https://exp.host/--/api/v2/push/send";
    if (!messages.to) {
        return;
    }
    try {
        const response = await (0, node_fetch_1.default)(expoPushEndpoint, {
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
        }
        else {
            console.error("Error sending push notifications:", data);
        }
    }
    catch (error) {
        console.error("Error in sending push notifications: ", error);
    }
};
//# sourceMappingURL=index.js.map