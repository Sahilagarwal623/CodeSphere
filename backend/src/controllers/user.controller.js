import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadImage } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { unlinkSync } from "node:fs";
import jwt from "jsonwebtoken";
import { options } from "../constants.js";
import { Codes } from "../models/codes.model.js";


const generateAccessAndRefreshToken = async (user) => {

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
}

const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password, fullname } = req.body;

    if (!fullname || !username || !email || !password) {
        return res.status(400).json(new ApiResponse(400, "All fields are required"));
    }

    const exisitingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (exisitingUser) {
        return res.status(409).json(new ApiResponse(409, "Username or email already exists"));
    }
    let avatarlocalPath = req.files?.avatar?.[0]?.path;

    if (!avatarlocalPath) {
        avatarlocalPath = "public\\temp\\defaultavatar.png";
    }

    const avatarImage = await uploadImage(avatarlocalPath);

    if (!avatarImage) {
        return res.status(500).json(new ApiResponse(500, "Failed to upload images"));
    }

    try {
        if (req.files?.avatar?.[0]?.path) {
            unlinkSync(avatarlocalPath);
        }
    } catch (error) {
        console.error("Error deleting local files:", error.message);
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        fullname,
        avatar: avatarImage.secure_url,
    });

    if (!user) {
        return res.status(500).json(new ApiResponse(500, "Failed to create user"));
    }

    user.password = undefined;
    user.refreshToken = undefined;

    return res.status(201).json(
        new ApiResponse(201, "User created successfully", user)
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const username = req.body.username;
    const email = req.body.email?.toLowerCase() || null;


    if (!email && !username) {
        return res.status(400).json(new ApiResponse(400, "Email or Username is required"));
    }

    const user = await User.findOne({
        $or: [...(email ? [{ email }] : []), ...(username ? [{ username: username.toLowerCase() }] : [])]
    });


    if (!user) {
        return res.status(404).json(new ApiResponse(404, "User does not exist"));
    }

    const isMatch = await user.isPasswordMatch(password);



    if (!isMatch) {
        return res.status(401).json(new ApiResponse(401, "Incorrect password"));
    }

    const tokens = await generateAccessAndRefreshToken(user);

    user.password = undefined;
    user.refreshToken = undefined;


    return res.status(200).cookie("AccessToken", tokens.accessToken, options).cookie("RefreshToken", tokens.refreshToken, options).json(
        new ApiResponse(200, "User Logged in successfully", {
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        }
        )
    )
})

const logoutUser = asyncHandler(async (req, res) => {

    const userId = req.user?._id;

    await User.findByIdAndUpdate(userId,
        {
            $set: {
                refreshToken: null
            }
        },
        {
            new: true,
        }
    )


    return res.status(200).clearCookie("AccessToken", options).clearCookie("RefreshToken", options).json(
        new ApiResponse(200, "User logged out successfully")
    );
})

const refreshAccessToken = asyncHandler(async (req, res) => {

    const clientRefreshToken = req.cookies.RefreshToken || req.body.RefreshToken;

    if (!clientRefreshToken) {
        return res.status(401).json(new ApiResponse(401, "Refresh token is required"));
    }

    const decoded = jwt.verify(clientRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const userId = decoded._id;

    if (!userId) {
        return res.status(401).json(new ApiResponse(401, "Invalid refresh token"));
    }

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json(new ApiResponse(404, "Invalid refresh token"));
    }

    const isdbrefreshTokenvalid = jwt.verify // continue


    if (user.refreshToken !== clientRefreshToken) {
        return res.status(403).json(new ApiResponse(403, "Invalid refresh token"));
    }

    const tokens = await generateAccessAndRefreshToken(user);

    return res.status(200).cookie("AccessToken", tokens.accessToken, options).cookie("RefreshToken", tokens.refreshToken, options).json(
        new ApiResponse(200, "Access token refreshed successfully", {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        })
    )
})


const getCollections = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const collections = await Codes.find({ createdBy: userId });

    return res.status(200).json(new ApiResponse(200, "Collections fetched successfully", collections));
})  

export { registerUser, loginUser, logoutUser, refreshAccessToken, getCollections };