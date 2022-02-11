import { PathOrFileDescriptor, readFileSync } from "fs";
import { shuffle } from "shuffle-seed";
import * as base32 from "hi-base32";
import * as Path from "path";
import getNumberFromDate from "@/utils/dailyNumber";

const DATA_FOLDER = `./data/`;
const WORDS_FILE = `words.txt`;
const SECRETS_FILE = `secrets.txt`;

export default class Dictionary {
    private static _instance: Dictionary;

    private _valid_words: string[];
    private _valid_words_map: Map<string, number>;
    private _secrets: string[];
    private _secrets_map: Map<string, number>;

    private constructor() {
        this._secrets = this.getShuffledSecrets();
        this._valid_words = this.getShuffledValidWords();
        this._valid_words_map = this.listToMap(this._valid_words);
        this._secrets_map = this.listToMap(this._secrets);
    }

    public static getInstance(): Dictionary {
        if (!Dictionary._instance) {
            Dictionary._instance = new Dictionary();
        }
        return Dictionary._instance;
    }

    public getTodaysSecret(): string {
        const today = new Date();
        return this.getDailySecret(today);
    }

    public getDailySecret(date: Date): string {
        return this.getSecretFromNumber(getNumberFromDate(date));
    }

    public getCodeForAnswer(answer: string): string {
        const fake = this.getFakeFromSecret(answer)!;
        return base32.encode(fake);
    }

    public getAnswerFromCode(code: string): string | null {
        const fake = base32.decode(code);
        return this.getSecretFromFake(fake);
    }

    public getValidWords(): string[] {
        return this._valid_words;
    }

    public getValidWordsMap(): Map<string, number> {
        return this._valid_words_map;
    }

    public getSecrets(): string[] {
        return this._secrets;
    }

    public getRandomSecret(): string {
        const randomIndex = Math.floor(Math.random() * this._secrets.length);
        return this._secrets[randomIndex];
    }

    public isValidWord(word: string): boolean {
        return this._valid_words_map.has(word);
    }

    private getSecretFromNumber(number: number): string {
        const limit = this._secrets.length;
        const secretIndex = ((number % limit) + limit) % limit;
        return this._secrets[secretIndex];
    }

    private getFakeFromSecret(secret: string): string | null {
        const index = this._secrets_map.get(secret);
        if (!index) return null;
        return this._valid_words[index];
    }

    private getSecretFromFake(word: string): string | null {
        const index = this._valid_words_map.get(word);
        if (!index) return null;
        return this._secrets[index];
    }

    private readWordsFile(): string[] {
        return this.readFileAsArray(Path.resolve(DATA_FOLDER, WORDS_FILE));
    }

    private getShuffledSecrets(): string[] {
        return shuffle(this.readSecretsFile(), process.env.DAILY_SEED);
    }

    private getShuffledValidWords(): string[] {
        const words = this.readWordsFile().concat(this.getSecrets());
        return shuffle(words, process.env.VALID_WORDS_SEED);
    }

    private readSecretsFile(): string[] {
        return this.readFileAsArray(Path.resolve(DATA_FOLDER, SECRETS_FILE));
    }

    private readFileAsArray(path: PathOrFileDescriptor): string[] {
        return readFileSync(path, `utf8`).split(`\r\n`);
    }

    private listToMap(list: string[]): Map<string, number> {
        const map = new Map<string, number>();
        for (let i = 0; i < list.length; i++) {
            map.set(list[i], i);
        }
        return map;
    }
}
