import { GameState } from "./constants";

export default class PlayerStats {
    gameCount: number;
    winCount: number;
    lossCount: number;
    winAt1: number;
    winAt2: number;
    winAt3: number;
    winAt4: number;
    winAt5: number;
    winAt6: number;

    constructor(
        gameCount: number,
        winCount: number,
        lossCount: number,
        winAt1 = 0,
        winAt2 = 0,
        winAt3 = 0,
        winAt4 = 0,
        winAt5 = 0,
        winAt6 = 0,
    ) {
        this.gameCount = gameCount;
        this.winCount = winCount;
        this.lossCount = lossCount;
        this.winAt1 = winAt1;
        this.winAt2 = winAt2;
        this.winAt3 = winAt3;
        this.winAt4 = winAt4;
        this.winAt5 = winAt5;
        this.winAt6 = winAt6;
    }

    toJson() {
        return {
            gameCount: this.gameCount,
            winCount: this.winCount,
            lossCount: this.lossCount,
            winAt1: this.winAt1,
            winAt2: this.winAt2,
            winAt3: this.winAt3,
            winAt4: this.winAt4,
            winAt5: this.winAt5,
            winAt6: this.winAt6,
        };
    }

    static fromPlayer(player: any): PlayerStats {
        return new PlayerStats(
            player.gameCount,
            player.winCount,
            player.lossCount,
            player.winAt1,
            player.winAt2,
            player.winAt3,
            player.winAt4,
            player.winAt5,
            player.winAt6,
        );
    }

    static fromGame(game: any): PlayerStats {
        if (game.gameState == GameState.WON) {
            const winCount = 1;
            const winAt1 = game.tries === 6 ? 1 : 0;
            const winAt2 = game.tries === 5 ? 1 : 0;
            const winAt3 = game.tries === 4 ? 1 : 0;
            const winAt4 = game.tries === 3 ? 1 : 0;
            const winAt5 = game.tries === 2 ? 1 : 0;
            const winAt6 = game.tries === 1 ? 1 : 0;
            return new PlayerStats(1, winCount, 0, winAt1, winAt2, winAt3, winAt4, winAt5, winAt6);
        } else if (game.gameState == GameState.LOST) {
            return new PlayerStats(1, 0, 1);
        } else {
            return new PlayerStats(1, 0, 0);
        }
    }

    static addToPlayer(game: any, player: any): any {
        const stats = this.fromGame(game);
        player.gameCount += stats.gameCount;
        player.winCount += stats.winCount;
        player.lossCount += stats.lossCount;
        player.winAt1 += stats.winAt1;
        player.winAt2 += stats.winAt2;
        player.winAt3 += stats.winAt3;
        player.winAt4 += stats.winAt4;
        player.winAt5 += stats.winAt5;
        player.winAt6 += stats.winAt6;
        return player;
    }
}
