const fs = require('fs');

const input = fs.readFileSync('./data/input19.txt', 'utf8').trim().split('\n');

function canBeConstructed(design, patterns) {
    const dp = Array(design.length + 1).fill(false);
    dp[0] = true;

    for (let i = 1; i <= design.length; i++) {
        for (const pattern of patterns) {
            if (i >= pattern.length && design.slice(i - pattern.length, i) === pattern) {
                dp[i] = dp[i] || dp[i - pattern.length];
            }
        }
    }

    return dp[design.length];
}

function part1() {
    const patterns = input[0].split(', ');
    return input.slice(2).filter(design => canBeConstructed(design, patterns)).length;
}


function countPaths(design, patterns, cache) {
    if (design === '') return 1;

    if (cache[design] !== undefined) {
        return cache[design];
    }

    const totalPaths = patterns
        .filter(pattern => design.startsWith(pattern))
        .reduce((sum, pattern) => sum + countPaths(design.slice(pattern.length), patterns, cache), 0);

    cache[design] = totalPaths;
    return totalPaths;
}

function part2() {
    const patterns = input[0].split(', ');
    const cache = {};
    return input.slice(2).reduce((sum, design) => sum + countPaths(design, patterns, cache), 0);
}

console.log('Part 1:', part1());
console.log('Part 2:', part2());
