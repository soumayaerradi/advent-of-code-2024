const fs = require("fs");

const input = fs.readFileSync("./data/input14.txt", "utf8").trim().split("\n");

class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `${this.x},${this.y}`;
    }
}

class Robot {
    constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
    }

    static readRobot(line) {
        const [px, py, vx, vy] = line.match(/-?\d+/g).map(Number);
        return new Robot(new Coord(px, py), new Coord(vx, vy));
    }

    move(steps, width, height) {
        let newX = (this.position.x + this.velocity.x * steps) % width;
        let newY = (this.position.y + this.velocity.y * steps) % height;
        if (newX < 0) newX += width;
        if (newY < 0) newY += height;
        this.position = new Coord(newX, newY);
    }
}

function part1() {
    const robots = input.map(Robot.readRobot);

    const width = 101;
    const height = 103;

    robots.forEach((robot) => robot.move(100, width, height));

    let quadrant1 = 0;
    let quadrant2 = 0;
    let quadrant3 = 0;
    let quadrant4 = 0;

    const middleX = Math.floor(width / 2);
    const middleY = Math.floor(height / 2);

    robots.forEach((robot) => {
        const { x, y } = robot.position;
        if (x > middleX && y > middleY) quadrant4++;
        if (x > middleX && y < middleY) quadrant2++;
        if (x < middleX && y > middleY) quadrant3++;
        if (x < middleX && y < middleY) quadrant1++;
    });

    return quadrant1 * quadrant2 * quadrant3 * quadrant4;
}

function part2() {
    const robots = input.map(Robot.readRobot);

    const width = 101;
    const height = 103;

    let steps = 1;
    while (true) {
        robots.forEach((robot) => {
            let newX = (robot.position.x + robot.velocity.x) % width;
            let newY = (robot.position.y + robot.velocity.y) % height;
            if (newX < 0) newX += width;
            if (newY < 0) newY += height;
            robot.position = new Coord(newX, newY);
        });

        const positionMap = new Map();
        robots.forEach((robot) => {
            const key = robot.position.toString();
            positionMap.set(key, (positionMap.get(key) || 0) + 1);
        });

        if ([...positionMap.values()].every((count) => count === 1)) {
            return steps;
        }
        steps++;
    }
}

console.log("Part 1:", part1());
console.log("Part 2:", part2());
