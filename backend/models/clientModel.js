import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
    uniqueId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String, required: true },
    isCookieApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Client = mongoose.model('Client', ClientSchema);

export default Client;