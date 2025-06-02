import mongoose from 'mongoose';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

const connectDB = async () => { 
    try {
    if(mongoose.connection.readyState === 1 ){
        console.log('MongoDb Already connected!');
        return;
    }
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully!');
} catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); 
}
}

export default connectDB;