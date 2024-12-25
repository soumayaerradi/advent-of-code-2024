const fs = require('fs');

const input = fs.readFileSync('./data/input22.txt', 'utf8').trim().split('\n').map(Number);

class PRNG {
    constructor(seed) {
        this.seed = seed;
        this.mask = (1 << 24) - 1;
    }

    nex() {
        this.seed ^= (this.seed << 6) & this.mask;
        this.seed ^= (this.seed >> 5) & this.mask;
        this.seed ^= (this.seed << 11) & this.mask;
        return this.seed;
    }
}

function part1() {
    let totalSum = 0;

    for (const seed of input) {
        const generator = new PRNG(seed);
        let result = 0;

        for (let i = 0; i < 2000; i++) {
            result = generator.nex();
        }

        totalSum += result;
    }

    return totalSum;
}

function part2() {
    const counter = new Map();

    for (const seed of input) {
        const generator = new PRNG(seed);
        const seen = new Set();
        const window = [];
        let lastDigit = seed % 10;

        for (let i = 0; i < 2000; i++) {
            const nextDigit = generator.nex() % 10;
            window.push(nextDigit - lastDigit);

            if (window.length > 4) {
                window.shift();
            }

            if (window.length === 4) {
                const key = JSON.stringify(window);

                if (!seen.has(key)) {
                    const currentValue = counter.get(key) || 0;
                    counter.set(key, currentValue + nextDigit);
                    seen.add(key);
                }
            }

            lastDigit = nextDigit;
        }
    }

    let maxValue = 0;

    for (const value of counter.values()) {
        maxValue = Math.max(maxValue, value);
    }

    return maxValue;
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);

