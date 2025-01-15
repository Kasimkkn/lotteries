import mongoose from 'mongoose';

const RaffleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    photo: { type: String, required: true },
    numbers: { type: [Number], required: true },
    launchDate: { type: Date, required: true },
    drawDate: { type: Date, required: true },
    entrants: { type: Number, default: 0 },
    totalEntriesAllowed: { type: Number, required: true },
    userSelectedNumbers: { type: [Number], required: false },
    ticketPrice: { type: Number, required: true },
    isUniqueNumberSelection: { type: Boolean, default: false },
    isMultipleNumberSelection: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Raffle = mongoose.model('Raffle', RaffleSchema);

export default Raffle;
