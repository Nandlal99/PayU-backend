
const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    transaction: [
        {
            name: {
                type: String,
                required: true
            },
            date: {
                type: String,
                required: true
            },
            time: {
                type: String,
                required: true
            },
            amount: {
                type: String,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model("Account", accountSchema);