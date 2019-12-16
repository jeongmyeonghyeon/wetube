import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(
  process.env.MONGO_URL_NEW,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
  },
);

const db = mongoose.connection;

const handelOpen = () => console.log('[O] Connected to DB');
const handleError = (error) => console.log(`[X] Error on DB Connection ${error}`);

db.once('open', handelOpen);
db.on('error', handleError);
