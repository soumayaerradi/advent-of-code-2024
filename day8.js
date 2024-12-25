const fs = require("fs");

const input = fs.readFileSync("./data/input8.txt", "utf8").trim().split("\n");

const grid = input.map((line) => line.split(""));

function parseNodes(grid) {
    const nodes = new Map();
    grid.forEach((row, x) => {
        row.forEach((char, y) => {
            if (char !== ".") {
                nodes.set(char, (nodes.get(char) || []).concat([[x, y]]));
            }
        });
    });
    return nodes;
}

function calculateAnodes(grid, nodes) {
    const anodes1 = new Set();
    const anodes2 = new Set();

    const inBounds = ([x, y]) => x >= 0 && x < grid.length && y >= 0 && y < grid[0].length;
    const addToSet = (set, position) => {
        if (inBounds(position)) set.add(position.join(","));
    };

    for (const positions of nodes.values()) {
        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const [a, b] = [positions[i], positions[j]];
                const vector = [b[0] - a[0], b[1] - a[1]];

                addToSet(anodes1, [a[0] - vector[0], a[1] - vector[1]]);
                addToSet(anodes1, [b[0] + vector[0], b[1] + vector[1]]);

                let pos = [...a];
                while (inBounds(pos)) {
                    anodes2.add(pos.join(","));
                    pos = [pos[0] - vector[0], pos[1] - vector[1]];
                }
                pos = [...b];
                while (inBounds(pos)) {
                    anodes2.add(pos.join(","));
                    pos = [pos[0] + vector[0], pos[1] + vector[1]];
                }
            }
        }
    }

    return { part1: anodes1.size, part2: anodes2.size };
}

const nodes = parseNodes(grid);
const { part1, part2 } = calculateAnodes(grid, nodes);

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);
