const mongoose = require('mongoose')

const locationSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, // Assuming it's a reference to a user document
        ref: 'User', // Reference to the User model
        required: true,
    },
    latitude:{
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model("Location", locationSchema)