const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require('../services/sendmail.service')
const emailTemplate = require('../utils/email.template')

//createAccount controller
const createAccount = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        //data validation
        if (!username || !email || !password) {
            return res.status(403).json({
                message: "username , email or password must be required"
            })
        }
        //find and check user is already exist using the same email id or username
        const isUserExist = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })
        if (isUserExist) {
            return res.status(400).json({
                message: "User already exists!"
            })
        }

        //now hassh the password and creating the user account
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hashPassword,
            role
        })

        //creating the token and set into the cookies 
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie("token", token,
            {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

        //now send the mail to user for successfully creation user account
        // try {
        //     await sendEmail({
        //         to: user.email,
        //         subject: "Account created",
        //         html: emailTemplate({
        //             title: "User Account Created",
        //             message: "Now Start your learning jurony, Your account is created successfully!",
        //         }),
        //     });
        // } catch (emailErr) {
        //     console.error("Email error:", emailErr.message);
        //     return res.status(403).json({
        //         messsage:"Email sending faild!"
        //     })
        // }

        return res.status(200).json({
            success: true,
            message: "user created sucessfully",
            user,
            token
        })

    }
    catch (err) {
        console.log("Somting went Wrong in createAccount controller!", err.message)
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

//login controller
const login = async (req, res) => {
    try {
        const { identifire, password } = req.body;
        //data validation
        if (!identifire || !password) {
            return res.status(403).json({
                message: "All feilds are required!"
            })
        }

        //user is exist or not
        const user = await userModel.findOne({
            $or: [
                { username: identifire },
                { email: identifire }
            ]
        }).select("+password")
        if (!user) {
            return res.status(404).json({
                message: "User not found, You must to firts create account!"
            })
        }

        //password validation
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Wrong Password!"
            })
        }


        //creating token and now user login
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax',
            secure: false
        })

        return res.status(200).json({
            success: true,
            message: "User Login successfully!",
            user,
            token
        })

    }
    catch (err) {
        console.log("Somting went wrong", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

//deleteAccount controller
const deleteAccount = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if (!userId) {
            return res.status(404).json({
                message: "User Not found!"
            })
        }
        await user.deleteOne();

        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
            sameSite: 'lax',
            secure: false
        })

        return res.status(200).json({
            success: true,
            message: "User Account deleted successfully!"
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong!"
        })
    }
}

//logout controller
const userLogout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
            sameSite: 'lax',
            secure: false
        })

        return res.status(200).json({
            success: true,
            message: "user logout successfully!"
        })
    }
    catch (err) {
        console.log("Somting went wrong in the user logout controller!");
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

//update password
const updateUserPassword = async (req, res) => {
    try {
        const userId = req.userId;
        //check user is exist or not
        const user = await userModel.findById(userId).select('+password')
        if (!user) {
            return res.status(401).json({
                message: "user not found!"
            })
        }

        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(403).json({
                message: "old Password and new Password must!"
            })
        }
        //validate the old password is correct or not
        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isMatch) {
            return res.status(401).json({
                message: "Old password is not correct!"
            })
        }

        //new hash the new password and update
        const hashPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully!"
        })
    }
    catch (err) {
        console.log("Somting went wrong inside the updateUserPassword controller!", err.message)
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

//getUserAccount controller
const getUserAccount = async (req, res) => {
    try {
        const userId = req.userId;
        //find user and validate
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "User not found!"
            })
        }

        return res.status(200).json({
            success: true,
            message: "User Account fetched successfuly",
            user
        })

    }
    catch (err) {
        console.log("Somting went wrong inside the getUserController!", err.message)
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
//updateUserprofile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;

        // fields allowed to update
        const allowedUpdates = [
            "username",
            "profile",
            "learningPreferences",
            "aiProfile",
        ];

        const updates = {};

        // pick only allowed fields from req.body
        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update",
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updates },
            {
                new: true,          // return updated document
                runValidators: true // apply schema regex & validation
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (err) {
        console.log(
            "Something went wrong inside updateUserProfile controller:",
            err.message
        );
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

//reset password

module.exports = {
    createAccount,
    login,
    deleteAccount,
    userLogout,
    updateUserPassword,
    getUserAccount,
    updateUserProfile
}