const fetch = require('node-fetch');

const sendPushNotification = async (expoPushToken) => {
  const message = {
    to: expoPushToken, // Expo push token you obtained
    sound: 'default',
    title: 'New Notification!',
    body: 'This is the body of the notification.',
    data: { someData: 'extra data goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
  .then(response => response.json())
  .then(data => {
    console.log("Push notification sent:", data);
  })
  .catch(err => {
    console.error("Error sending notification:", err);
  });
};

const token = 'ExponentPushToken[7ixQqJNuhY0IrTD7eiRJ0J]'
sendPushNotification(token);
