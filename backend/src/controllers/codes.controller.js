import { Codes } from "../models/codes.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const savecode = asyncHandler(async (req, res) => {
    const { content, title } = req.body;

    if (!content) {
        return res.status(400).json(new ApiResponse(400, "Content is required"));
    }

    const code = await Codes.create({
        content,
        title,
        createdBy: req.user._id,
    });

    console.log("this is saved code collection: ", code);
    

    res.status(201).json(new ApiResponse(201, "Code saved successfully", null));
});

export { savecode };