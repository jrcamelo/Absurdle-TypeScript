import mongoose from "mongoose";

const StatsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    winCount: {
        type: Number,
        required: false,
        default: 0,
    },
    lossCount: {
        type: Number,
        required: false,
        default: 0,
    },
    winAt1: {
        type: Number,
        required: false,
        default: 0,
    },
    winAt2: {
        type: Number,
        required: false,
        default: 0,
    },
    winAt3: {
        type: Number,
        required: false,
        default: 0,
    },
    winAt4: {
        type: Number,
        required: false,
        default: 0,
    },
    winAt5: {
        type: Number,
        required: false,
        default: 0,
    },
    winAt6: {
        type: Number,
        required: false,
        default: 0,
    },
});

const GlobalStats = mongoose.models.Stats || mongoose.model(`Stats`, StatsSchema);
export default GlobalStats;
