import {onRequest} from "firebase-functions/v2/https";
import cors from "cors";

const corsHandler = cors({origin: true});

export const helloWorld = onRequest((request, response) => {
  corsHandler(request, response, () => {
    response.send("Hello from Firebase!");
  });
});
