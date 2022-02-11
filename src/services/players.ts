import Database from "@/lib/database";
import Player from "@/models/player";
import { uuid } from "uuidv4";
import ApiError from '../utils/apiError';
import { GameMode } from '../app/constants';
import PlayerStats from '../app/playerStats';
import GlobalStats from "@/models/globalStats";

export async function getPlayer(userToken: string): Promise<typeof Player | undefined> {
    if (!userToken) return undefined;
    await Database.ensureConnection();
    const player = await Player.findOne({ userToken });
    return player;
}

export async function saveNewPlayerAndGetToken(): Promise<string> {
    await Database.ensureConnection();
    let valid = false;
    let userToken = ``;
    let i = 0;
    while (!valid) {
        if (i++ >= 10) throw new ApiError(`Could not create new player`);
        userToken = uuid();
        if (!(await Player.findOne({ userToken }))) valid = true;
    }
    const newPlayer = new Player({ userToken });
    await newPlayer.save();
    return userToken;
}

export async function addNewGame(userToken: string, game: any): Promise<typeof Player> {
    if (!userToken) throw new ApiError(`No user token`);
    await Database.ensureConnection();
    const player = await Player.findOne({ userToken });
    if (!player) throw new ApiError(`No player`);
    if (game.mode == GameMode.DAILY) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (+player.lastDailyGame == +today) {
            throw new ApiError(`You have already played today's game`, 400);
        }   
        player.lastDailyGame = today;
    }
    player.gameCount++;
    player.ongoingGame = game;
    await player.save();
    return player;
}

export async function getOngoingGame(userToken: string): Promise<any> {
    if (!userToken) throw new ApiError(`No user token`);
    await Database.ensureConnection();
    const player = await Player.findOne({ userToken });
    if (!player) throw new ApiError(`No player`);
    return player.ongoingGame;
}

export async function updateOngoingGame(userToken: string, game: any): Promise<typeof Player> {
    if (!userToken) throw new ApiError(`No user token`);
    await Database.ensureConnection();
    const player = await Player.findOne({ userToken });
    if (!player) throw new ApiError(`No player`);
    player.ongoingGame = game;
    await player.save();
    return player;
}

export async function finishGame(userToken: string, game: any): Promise<typeof Player> {
    if (!userToken) throw new ApiError(`No user token`);
    await Database.ensureConnection();
    const player = await Player.findOne({ userToken });
    if (!player) throw new ApiError(`No player`);
    if (player.ongoingGame) {
        player.games.push(player.ongoingGame);
        player.ongoingGame = undefined;
    }
    if (game.mode == GameMode.DAILY) {
        await saveDailyStats(game, player);
    }
    await player.save();
    return player;
}

async function saveDailyStats(game: any, player: any) {
    const date = new Date(game.createdAt);
    date.setHours(0, 0, 0, 0);
    let globalStats = await GlobalStats.findOne({ date });
    if (!globalStats) {
        globalStats = await GlobalStats.create({ date })
    }
    const stats = PlayerStats.fromGame(game);
    PlayerStats.addToPlayer(game, player);
    globalStats.winCount += stats.winCount;
    globalStats.lossCount += stats.lossCount;
    globalStats.winAt1 += stats.winAt1;
    globalStats.winAt2 += stats.winAt2;
    globalStats.winAt3 += stats.winAt3;
    globalStats.winAt4 += stats.winAt4;
    globalStats.winAt5 += stats.winAt5;
    globalStats.winAt6 += stats.winAt6;
    await globalStats.save();
}

export async function quitOngoingGame(userToken: string): Promise<typeof Player> {
    if (!userToken) throw new ApiError(`No user token`);
    await Database.ensureConnection();
    const player = await Player.findOne({ userToken });
    if (!player) throw new ApiError(`No player`);
    player.ongoingGame = undefined;
    await player.save();
    return player;
}

export async function getPlayerStats(userToken: string): Promise<PlayerStats> {
    if (!userToken) throw new ApiError(`No user token`);
    await Database.ensureConnection();
    const player = await Player.findOne({ userToken });
    if (!player) throw new ApiError(`No player`);
    return PlayerStats.fromPlayer(player);
}