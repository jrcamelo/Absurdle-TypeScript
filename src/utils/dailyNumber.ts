// My birthday :)
const STARTING_DATE = new Date(`2022/02/25`);
const DAY_MS = 1000 * 60 * 60 * 24;

export function getNumberFromDate(date: Date): number {
    date.setHours(0, 0, 0, 0);
    return Math.floor((date.getTime() - STARTING_DATE.getTime()) / DAY_MS);
}

export function getDateFromDayNumber(dayNumber?: number): Date {
    let date = new Date();
    if (dayNumber) {
        date = new Date(STARTING_DATE.getTime() + dayNumber * DAY_MS);
    }
    date.setHours(0, 0, 0, 0);
    return date;
}
