// My birthday :)
const STARTING_DATE = new Date(`2022/02/25`);

export default function getNumberFromDate(date: Date): number {
    date.setHours(0, 0, 0, 0);
    return Math.floor((date.getTime() - STARTING_DATE.getTime()) / (1000 * 60 * 60 * 24));
}
