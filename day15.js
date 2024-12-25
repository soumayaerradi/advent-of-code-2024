const fs = require('fs');

const input = fs.readFileSync('./data/input15.txt', 'utf8').trim().split('\n\n');

const directions = {
    '>': [0, 1],
    'v': [1, 0],
    '<': [0, -1],
    '^': [-1, 0]
};

const grid = input[0].split('\n');
const commands = input[1].replace(/\s/g, '');

const ROWS = grid.length;
const COLS = grid[0].length;

const walls = new Set();
let boxes = new Set();
let robot;

// Parse the grid
for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
        const tile = grid[row][col];
        if (tile === '@') {
            robot = [row, col];
        } else if (tile === '#') {
            walls.add(`${row},${col}`);
        } else if (tile === 'O') {
            boxes.add(`${row},${col}`);
        }
    }
}

// Move a box
function moveBox(box, direction, walls, boxes) {
    const [dx, dy] = directions[direction];
    const nextTile = [box[0] + dx, box[1] + dy];
    const nextKey = `${nextTile[0]},${nextTile[1]}`;

    // Check for walls or other boxes blocking the way
    if (walls.has(nextKey) || boxes.has(nextKey)) {
        return [false, boxes];
    }

    // Move the box
    const newBoxes = new Set(boxes);
    newBoxes.delete(`${box[0]},${box[1]}`);
    newBoxes.add(nextKey);

    return [true, newBoxes];
}

// Move the robot and interact with boxes
function moveRobot(robot, direction, walls, boxes) {
    const [dx, dy] = directions[direction];
    const nextTile = [robot[0] + dx, robot[1] + dy];
    const nextKey = `${nextTile[0]},${nextTile[1]}`;

    // Check for wall collision
    if (walls.has(nextKey)) {
        return [robot, boxes];
    }

    // Check for box collision
    if (boxes.has(nextKey)) {
        const [success, newBoxes] = moveBox(nextTile, direction, walls, boxes);
        if (!success) {
            return [robot, boxes];
        }
        return [nextTile, newBoxes];
    }

    // Move the robot
    return [nextTile, boxes];
}

// Execute commands
commands.split('').forEach((char) => {
    [robot, boxes] = moveRobot(robot, char, walls, boxes);
});

// Calculate GPS coordinates for Part 1
const part1Score = [...boxes].reduce((sum, box) => {
    const [r, c] = box.split(',').map(Number);
    return sum + 100 * r + c;
}, 0);

console.log('Part 1:', part1Score);




let [gridRaw, movements] = input;

movements = movements.replace(/\n/g, "").split("");

class Bound2D {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width || 0;
        this.height = height || 0;
    }

    doesCollide(bound) {
        return (
            this.x < bound.x + bound.width &&
            this.x + this.width > bound.x &&
            this.y < bound.y + bound.height &&
            this.y + this.height > bound.y
        );
    }
}

let grid2 = gridRaw.split("\n").map((row) => row.split(""));
let playerPos = { x: 0, y: 0 };

for (let i = 0; i < grid2.length; i++) {
    for (let j = 0; j < grid2[i].length; j++) {
        if (grid2[i][j] === "@") {
            playerPos = { x: j * 2, y: i, bound: new Bound2D(j, i, 1, 1) };
            break;
        }
    }
}

let boxes2 = [];
for (let y = 0; y < grid2.length; y++) {
    for (let x = 0; x < grid2[y].length; x++) {
        if (grid2[y][x] === "O") {
            boxes2.push({
                x: x * 2,
                y,
                bound: new Bound2D(x * 2, y, 2, 1),
                id: boxes2.length,
            });
        }
    }
}

let walls2 = [];
for (let y = 0; y < grid2.length; y++) {
    for (let x = 0; x < grid2[y].length; x++) {
        if (grid2[y][x] === "#") {
            walls2.push({ x: x * 2, y, bound: new Bound2D(x * 2, y, 2, 1) });
        }
    }
}

const directions2 = {
    "^": { x: 0, y: -1 },
    v: { x: 0, y: 1 },
    "<": { x: -1, y: 0 },
    ">": { x: 1, y: 0 },
};

for (const mov of movements) {
    const newPosition = {
        x: playerPos.x + directions2[mov].x,
        y: playerPos.y + directions2[mov].y,
        bound: new Bound2D(
            playerPos.x + directions2[mov].x,
            playerPos.y + directions2[mov].y,
            1,
            1
        ),
    };

    let doesWallsCollide = false;
    for (const wall of walls2) {
        if (wall.bound.doesCollide(newPosition.bound)) {
            doesWallsCollide = true;
            break;
        }
    }

    if (doesWallsCollide) {
        continue;
    }

    let collidedBox = null;
    for (const box of boxes2) {
        if (box.bound.doesCollide(newPosition.bound)) {
            collidedBox = box;
            break;
        }
    }

    let drafts = [];
    let finalized = [];

    let moveOK = true;

    if (!collidedBox) {
        playerPos = newPosition;
        continue;
    }

    drafts.push({
        x: collidedBox.x + directions2[mov].x,
        y: collidedBox.y + directions2[mov].y,
        bound: new Bound2D(
            collidedBox.x + directions2[mov].x,
            collidedBox.y + directions2[mov].y,
            2,
            1
        ),
        id: collidedBox.id,
    });

    while (drafts.length > 0) {
        const draft = drafts.shift();

        let doesCollideWall = false;
        for (const wall of walls2) {
            if (wall.bound.doesCollide(draft.bound)) {
                doesCollideWall = true;
                break;
            }
        }
        if (doesCollideWall) {
            moveOK = false;
            break;
        }

        let collidingBoxes = [];
        for (const box of boxes2) {
            if (box.bound.doesCollide(draft.bound) && box.id !== draft.id) {
                collidingBoxes.push(box);
            }
        }

        for (const box of collidingBoxes) {
            drafts.push({
                x: box.x + directions2[mov].x,
                y: box.y + directions2[mov].y,
                bound: new Bound2D(
                    box.x + directions2[mov].x,
                    box.y + directions2[mov].y,
                    2,
                    1
                ),
                id: box.id,
            });
        }

        finalized.push(draft);
    }

    if (moveOK) {
        playerPos = newPosition;
        for (const final of finalized) {
            boxes2[final.id] = final;
        }
    }
}

let score2 = 0;
for (const box of boxes2) {
    score2 += box.bound.y * 100 + box.bound.x;
}

console.log("Part 2:", score2);
