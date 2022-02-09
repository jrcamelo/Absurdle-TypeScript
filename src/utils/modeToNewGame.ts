import Absurdle from "@/app/game/absurdle";
import Wordle from "@/app/game/wordle";

const modeToNewGame: Map<string, any> = new Map([
    [`wordle`, () => new Wordle()],
    [`wordle-hard`, () => new Wordle(true)],
    [`absurdle`, () => new Absurdle()],
    [`absurdle-hard`, () => new Absurdle(true)],
    // TODO: Make Daily class
    [`daily`, () => new Wordle()],
    [``, () => new Wordle()],
]);
export default modeToNewGame;
