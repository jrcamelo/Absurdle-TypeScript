// Exception for game
// Should take a message

export default class GameException extends Error {
    statusCode: number;

    constructor(message: string, code = 401) {
        super(message);
        this.statusCode = code;
    }

    toJson(): object {
        return {
            statusCode: 401,
            body: JSON.stringify({
                error: `You lack a cookie token, please start a new game`,
            }),
        };
    }
}
