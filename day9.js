const fs = require("fs");

const input = fs.readFileSync("./data/input9.txt", "utf8").trim();

const parseInput = (isPartTwo = false) => {
    const res = [];
    const freeSpaces = [];
    const files = [];

    input.split("").forEach((char, i) => {
        const count = parseInt(char, 10);
        const id = Math.floor(i / 2).toString();

        if (i % 2 === 0) {
            if (isPartTwo) files.push({ id, idx: res.length, count });
            res.push(...Array(count).fill(id));
        } else {
            if (isPartTwo) freeSpaces.push({ idx: res.length, count });
            res.push(...Array(count).fill("."));
        }
    });

    return { res, freeSpaces, files };
};

const rearrangeP1 = () => {
    const { res: raw } = parseInput();
    const result = [];
    let i = 0, j = raw.length - 1;

    while (i <= j) {
        if (raw[i] === ".") {
            result.push(raw[j--]);
            while (j >= 0 && raw[j] === ".") j--;
        } else {
            result.push(raw[i]);
        }
        i++;
    }

    return result;
};

const rearrangeP2 = () => {
    const { res: raw, freeSpaces, files } = parseInput(true);
    files.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));

    for (const { id, idx: fileIdx, count: fileCount } of files) {
        const bestFit = freeSpaces.find(({ idx, count }) => idx <= fileIdx && count >= fileCount);

        if (bestFit) {
            raw.fill(id, bestFit.idx, bestFit.idx + fileCount);
            raw.fill(".", fileIdx, fileIdx + fileCount);

            bestFit.idx += fileCount;
            bestFit.count -= fileCount;
            if (bestFit.count === 0) freeSpaces.splice(freeSpaces.indexOf(bestFit), 1);
        }
    }

    return raw;
};

const checksum = (res) =>
    res.reduce((sum, char, idx) => sum + (char !== "." ? idx * parseInt(char, 10) : 0), 0);

console.log("Part 1:", checksum(rearrangeP1()));
console.log("Part 2:", checksum(rearrangeP2()));
