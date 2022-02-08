import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
    mode: {
        type: String,
        required: true,
    },
    gameState: {
        type: String,
        required: false,
        default: `playing`,
    },
    answer: {
        type: String,
        required: true,
    },
    tries: {
        type: Number,
        required: true,
    },
    guesses: {
        type: Array,
        required: false,
        default: [],
    },
    absentLetters: {
        type: Array,
        required: false,
        default: [],
    },
    presentLetters: {
        type: Array,
        required: false,
        default: [],
    },
    correctLetters: {
        type: Array,
        required: false,
        default: [``, ``, ``, ``, ``],
    },
    remainingWords: {
        type: Number,
        required: false,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

mongoose.models?.Game || mongoose.model(`Game`, GameSchema);
export default GameSchema;
