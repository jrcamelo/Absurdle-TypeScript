export default class Stats {
    gameCount: number;
    winCount: number;
    lossCount: number;
    winAt1: number;
    winAt2: number;
    winAt3: number;
    winAt4: number;
    winAt5: number;
    winAt6: number;

    constructor(gameCount: number, 
                winCount: number, 
                lossCount: number, 
                winAt1: number, 
                winAt2: number, 
                winAt3: number, 
                winAt4: number, 
                winAt5: number, 
                winAt6: number) {
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

    static fromPlayer(player: any): Stats {
        return new Stats(
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
}
