import { PathOrFileDescriptor, readFileSync } from 'fs';
import * as Path from 'path';

const DATA_FOLDER = "./data/"
const WORDS_FILE = "words.txt";
const SECRETS_FILE = "secrets.txt";

export default class Dictionary {
    private static _instance: Dictionary;
    
    private _valid_words: string[];
    private _valid_words_map: Map<string, boolean>;
    private _secrets: string[];

    private constructor() {
        const words = this.readWordsFile();
        this._secrets = this.readSecretsFile();
        this._valid_words = words.concat(this._secrets);
        this._valid_words_map = this.listToMap(this._valid_words);
    }

    public static getInstance(): Dictionary {
        if (!Dictionary._instance) {
            Dictionary._instance = new Dictionary();
        }
        return Dictionary._instance;
    }

    public getValidWords(): string[] {
        return this._valid_words;
    }

    public getValidWordsMap(): Map<string, boolean> {
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


    private readWordsFile(): string[] {
        return this.readFileAsArray(Path.resolve(DATA_FOLDER, WORDS_FILE));
    }

    private readSecretsFile(): string[] {
        return this.readFileAsArray(Path.resolve(DATA_FOLDER, SECRETS_FILE));
    }

    private readFileAsArray(path: PathOrFileDescriptor): string[] {
        return readFileSync(path, "utf8").split("\r\n");
    }
    
    private listToMap(list: string[]): Map<string, boolean> {
        const map = new Map<string, boolean>();
        list.forEach(word => {
            map.set(word, false);
        });
        return map;
    }
}

