import Absurdle from "@/app/game/absurdle";
import Wordle from "@/app/game/wordle";
import Daily from "@/app/game/daily";

export default function modeToFromJson(mode: string, json: any): Daily | Wordle | Absurdle {
    switch (mode) {
        case `wordle`:
        case `wordle-hard`:
            return Wordle.fromJson(json);
        case `absurdle`:
        case `absurdle-hard`:
            return Absurdle.fromJson(json);
        case `daily`:
            return Daily.fromJson(json);
        default:
            throw new Error(`No such game mode: ${mode}`);
    }
}
