import dotenv from 'dotenv';
import app from 'app.js';

dotenv.config({
    path: './.env'  // if giving prob try "./.env"
})

connectToDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is listening on: ${process.env.PORT}`);
    })
})
.catch((error) => console.log("MONGODB connection failed!!!: ", error))