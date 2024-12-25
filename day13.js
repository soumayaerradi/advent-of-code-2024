const fs = require("fs");

const input = fs.readFileSync("./data/input13.txt", 'utf8').trim().split("\n\n");

const add = (a, b) => [a[0] + b[0], a[1] + b[1]];

const extractInt = (s) => parseInt(s.replace(/\D/g, ''), 10);

const games = [];

input.forEach((game) => {
    const lines = game.split("\n");

    const gameMap = {};

    const [_, __, xA, yA] = lines[0]?.split(" ") || [];
    const [___, ____, xB, yB] = lines[1]?.split(" ") || [];
    const [_____, xP, yP] = lines[2]?.split(" ") || [];

    gameMap.A = [extractInt(xA), extractInt(yA)];
    gameMap.B = [extractInt(xB), extractInt(yB)];
    gameMap.Prize = [extractInt(xP), extractInt(yP)];

    games.push(gameMap);
});

const solveSystem = (A, B, P) => {
    const d = A[0] * B[1] - A[1] * B[0];
    const y = (P[1] * A[0] - P[0] * A[1]) / d;
    const x = (P[0] - B[0] * y) / A[0];
    return [x, y];
};

const part1 = (games) => {
    let minCost = 0;

    games.forEach(({Prize, A, B}) => {
        const [x, y] = solveSystem(A, B, Prize);
        if (Number.isInteger(x) && Number.isInteger(y)) {
            minCost += x * 3 + y;
        }
    });

    return minCost;
};

const part2 = (games) => {
    let minCost = 0;
    const offset = 10000000000000;

    games.forEach(({Prize, A, B}) => {
        const adjustedPrize = add(Prize, [offset, offset]);
        const [x, y] = solveSystem(A, B, adjustedPrize);
        if (Number.isInteger(x) && Number.isInteger(y)) {
            minCost += x * 3 + y;
        }
    });

    return minCost;
};

console.log(`Part 1: ${part1(games)}`);
console.log(`Part 2: ${part2(games)}`);

