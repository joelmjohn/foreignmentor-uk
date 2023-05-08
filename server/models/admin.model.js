const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const modelEnum = require('../constants/enum');

const admin = new Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: modelEnum.ADMIN_ROLE,
        required: true

    },
    userName: {
        type: String,
        required: true

    },
    password: {
        type: String,
        required: true

    },
    email: {
        type: String,
        unique: true,
        required: true

    },
    profileImg: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = new mongoose.model('admin', admin);