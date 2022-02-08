import Database from "@/lib/database";
import Player from "@/models/player";
import { uuid } from 'uuidv4';

export async function getPlayer(userToken: string): Promise<typeof Player | undefined> {
    if (!userToken) return undefined;
    await Database.ensureConnection();
    const player = await Player.findOne({ userToken });
    return player;
}

export async function saveNewPlayerAndGetToken(): Promise<string> {
    await Database.ensureConnection();
    let valid = false;
    let userToken: string = "";
    let i = 0;
    while (!valid) {
        if (i++ >= 10) throw new Error("Could not create new player");
        userToken = uuid();
        if (!await Player.findOne({ userToken })) valid = true;
    }
    const newPlayer = new Player({ userToken });
    await newPlayer.save();
    return userToken;
}

export async function addNewGame(userToken: string, game: any): Promise<typeof Player> {
    if (!userToken) throw new Error("No user token");
    await Database.ensureConnection();
    const player = await Player.findOne({ userToken });
    if (!player) throw new Error("No player");
    player.gameCount++;
    player.ongoingGame = game;
    await player.save();
    return player;
}

export async function getOngoingGame(userToken: string): Promise<any> {
    if (!userToken) throw new Error("No user token");
    await Database.ensureConnection();
    const player = await Player.findOne({ userToken });
    if (!player) throw new Error("No player");
    return player.ongoingGame;
}

export async function updateOngoingGame(userToken: string, game: any): Promise<typeof Player> {
    if (!userToken) throw new Error("No user token");
    await Database.ensureConnection();
    const player = await Player.findOne({ userToken });
    if (!player) throw new Error("No player");
    player.ongoingGame = game;
    await player.save();
    return player;
}

export async function finishGame(userToken: string, game: any): Promise<typeof Player> {
    if (!userToken) throw new Error("No user token");
    await Database.ensureConnection();
    const player = await Player.findOne({ userToken });
    if (!player) throw new Error("No player");
    if (player.ongoingGame) {
        player.games.push(player.ongoingGame);
        player.ongoingGame = undefined;
    }
    if (game.gameState === `won`) {
        player.winCount++;
        player.winAt1 += game.tries === 6 ? 1 : 0;
        player.winAt2 += game.tries === 5 ? 1 : 0;
        player.winAt3 += game.tries === 4 ? 1 : 0;
        player.winAt4 += game.tries === 3 ? 1 : 0;
        player.winAt5 += game.tries === 2 ? 1 : 0;
        player.winAt6 += game.tries === 1 ? 1 : 0;
    } else {
        player.lossCount++;
    }
    await player.save();
    return player;
}

export async function quitOngoingGame(userToken: string): Promise<typeof Player> {
    if (!userToken) throw new Error("No user token");
    await Database.ensureConnection();
    const player = await Player.findOne({ userToken });
    if (!player) throw new Error("No player");
    player.ongoingGame = undefined;
    await player.save();
    return player;
}
