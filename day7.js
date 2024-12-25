const fs = require("fs");

const input = fs.readFileSync("./data/input7.txt", "utf8").trim().split("\n");

const equations = input.map((line) => {
    const [testValue, nums] = line.split(":");
    return {
        testValue: parseInt(testValue.trim(), 10),
        numbers: nums.trim().split(" ").map(Number),
    };
});

function solve(equations, withConcat = false) {
    const canAchieveTarget = (target, numbers) => {
        const helper = (currentValue, index) => {
            if (index === numbers.length) {
                return currentValue === target;
            }
            const nextNumber = numbers[index];
            if (helper(currentValue + nextNumber, index + 1)) return true;
            if (helper(currentValue * nextNumber, index + 1)) return true;
            if (withConcat) {
                const concatenatedValue = parseInt(`${currentValue}${nextNumber}`);
                if (helper(concatenatedValue, index + 1)) return true;
            }
            return false;
        };
        return helper(numbers[0], 1);
    };

    return equations.reduce((sum, { testValue, numbers }) => {
        return canAchieveTarget(testValue, numbers) ? sum + testValue : sum;
    }, 0);
}

const part1 = solve(equations);
const part2 = solve(equations, true);

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);
