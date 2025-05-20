import connectDB from './db/db.js';
import dotenv from 'dotenv';
import { server } from './app.js'


dotenv.config({
    path: './env'
});

connectDB().then(() => {
    const port = process.env.PORT;
    server.listen(port, '0.0.0.0', () => {
        console.log(`Server is running on port ${port}`);
    });
}
).catch((error) => {
    console.error("DB connection failed:", error.message);
}
);