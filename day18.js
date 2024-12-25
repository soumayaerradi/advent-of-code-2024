const fs = require("fs");

const input = fs.readFileSync('./data/input18.txt', 'utf8').trim().split('\n');

function findPath(grid, maxx, maxy) {
    const start = [0, 0];
    const end = [maxx - 1, maxy - 1];

    if (grid[start[0]][start[1]] === '#' || grid[end[0]][end[1]] === '#') {
        return null;
    }

    const queue = [[start, [start]]];
    const visited = Array.from({ length: maxx }, () => Array(maxy).fill(false));
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    visited[start[0]][start[1]] = true;

    while (queue.length > 0) {
        const [[x, y], path] = queue.shift();

        if (x === end[0] && y === end[1]) {
            return path;
        }

        for (const [dx, dy] of dirs) {
            const nx = x + dx;
            const ny = y + dy;

            if (
                nx >= 0 && nx < maxx && ny >= 0 && ny < maxy &&
                grid[nx][ny] === '.' && !visited[nx][ny]
            ) {
                visited[nx][ny] = true;
                queue.push([[nx, ny], [...path, [nx, ny]]]);
            }
        }
    }

    return null;
}

function part1(blocks = 1024, lines, maxx, maxy) {
    const grid = Array.from({ length: maxx }, () => Array(maxy).fill('.'));

    for (let i = 0; i < Math.min(blocks, lines.length); i++) {
        const [x, y] = lines[i].split(',').map(Number);
        grid[y][x] = '#';
    }

    const path = findPath(grid, maxx, maxy);
    return path ? path.length - 1 : null;
}

function part2(lines, maxx, maxy) {
    let lower = 1024;
    let upper = lines.length;

    while (true) {
        const testval = Math.floor(lower + (upper - lower) / 2);

        if (testval === lower) {
            return lines[lower];
        } else if (part1(testval, lines, maxx, maxy) === null) {
            upper = testval;
        } else {
            lower = testval;
        }
    }
}

const lines = input.map(line => line.trim());
const maxx = 71;
const maxy = 71;

console.log('Part 1:', part1(1024, lines, maxx, maxy));
console.log('Part 2:', part2(lines, maxx, maxy));
