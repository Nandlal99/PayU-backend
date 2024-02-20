
const zod = require("zod");
const User = require("../models/User.model");
const Account = require("../models/Account.model");
const { default: mongoose } = require("mongoose");

const transferBalanceBody = zod.object({
    to: zod.string().trim(),
    amount: zod.number()
})

const getBalance = async (req, res, next) => {
    const userId = req.userId;
    try {
        const account = await Account.findOne({
            userId
        });

        return res.status(200).json({
            message: "Get account successfully !!!",
            balance: account.balance
        })
    } catch (error) {
        return res.status(411).json({
            message: "Something went wrong !!!"
        })
    }
};

const transferBalance = async (req, res, next) => {

    // const { to, amount } = req.body;
    // const { success } = transferBalanceBody.safeParse(req.body);
    // if (!success) {
    //     return res.status(411).json({
    //         message: "Incorrect data passed !!!"
    //     });
    // }

    // const { to, amount } = req.body;
    // try {

    const session = await mongoose.startSession();
    session.startTransaction();

    const { to, amount } = req.body;

    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance  !!!"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account !!!"
        });
    }

    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);

    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    await session.commitTransaction();

    return res.status(200).json({
        message: "Transfer successful !!!"
    })

    // } catch (error) {
    //     return res.status(411).json({
    //         message: "Something went wrong !!!"
    //     });
    // }
};

module.exports = {
    getBalance,
    transferBalance
};