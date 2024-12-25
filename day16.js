const fs = require('fs');

const input = fs.readFileSync('./data/input16.txt', 'utf8').trim();

const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
const yx = {};
const map = input.split('\n').map(line => line.split(''));
let answerp1 = Infinity;
let answerp2 = new Set();
let S, E;

for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
        if (map[y][x] === 'S') S = [y, x];
        if (map[y][x] === 'E') E = [y, x];
        if (map[y][x] !== '#') yx[`${y},${x}`] = {
            '-1,0': Infinity,
            '0,1': Infinity,
            '1,0': Infinity,
            '0,-1': Infinity
        };
    }
}

function solve(part2) {
    const queue = [];
    queue.push({ pos: S, dir: [0, 1], score: 0, path: part2 ? new Set([`${S[0]},${S[1]}`]) : null });

    while (queue.length) {
        const { pos: [y, x], dir, score, path } = queue.shift();

        if (score > answerp1) continue;

        if (y === E[0] && x === E[1]) {
            if (score < answerp1) {
                answerp1 = score;
                if (part2) answerp2 = new Set(path);
            } else if (part2 && score === answerp1) {
                answerp2 = new Set([...answerp2, ...path]);
            }
            continue;
        }

        dirs.forEach(([dy, dx]) => {
            const newY = y + dy;
            const newX = x + dx;
            let cost = score;

            if (map[newY][newX] === '#' || dir[0] * dy + dir[1] * dx === -1) return;

            cost += dir[0] * dy + dir[1] * dx === 1 ? 1 : 1001;

            if (yx[`${newY},${newX}`][`${dy},${dx}`] < (part2 ? cost : cost + 1)) return;

            yx[`${newY},${newX}`][`${dy},${dx}`] = cost;

            queue.push({
                pos: [newY, newX],
                dir: [dy, dx],
                score: cost,
                path: part2 ? new Set([...path, `${newY},${newX}`]) : null
            });
        });
    }
}

solve();
solve(true);

console.log(`Part 1: ${answerp1}`);
console.log(`Part 2: ${answerp2.size}`);
