const fs = require("fs");

const input = fs.readFileSync('./data/input4.txt', 'utf8').trim().split('\n').map(line => line.split(''));

const XMAS = ['X', 'M', 'A', 'S'];
const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
];

const height = input.length;
const width = input[0].length;

const countXMAS = (x, y) => {
    return directions.reduce((count, [dx, dy]) => {
        let i = 0;
        while (
            x + i * dx >= 0 &&
            x + i * dx < width &&
            y + i * dy >= 0 &&
            y + i * dy < height
            ) {
            if (input[y + i * dy][x + i * dx] !== XMAS[i]) {
                break;
            }
            i++;
        }
        return count + (i === 4 ? 1 : 0);
    }, 0);
};

const isValidXMAS = (x, y) => {
    if (x <= 0 || y <= 0 || x >= width - 1 || y >= height - 1) {
        return false;
    }

    let count = 0;
    const checks = [
        [input[y - 1][x - 1], input[y + 1][x + 1]],
        [input[y + 1][x - 1], input[y - 1][x + 1]]
    ];

    for (const [a, b] of checks) {
        if ((a === 'M' && b === 'S') || (a === 'S' && b === 'M')) {
            count++;
        }
    }

    return count === 2;
};

const part1 = input.reduce((total, row, y) => {
    return total + row.reduce((sum, char, x) => {
        return char === 'X' ? sum + countXMAS(x, y) : sum;
    }, 0);
}, 0);

const part2 = input.reduce((total, row, y) => {
    return total + row.reduce((sum, char, x) => {
        return char === 'A' && isValidXMAS(x, y) ? sum + 1 : sum;
    }, 0);
}, 0);

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);
