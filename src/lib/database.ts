import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import winston from "winston";

dotenv.config();
const MONGO_URI = process.env.DB_CONN_STRING;
if (!MONGO_URI) {
    throw new Error(`MongoDB connection string is not defined`);
}

export default class Database {
    private static _instance: Database;
    private readonly _logger: winston.Logger;
    private connection: typeof mongoose | null;

    private constructor() {
        this._logger = this.createWinstonLogger();
        this.connection = null;
    }
    
    public static async getInstance() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new Database();
        await this._instance.connect();
        return this._instance;
    }

    public static async ensureConnection() {
        (await this.getInstance()).connect();
    }

    private async connect() {
        if (this.connection) return;
        this.connection = await mongoose
            .connect(MONGO_URI!)
            .catch((e: mongoose.Error) => {
                this._logger.error(`MongoDB connection failed with error: ${e}`)
                return null;
            });
        this._logger.info(`MongoDB connection established successfully`);
    }

    public async disconnect() {
        if (this.connection) {
            await this.connection.disconnect();
            this.connection = null;
        }
    }

    public get models() {
        return this.connection!.models;
    }
    public get modelNames() {
        return Object.keys(this.connection!.models);
    }
    public getModel(modelName: string) {
        return this.connection!.models[modelName];
    }
    public setModelSchema(modelName: string, schema: mongoose.Schema) {
        this.connection!.model(modelName, schema);
    }
    public getModelNames() {
        return Object.keys(this.connection!.models);
    }    
    public getModelSchema(modelName: string) {
        return this.connection!.models[modelName].schema;
    }
    public get logger() {
        return this._logger;
    }

    private createWinstonLogger() {
        return winston.createLogger({
            level: `info`,
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: path.join(__dirname, `../logs.log`),
                    level: `info`,
                }),
            ],
        });
    }
}
