import mongoose from "mongoose";
import { Schema } from "mongoose";

const roomSchema = new Schema({

    roomId: {
        type: String,
        required: true,
    },

    passkey: {
        type: String,
        required: true,
    },
    
    size: {
        type: Number,
        default: 0,
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

})

export const Room = mongoose.model('Room', roomSchema);