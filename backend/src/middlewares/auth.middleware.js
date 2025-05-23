import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.AccessToken || req.headers?.authorization?.split(" ")[1];
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        

        const user = await User.findById(data?._id).select("-password -refreshToken");
        

        if (!user) {
            throw new ApiError(401, "Invalid access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized request");
    }
})

export { verifyJWT };