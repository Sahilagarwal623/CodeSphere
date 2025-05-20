import { ApiResponse } from "../utils/ApiResponse.js";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { Room } from "../models/room.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const executeCode = async (code, language, input) => {

    const id = uuidv4();
    const dir = path.join(process.cwd(), "..", "temp", id);
    let command;
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(`${dir}/input.txt`, input || "");

    switch (language) {
        case "py":
            await fs.writeFile(`${dir}/main.py`, code, { encoding: "utf-8" });
            command = `docker run --rm -v ${dir}:/app -w /app sahilagarwal441/onlinecodeeditor:multi-lang-runner bash -c "python3 main.py < input.txt"`;
            break;

        case "js":
            await fs.writeFile(`${dir}/main.js`, code, { encoding: "utf-8" });
            command = `docker run --rm -v ${dir}:/app -w /app sahilagarwal441/onlinecodeeditor:multi-lang-runner bash -c "node main.js < input.txt"`;
            break;

        case "java":
            await fs.writeFile(`${dir}/main.java`, code, { encoding: "utf-8" });
            command = `docker run --rm -v ${dir}:/app -w /app sahilagarwal441/onlinecodeeditor:multi-lang-runner bash -c "javac main.java && java main < input.txt"`;
            break;

        case "cpp":
            await fs.writeFile(`${dir}/main.cpp`, code, { encoding: "utf-8" });
            command = `docker run --rm -v ${dir}:/app -w /app sahilagarwal441/onlinecodeeditor:multi-lang-runner bash -c "g++ main.cpp -o main && ./main < input.txt"`;
            break;

        default:
            return res.status(400).json(new ApiResponse(400, "language not supported"));
    }

    return new Promise((resolve) => {
        exec(command, (error, stdout, stderr) => {

            fs.rm(dir, { recursive: true, force: true }, (err) => {
                if (err) {
                    console.error('Error deleting directory:', err);
                } else {
                    console.log('Directory deleted successfully');
                }
            });

            if (error) {
                return resolve({ error: error.message || "error" });
            }

            resolve({
                output: stdout || stderr,
                error: null
            });
        }
        )
    });

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