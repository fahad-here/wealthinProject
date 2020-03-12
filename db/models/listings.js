const mongoose = require("mongoose")
const Schema = mongoose.Schema

const listingSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    unitNumber: {
        type: Number,
        required: true
    },
    propertyType: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    listingType: {
        type: String,
        required: true
    },
    listingPrice: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
    },
    publicIDs: {
        type: [String],
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
})

let Listing = mongoose.model("listing", listingSchema)

module.exports = Listing
