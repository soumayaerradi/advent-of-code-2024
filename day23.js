const fs = require('fs');

const input = fs.readFileSync('./data/input23.txt', 'utf8').trim().split('\n');

function solve(inputs, part) {
    const pairs = inputs.reduce((map, line) => {
        const [lhs, rhs] = line.split('-');
        if (!map.has(lhs)) map.set(lhs, new Set());
        if (!map.has(rhs)) map.set(rhs, new Set());
        map.get(lhs).add(rhs);
        map.get(rhs).add(lhs);
        return map;
    }, new Map());

    const connections = new Set();

    for (const [lhs, pcs] of pairs.entries()) {
        for (const rhs of pcs) {
            const mini = new Set([lhs, rhs]);
            for (const other of pcs) {
                if (
                    part === 1 &&
                    pairs.get(rhs)?.has(other) &&
                    (lhs.startsWith('t') || rhs.startsWith('t') || other.startsWith('t'))
                ) {
                    connections.add([lhs, rhs, other].sort().join(','));
                } else if ([...mini].every(m => pairs.get(m)?.has(other))) {
                    mini.add(other);
                }
            }
            if (part === 2) {
                connections.add([...mini].sort().join(','));
            }
        }
    }

    return part === 1
        ? connections.size
        : [...connections].reduce((longest, current) => (current.length > longest.length ? current : longest), '');
}

console.log('Part 1:', solve(input, 1));
console.log('Part 2:', solve(input, 2));

