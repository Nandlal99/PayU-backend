const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const mainRouter = require("./routes/index");
const connectDB = require("./db");

app.use("/api/v1", mainRouter);

connectDB()
    .then(() => {
        app.listen(5000, () => {
            console.log("⚙️ Server is running port no: 5000");
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })



