import Absurdle from "@/app/game/absurdle";
import Wordle from "@/app/game/wordle";

const modeToClass: Map<string, any> = new Map([
    [`wordle`, Wordle],
    [`wordle-hard`, Wordle],
    [`absurdle`, Absurdle],
    [`absurdle-hard`, Absurdle],
    // TODO: Make Daily class
    [`daily`, Wordle],
]);
export default modeToClass;
