const fs = require("fs");

const input = fs.readFileSync("./data/input11.txt", "utf8").trim().split(" ").map(Number);

const solve = (() => {
    const memory = new Map();

    const recursiveSolve = (stone, blinks) => {
        if (blinks === 0) return 1;

        const key = `${stone},${blinks}`;
        if (memory.has(key)) return memory.get(key);

        let result;
        if (stone === 0) {
            result = recursiveSolve(1, blinks - 1);
        } else {
            const strStone = stone.toString();
            if (strStone.length % 2 === 0) {
                const mid = strStone.length / 2;
                const left = parseInt(strStone.slice(0, mid), 10);
                const right = parseInt(strStone.slice(mid), 10);
                result = recursiveSolve(left, blinks - 1) + recursiveSolve(right, blinks - 1);
            } else {
                result = recursiveSolve(stone * 2024, blinks - 1);
            }
        }

        memory.set(key, result);
        return result;
    };

    return recursiveSolve;
})();

const part1 = input.reduce((sum, stone) => sum + solve(stone, 25), 0);
const part2 = input.reduce((sum, stone) => sum + solve(stone, 75), 0);

console.log("Part 1:", part1);
console.log("Part 2:", part2);
