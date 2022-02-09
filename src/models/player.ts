import mongoose from "mongoose";
import Game from "./game";

const PlayerSchema = new mongoose.Schema({
    userToken: {
        type: String,
        required: true,
    },
    ongoingGame: {
        type: Game,
        required: false,
    },
    games: {
        type: [Game],
        required: false,
        default: [],
    },
    // Stats
    gameCount: {
        type: Number,
        required: true,
        default: 0,
    },
    winCount: {
        type: Number,
        required: true,
        default: 0,
    },
    lossCount: {
        type: Number,
        required: true,
        default: 0,
    },
    winAt1: {
        type: Number,
        required: true,
        default: 0,
    },
    winAt2: {
        type: Number,
        required: true,
        default: 0,
    },
    winAt3: {
        type: Number,
        required: true,
        default: 0,
    },
    winAt4: {
        type: Number,
        required: true,
        default: 0,
    },
    winAt5: {
        type: Number,
        required: true,
        default: 0,
    },
    winAt6: {
        type: Number,
        required: true,
        default: 0,
    },
    //
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export default mongoose.models?.Player || mongoose.model(`Player`, PlayerSchema);
