import mongoose from "mongoose";
import { Schema } from "mongoose";

const codesSchema = new Schema({

    content: {
        type: String,
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

})

export const Codes = mongoose.model('Codes', codesSchema);