
const zod = require("zod");
const User = require("../models/User.model");
const Account = require("../models/Account.model");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

const editUserSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
});

const signup = async (req, res, next) => {

    const { success } = signupSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs",
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    });

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs",
            user: existingUser
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 1000
    })

    res.status(200).json({
        message: "User created successfully",
        userId
    });

};

const login = async (req, res, next) => {
    const { username, password } = req.body;
    const { success } = signinSchema.safeParse({ username: username, password: password });

    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }

    const user = await User.findOne({
        username,
        password
    });

    if (!user) {
        return res.status(411).json({
            message: "Error while logging in"
        });
    }

    if (password !== user.password) {
        return res.status(411).json({
            message: "Error while logging in"
        });
    }

    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.status(200).json({
        message: "User login successfully",
        token,
        userId
    });
};


const editUser = async (req, res, next) => {
    // const { password, firstName, lastName } = req.body;
    const { success } = editUserSchema.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        })
    }

    try {

        await User.updateOne({ _id: req.userId }, req.body);

        return res.status(200).json({
            message: "Updated successfully"
        })


    } catch (error) {
        return res.status(500).json({
            message: "Error while updating information"
        })
    }
}

const getUserDetailByFilter = async (req, res, next) => {
    const filter = req.query.filter || "";
    // console.log(filter);
    try {
        const users = await User.find({
            $or: [{
                firstName: {
                    $regex: "(?i)^" + filter,
                    // $options: 'i'
                }
            }, {
                lastName: {
                    $regex: "(?i)^" + filter,
                    // $options: 'i'
                }
            }],
            _id: {
                $not: {
                    $eq: req.userId,
                }
            }
            // firstName: {
            // $regex: filter,
            // $options: 'i'
            // }
        });

        return res.status(200).json({
            user: users?.map(user => {
                return {
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    _id: user._id
                }
            })
        });

    } catch (error) {
        return res.status(411).json({});
    }


}

const getUserDetailByUserId = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        return res.status(200).json({
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
            }
        })

    } catch (error) {
        return res.status(411).json({
            message: "Something went wrong !!!"
        })
    }
}

module.exports = {
    signup,
    login,
    editUser,
    getUserDetailByFilter,
    getUserDetailByUserId
};