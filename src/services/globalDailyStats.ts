import Database from "@/lib/database";
import GlobalStats from "@/models/globalStats";
import { getDateFromDayNumber } from "@/utils/dailyNumber";
import Dictionary from "../app/dictionary";

function globalStatsToJson(stats: any, date: Date): any {
    if (!stats) return { date, error: `No stats for this day` };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let code = ``;
    if (+date < +today) {
        code = Dictionary.getInstance().getDailySecretCode(date);
    }
    return {
        date,
        winCount: stats.winCount,
        lossCount: stats.lossCount,
        winAt1: stats.winAt1,
        winAt2: stats.winAt2,
        winAt3: stats.winAt3,
        winAt4: stats.winAt4,
        winAt5: stats.winAt5,
        winAt6: stats.winAt6,
        code,
    };
}

export async function getGlobalStats(dayNumber?: number): Promise<any> {
    const date = getDateFromDayNumber(dayNumber);
    await Database.ensureConnection();
    const stats = await GlobalStats.findOne({ date });
    return globalStatsToJson(stats, date);
}

