const fs = require("fs");

const input = fs.readFileSync("./data/input24.txt", "utf8").trim();
const [wireValues, gateDefinitions] = input.split("\n\n");

const parseWireValues = (input) => {
    const wires = {};
    input.split("\n").forEach(line => {
        const [wire, value] = line.split(": ");
        wires[wire] = parseInt(value, 10);
    });
    return wires;
};

const parseGateDefinitions = (input) => {
    const gates = [];
    input.split("\n").forEach(line => {
        const [operation, output] = line.split(" -> ");
        const [a, op, b] = operation.split(" ");
        gates.push({ a, op, b, output });
    });
    return gates;
};

const simulate = (wires, gates) => {
    const seen = new Set();
    let work = true;

    while (work) {
        work = false;

        gates.forEach(({ a, op, b, output }) => {
            if (seen.has(output)) return;

            let value;
            if (op === "XOR" && a in wires && b in wires) {
                value = wires[a] ^ wires[b];
            } else if (op === "AND" && a in wires && b in wires) {
                value = wires[a] & wires[b];
            } else if (op === "OR" && a in wires && b in wires) {
                value = wires[a] | wires[b];
            }

            if (value !== undefined) {
                wires[output] = value;
                seen.add(output);
                work = true;
            }
        });
    }

    return wires;
};

const calculateResult = (wires) => {
    const zWires = Object.keys(wires)
        .filter(key => key.startsWith("z"))
        .sort();
    const binaryString = zWires.map(key => wires[key]).reverse().join("");
    return parseInt(binaryString, 2);
};

const findSwapsPart2 = (wires, gates) => {
    const flags = new Set();

    const inputBitCount = Object.keys(wires).filter(key => key.startsWith("x")).length;

    const isDirect = (gate) => gate.a.startsWith("x") || gate.b.startsWith("x");
    const isOutput = (gate) => gate.output.startsWith("z");
    const isGate = (type) => (gate) => gate.op === type;
    const hasOutput = (output) => (gate) => gate.output === output;
    const hasInput = (input) => (gate) => gate.a === input || gate.b === input;

    const FAGate0s = gates.filter(isDirect).filter(isGate("XOR"));
    for (const gate of FAGate0s) {
        const { a, b, output } = gate;

        const isFirst = a === "x00" || b === "x00";
        if (isFirst) {
            if (output !== "z00") {
                flags.add(output);
            }
            continue;
        } else if (output === "z00") {
            flags.add(output);
        }

        if (isOutput(gate)) {
            flags.add(output);
        }
    }

    const FAGate3s = gates.filter(isGate("XOR")).filter((gate) => !isDirect(gate));
    for (const gate of FAGate3s) {
        if (!isOutput(gate)) {
            flags.add(gate.output);
        }
    }

    const outputGates = gates.filter(isOutput);
    for (const gate of outputGates) {
        const isLast = gate.output === `z${String(inputBitCount).padStart(2, "0")}`;
        if (isLast) {
            if (gate.op !== "OR") {
                flags.add(gate.output);
            }
            continue;
        } else if (gate.op !== "XOR") {
            flags.add(gate.output);
        }
    }

    const checkNext = [];
    for (const gate of FAGate0s) {
        const { output } = gate;

        if (flags.has(output)) continue;

        if (output === "z00") continue;

        const matches = FAGate3s.filter(hasInput(output));
        if (matches.length === 0) {
            checkNext.push(gate);
            flags.add(output);
        }
    }

    for (const gate of checkNext) {
        const { a, output } = gate;

        const intendedResult = `z${a.slice(1)}`;
        const matches = FAGate3s.filter(hasOutput(intendedResult));

        if (matches.length !== 1) {
            throw new Error("Critical Error! Is your input correct?");
        }

        const match = matches[0];
        const toCheck = [match.a, match.b];
        const orMatches = gates
            .filter(isGate("OR"))
            .filter((gate) => toCheck.includes(gate.output));

        if (orMatches.length !== 1) {
            throw new Error(
                "Critical Error! This solver isn't complex enough to solve this"
            );
        }

        const orMatchOutput = orMatches[0].output;
        const correctOutput = toCheck.find((output) => output !== orMatchOutput);
        flags.add(correctOutput);
    }

    if (flags.size !== 8) {
        throw new Error("Critical Error! This solver isn't complex enough to solve this");
    }

    const flagsArr = [...flags];
    flagsArr.sort((a, b) => a.localeCompare(b));
    return flagsArr.join(",");
};

const wires = parseWireValues(wireValues);
const gates = parseGateDefinitions(gateDefinitions);

const finalWires = simulate(wires, gates);
const resultPart1 = calculateResult(finalWires);
console.log("Part 1:", resultPart1);

const resultPart2 = findSwapsPart2(wires, gates);
console.log("Part 2:", resultPart2);
