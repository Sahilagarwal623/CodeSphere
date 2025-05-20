import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiResponse } from "./ApiResponse.js";
const validateToken = asyncHandler(async (req, res) => {
    console.log('request came at auth middle validateToken.js');

    try {
        const token = req.cookies?.AccessToken || req.headers?.authorization?.split(" ")[1];

        if (!token) {

            return res.json(new ApiResponse(401, "unauthorized request"));
        }

        const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);


        const user = await User.findById(data?._id).select("-password -refreshToken");

        if (!user) {
            return res.json(new ApiResponse(401, "Invalid token"));
        }

        return res.json(new ApiResponse(200, "Token is valid", { username: user.username, profilepicture: user.avatar }));
    } catch (error) {
        return res.json(new ApiResponse(401, "unauthorized request"));
    }
})

export { validateToken };