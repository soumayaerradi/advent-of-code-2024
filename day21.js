const fs = require('fs');

const input = fs.readFileSync('./data/input21.txt', 'utf8').trim().split('\n');

const keypad1 = [[7, 8, 9], [4, 5, 6], [1, 2, 3], ['', 0, 'A']];
const keypad2 = [['', '^', 'A'], ['<', 'v', '>']];
const numsRobot = {};
const dirsRobot = {};

function mapMovements(keypad, obj, isNumKeypad) {
    const [emptyButtonRow, emptyButtonCol] = [isNumKeypad ? keypad.length - 1 : 0, 0];
    for (let y = 0; y < keypad.length; y++) {
        for (let x = 0; x < keypad[0].length; x++) {
            const button1 = keypad[y][x];
            if (button1 === '') continue;
            for (let y2 = 0; y2 < keypad.length; y2++) {
                for (let x2 = 0; x2 < keypad[0].length; x2++) {
                    const button2 = keypad[y2][x2];

                    if (button2 === '') continue;

                    const hMov = x2 - x;
                    const vMov = y2 - y;

                    const hStr = (hMov > 0 ? '>' : '<').repeat(Math.abs(hMov));
                    const vStr = (vMov > 0 ? 'v' : '^').repeat(Math.abs(vMov));

                    let arrStr = hMov < 0 ? [hStr, vStr] : [vStr, hStr];
                    obj[`${button1}${button2}`] =
                        (x === emptyButtonCol || x2 === emptyButtonCol)
                        && (y === emptyButtonRow || y2 === emptyButtonRow)
                            ? arrStr.reverse().join('') + 'A'
                            : arrStr.join('') + 'A';
                }
            }
        }
    }
}

function solve(part, recursionCount) {
    let answer = 0;

    input.forEach(code => {
        const num = Number(code.replace('A', ''));

        let movesWithCount = numKeypadRobotMovement('A' + code, numsRobot);

        for (let i = 0; i < recursionCount; i++) movesWithCount = dirKeypadRobotMovement(movesWithCount, dirsRobot);

        const totalMovements = Object.values(movesWithCount).reduce((sum, count) => sum + count, 0);

        answer += num * totalMovements;
    });
    console.log(`answer part ${part}: ${answer}`);
}

function numKeypadRobotMovement(code, robot) {
    const movesWithCount = {};
    for (let i = 0; i < code.length - 1; i++) {
        const movement = code[i] + code[i + 1];
        const instruction = robot[movement];

        const move = 'A' + instruction.substring(0,1);

        movesWithCount[move] ||= 0;
        movesWithCount[move]++;
        for (let j = 0; j < instruction.length - 1; j++) {
            const move = instruction[j] + instruction[j + 1];
            movesWithCount[move] ||= 0;
            movesWithCount[move]++;
        }
    }

    return movesWithCount;
}

function dirKeypadRobotMovement(movesWithCount, robot) {
    const newMovesWithCount = {};
    for (const [movement, count] of Object.entries(movesWithCount)) {
        const instruction = robot[movement[0] + movement[1]];
        const move = 'A' + instruction.substring(0, 1);
        newMovesWithCount[move] ||= 0;
        newMovesWithCount[move] += count;
        for (let i = 0; i < instruction.length - 1; i++) {
            const move = instruction[i] + instruction[i + 1];
            newMovesWithCount[move] ||= 0;
            newMovesWithCount[move] += count;
        }
    }
    return newMovesWithCount;
}

mapMovements(keypad1, numsRobot, true);
mapMovements(keypad2, dirsRobot, false);

solve(1, 2);
solve(2, 25);
