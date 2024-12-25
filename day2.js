const fs = require("fs");

const input = fs.readFileSync('./data/input2.txt', 'utf8').trim();

const data = input.split("\n").map((line) => line.trim().split(/\s+/).map(Number));

const isSafe = (row) => {
    const diffs = row.slice(1).map((val, i) => val - row[i]);
    const validDiffs = new Set(diffs);

    const isIncreasing = [...validDiffs].every((d) => d >= 1 && d <= 3);
    const isDecreasing = [...validDiffs].every((d) => d <= -1 && d >= -3);

    return isIncreasing || isDecreasing;
};

const part1 = data.filter((row) => isSafe(row)).length;

const part2 = data.filter((row) =>
    row.some((_, i) => isSafe([...row.slice(0, i), ...row.slice(i + 1)]))
).length;

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);
