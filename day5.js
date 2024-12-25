const fs = require("fs");

const input = fs.readFileSync('./data/input5.txt', 'utf8').trim().split("\n");

const rules = [];
const updates = [];

input.forEach(line => {
    if (line.includes("|")) {
        rules.push(line);
    } else if (line.includes(",")) {
        updates.push(line.split(","));
    }
});

const fixWith = (arr, rules) => {
    return arr.slice().sort((a, b) => {
        return rules.includes(`${a}|${b}`) ? -1 : 1;
    });
};

const part1 = () => {
    const fixedUpdates = updates.map(update => fixWith(update, rules));
    const intersection = fixedUpdates.filter(fixed =>
        updates.some(original => JSON.stringify(original) === JSON.stringify(fixed))
    );

    return intersection.reduce(
        (sum, update) => sum + parseInt(update[Math.floor(update.length / 2)], 10),
        0
    );
};

const part2 = () => {
    const fixedUpdates = updates.map(update => fixWith(update, rules));
    const difference = fixedUpdates.filter(fixed =>
        !updates.some(original => JSON.stringify(original) === JSON.stringify(fixed))
    );

    return difference.reduce(
        (sum, update) => sum + parseInt(update[Math.floor(update.length / 2)], 10),
        0
    );
};

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
