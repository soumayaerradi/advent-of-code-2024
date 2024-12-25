const fs = require("fs");

const input = fs.readFileSync("./data/input6.txt", "utf8").trim().split("\n");

const grid = new Map();
input.forEach((line, y) => {
    line.split("").forEach((char, x) => {
        grid.set(`${x},${y}`, char);
    });
});

const directions = [
    [0, -1],  // Up
    [1, 0],   // Right
    [0, 1],   // Down
    [-1, 0],  // Left
];

function nextPosition([x, y], dir) {
    return [x + directions[dir][0], y + directions[dir][1]];
}

function patrol(grid) {
    const visited = new Set();
    const tracked = new Set();

    let start = Array.from(grid.entries()).find(([, value]) => value === "^")?.[0];
    if (!start) return visited;
    let [x, y] = start.split(",").map(Number);

    let direction = 0;

    while (true) {
        const stateKey = `${direction},${x},${y}`;
        if (tracked.has(stateKey)) return new Set();
        tracked.add(stateKey);

        const [nx, ny] = nextPosition([x, y], direction);
        const nextKey = `${nx},${ny}`;

        if (!grid.has(nextKey)) break;
        if (grid.get(nextKey) === "#") {
            direction = (direction + 1) % 4;
        } else {
            visited.add(nextKey);
            x = nx;
            y = ny;
        }
    }

    return visited;
}

const part1 = patrol(grid).size + 1;

const emptyCells = Array.from(grid.keys()).filter((key) => grid.get(key) === ".");
let part2 = 0;

emptyCells.forEach((obstacle) => {
    const updatedGrid = new Map(grid);
    updatedGrid.set(obstacle, "#");
    if (patrol(updatedGrid).size === 0) {
        part2++;
    }
});

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);
