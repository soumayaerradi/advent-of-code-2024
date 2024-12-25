const fs = require("fs");

const input = fs.readFileSync('./data/input3.txt', 'utf8').trim();

const pattern1 = /mul\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/g;
const pattern2 = /do\(\)|don't\(\)|mul\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/g;

const calculateSum = (pattern, processInstruction) => {
    let result = 0;
    let match;

    while ((match = pattern.exec(input)) !== null) {
        result += processInstruction(match);
    }

    return result;
};

const part1 = calculateSum(pattern1, (match) => {
    const x = parseInt(match[1], 10);
    const y = parseInt(match[2], 10);
    return x * y;
});

const part2 = calculateSum(pattern2, (() => {
    let state = true;
    return (match) => {
        const instruction = match[0];
        if (instruction === "do()") {
            state = true;
            return 0;
        }
        if (instruction === "don't()") {
            state = false;
            return 0;
        }
        if (state && instruction.startsWith("mul(")) {
            const x = parseInt(match[1], 10);
            const y = parseInt(match[2], 10);
            return x * y;
        }
        return 0;
    };
})());

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);
