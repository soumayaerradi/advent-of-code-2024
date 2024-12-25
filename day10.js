const fs = require("fs");

const input = fs.readFileSync('./data/input10.txt', 'utf8').trim();

const grid = new Map();

input.split("\n").forEach((line, r) => {
    line.split("").forEach((ch, c) => {
        grid.set(`${r},${c}`, ch);
    });
});

const heightMap = new Map();
for (const [key, value] of grid.entries()) {
    if (!heightMap.has(value)) {
        heightMap.set(value, []);
    }
    heightMap.get(value).push(key);
}

const dirs = [
    [1, 0],
    [0, -1],
    [-1, 0],
    [0, 1]
];

const canReach = new Map();
const paths = new Map();
for (const key of grid.keys()) {
    const value = grid.get(key);
    if (value === '0') {
        canReach.set(key, new Set([key]));
        paths.set(key, 1);
    } else {
        canReach.set(key, new Set());
        paths.set(key, 0);
    }
}

for (let h = 0; h <= 9; h++) {
    const heightChar = String.fromCharCode(h + '0'.charCodeAt(0));
    if (!heightMap.has(heightChar)) continue;

    for (const square of heightMap.get(heightChar)) {
        const [r, c] = square.split(",").map(Number);
        for (const [dr, dc] of dirs) {
            const neighbor = `${r + dr},${c + dc}`;
            if (grid.has(neighbor) && (heightChar - grid.get(neighbor)) === 1) {
                const currentSet = canReach.get(square);
                const neighborSet = canReach.get(neighbor);
                for (const n of neighborSet) {
                    currentSet.add(n);
                }

                paths.set(square, paths.get(square) + paths.get(neighbor));
            }
        }
    }
}

const part1 = heightMap.get('9').reduce((sum, square) => {
    return sum + canReach.get(square).size;
}, 0);

const part2 = heightMap.get('9').reduce((sum, square) => {
    return sum + paths.get(square);
}, 0);

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);
