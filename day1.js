const fs = require("fs");

const input = fs.readFileSync('./data/input.txt', 'utf8').trim();

const lines = input.split("\n");

const leftList = [];
const rightList = [];

lines.forEach((line) => {
    const [left, right] = line.trim().split(/\s+/).map(Number);
    leftList.push(left);
    rightList.push(right);
});

const sortedLeft = [...leftList].sort((a, b) => a - b);
const sortedRight = [...rightList].sort((a, b) => a - b);

const remArray = sortedLeft.map((value, index) => Math.abs(sortedRight[index] - value));
const part1 = remArray.reduce((a, b) => a + b, 0);

const rightArrayObj = new Map();
rightList.forEach((num) => {
    rightArrayObj.set(num, (rightArrayObj.get(num) || 0) + 1);
});

let totalSimilarityScore = 0;
leftList.forEach((num) => {
    if (rightArrayObj.has(num)) {
        totalSimilarityScore += num * rightArrayObj.get(num);
    }
});

const part2 = totalSimilarityScore;

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);
