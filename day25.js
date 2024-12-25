const fs = require("fs");

const input = fs.readFileSync("./data/input25.txt", "utf8").trim().split("\n");

const keys = [];
const locks = [];
let currentGroup = [];

for (const line of input) {
    if (line === "") {
        processGroup(currentGroup);
        currentGroup = [];
    } else {
        currentGroup.push(line);
    }
}
if (currentGroup.length > 0) {
    processGroup(currentGroup);
}

function processGroup(group) {
    const counts = Array.from({ length: group[0].length }, (_, i) =>
        group.map((row) => row[i]).filter((c) => c === "#").length
    );

    if (group[0][0] === "#") {
        locks.push(counts);
    } else {
        keys.push(counts);
    }
}

const part1 = () => {
    let count = 0;
    for (const lock of locks) {
        for (const key of keys) {
            if (lock.every((l, i) => l + key[i] < 8)) {
                count++;
            }
        }
    }
    return count;
};

console.log(`Part 1: ${part1()}`);
