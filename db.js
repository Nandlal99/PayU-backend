
const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/paytm");

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect("mongodb+srv://nandlal:0QHSfmbK9am8x8dD@cluster0.r7ic42h.mongodb.net/payment?retryWrites=true&w=majority");
        console.log(`\n MongoDB connected !!`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
};

module.exports = connectDB;


// mongodb://localhost:27017/paytm


// mongodb+srv://nandlal:<password>@cluster0.r7ic42h.mongodb.net/?retryWrites=true&w=majority

// 0QHSfmbK9am8x8dD ------- password