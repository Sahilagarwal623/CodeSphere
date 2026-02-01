import { ApiResponse } from "../utils/ApiResponse.js";
import { Room } from "../models/room.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Code Executor Service URL - set this in your environment variables
const CODE_EXECUTOR_URL = process.env.CODE_EXECUTOR_URL || 'http://localhost:3001';

const executeCode = async (code, language, input) => {
    try {
        const response = await fetch(`${CODE_EXECUTOR_URL}/execute`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code,
                language,
                input: input || ''
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                error: errorData.error || `Executor service error: ${response.status}`,
                output: null
            };
        }

        const result = await response.json();
        return {
            output: result.output || '',
            error: result.error || null
        };

    } catch (err) {
        console.error('Code execution error:', err);
        return {
            error: 'Failed to connect to code execution service',
            output: null
        };
    }
};


const verifyPasskey = asyncHandler(async (req, res) => {

    const { roomId, passkey } = req.body;

    //verify logic here
    const room = await Room.findOne({ roomId: roomId });

    if (room) {
        if (passkey === room.passkey) {

            if (room.size < 2) {
                room.size += 1;
                await room.save();
                return res.status(200).json(new ApiResponse(200, "Room joined successfully"));
            }
            return res.status(409).json(new ApiResponse(409, "Cannot join the room"));
        }
        return res.status(401).json(new ApiResponse(401, "Incorrect passkey"));
    }

    return res.status(404).json(new ApiResponse(404, "Room does not exists"));

});

const createRoom = asyncHandler(async (req, res) => {

    //fill entry in db
    const { roomId, passkey } = req.body;

    const newRoom = new Room({
        roomId,
        passkey,
        size: 1,
        createdBy: req.user?._id,
    })

    await newRoom.save();

    return res.status(201).json(new ApiResponse(201, "", { roomId, passkey }));

});

const leaveRoom = asyncHandler(async (req, res) => {

    const { roomId } = req.body;
    console.log("roomId: ", roomId);

    const updatedRoom = await Room.findOneAndUpdate(
        { roomId: roomId },             // filter
        { $inc: { size: -1 } },         // update
        { new: true }                   // options
    );

    if (updatedRoom.size === 0) {
        await Room.deleteOne({ roomId: roomId })
    }

    res.status(200).json(new ApiResponse(200, "Room left successfully"));

})

export { verifyPasskey, executeCode, createRoom, leaveRoom };