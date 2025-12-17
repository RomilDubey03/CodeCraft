// import dotenv from "dotenv";
// import connectToDB from "./db/dbconnect.js";
// import { redisClient } from "./db/redisDbConnect.js";
// import app from "./app.js";

// dotenv.config({
//     path: "./.env" // if giving prob try "./.env"
// });

// const connectBothDB = async () => {
//     try {
//         await Promise.all([connectToDB(), redisClient.connect()]);
//         console.log("Connection Successfull");
//         app.listen(process.env.PORT || 8000, () => {
//             console.log(`Server is listening on: ${process.env.PORT}`);
//         });
//     } catch (error) {
//         console.log("connection failed!!!: ", error);
//     }
// };
// connectBothDB();
