const fs = require('fs');

const input = fs.readFileSync('./data/input20.txt', 'utf8').trim().split('\n');

function parseInput(input) {
    const freeSpace = new Set();
    let start = null;

    input.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            if (char === '.' || char === 'S' || char === 'E') {
                freeSpace.add(`${x},${y}`);
                if (char === 'S') {
                    start = [x, y];
                }
            }
        });
    });

    return { freeSpace, start };
}

function getShortestPaths(start, freeSpaces) {
    const toVisit = [[0, start]];
    const visited = new Map();
    visited.set(start.toString(), 0);

    while (toVisit.length > 0) {
        toVisit.sort((a, b) => a[0] - b[0]);
        const [score, [cx, cy]] = toVisit.shift();

        const directions = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ];

        directions.forEach(([dx, dy]) => {
            const nx = cx + dx;
            const ny = cy + dy;
            const neighbor = `${nx},${ny}`;

            if (freeSpaces.has(neighbor)) {
                const newScore = score + 1;

                if (!visited.has(neighbor) || visited.get(neighbor) > newScore) {
                    visited.set(neighbor, newScore);
                    toVisit.push([newScore, [nx, ny]]);
                }
            }
        });
    }

    return visited;
}

function getSavings(distances, jumpSize) {
    let savings = 0;
    const coords = [...distances.keys()].map(coord => coord.split(',').map(Number));

    coords.forEach(([x1, y1]) => {
        coords.forEach(([x2, y2]) => {
            const cheatCost = Math.abs(x1 - x2) + Math.abs(y1 - y2);
            if (cheatCost <= jumpSize) {
                const initialCost = distances.get(`${x1},${y1}`) - distances.get(`${x2},${y2}`);
                if (initialCost - cheatCost >= 100) {
                    savings++;
                }
            }
        });
    });

    return savings;
}

function part1() {
    const { freeSpace, start } = parseInput(input);
    const distances = getShortestPaths(start, freeSpace);
    return getSavings(distances, 2);
}

function part2() {
    const { freeSpace, start } = parseInput(input);
    const distances = getShortestPaths(start, freeSpace);
    return getSavings(distances, 20);
}

console.log('Part 1:', part1());
console.log('Part 2:', part2());
