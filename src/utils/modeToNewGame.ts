import Absurdle from "@/app/game/absurdle";
import Daily from "@/app/game/daily";
import Wordle from "@/app/game/wordle";

export default function modeToNewGame(mode: string, code: string): any {
    switch (mode) {
        case `wordle`:
            return new Wordle(false, code);
        case `wordle-hard`:
            return new Wordle(true, code);
        case `absurdle`:
            return new Absurdle();
        case `absurdle-hard`:
            return new Absurdle(true);
        case `daily`:
            return new Daily();
        default:
            throw new Error(`No such game mode: ${mode}`);
    }
}
