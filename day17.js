const fs = require('fs');

const input = fs.readFileSync('./data/input17.txt', 'utf8').trim();

let [A, B, C, ...Program] = input.match(/\d+/gm).map(Number);
let answerP2 = [];
let jump, answer, p2String;

function getOperandValue(x) {
    return [0, 1, 2, 3, A, B, C, null][x];
}

function pow(x) {
    return Math.floor(A / Math.pow(2, getOperandValue(x)));
}

const proc = {
    0: (x) => { A = pow(x); },
    1: (x) => { B = (B ^ x) >>> 0; },
    2: (x) => { B = getOperandValue(x) % 8; },
    3: (x) => { if (A) instructionPointer = x, jump = false; },
    4: (_) => { B = B ^ C; },
    5: (x) => { answer.push(getOperandValue(x) % 8); },
    6: (x) => { B = pow(x); },
    7: (x) => { C = pow(x); },
};

function solve() {
    instructionPointer = 0;
    answer = [];
    while (instructionPointer < Program.length) {
        jump = true;
        const instruction = Program[instructionPointer];
        const operand = Program[instructionPointer + 1];
        proc[instruction](operand);
        if (jump) instructionPointer += 2;
    }
}

solve();
console.log(`Part 1: ${answer.toString()}`);

p2String = [...Program].reverse().join('');

function findValidInitialValue(sum, power) {
    if (power < 0) return;
    for (let i = 0; i < 8; i++) {
        const partialSum = sum + Math.pow(8, power) * i;
        A = partialSum;
        B = 0;
        C = 0;
        solve();

        const str = answer.reverse().join('');
        if (p2String === str) {
            answerP2.push(partialSum);
            return;
        }
        if (p2String.startsWith(str.substring(0, p2String.length - power))) {
            findValidInitialValue(partialSum, power - 1);
        }
    }
}

findValidInitialValue(0, 15);
console.log(`Part 2: ${Math.min(...answerP2)}`);

