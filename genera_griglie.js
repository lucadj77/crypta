// Genera 50 griglie Crypta valide (replica esatta dell'algoritmo di index.html)
// Output: griglie.csv  ->  ID, A1..A7, B1..B7, ... G1..G7  (nome immagine per casella)
const fs = require('fs');

const GRID_SIZE = 7;
const ELEMENT_TYPES = ['monster', 'chest', 'key', 'sword', 'potion', 'diamond', 'other'];

// Mappatura elemento -> nome immagine (empty senza immagine -> "{n}")
const IMG = {
    monster: 'mostro.png',
    chest:   'scrigno.png',
    key:     'chiave.png',
    sword:   'spada.png',
    potion:  'pozione.png',
    diamond: 'diamante.png',
    sphere:  'sfera.png',
    trap:    'trappola.png',
    empty:   '{n}'
};

// --- Algoritmo identico a index.html ---
function mulberry32(seed) {
    return function () {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

function shuffle(array, random) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function isAdjacent(r1, c1, r2, c2) {
    return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1 && !(r1 === r2 && c1 === c2);
}

function manhattanDistance(r1, c1, r2, c2) {
    return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

function generateLatinSquare(random) {
    const base = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        base[r] = [];
        for (let c = 0; c < GRID_SIZE; c++) base[r][c] = (r + c) % GRID_SIZE;
    }
    const rowOrder = shuffle([0, 1, 2, 3, 4, 5, 6], random);
    const colOrder = shuffle([0, 1, 2, 3, 4, 5, 6], random);
    const typeOrder = shuffle([0, 1, 2, 3, 4, 5, 6], random);
    const result = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        result[r] = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            const typeIndex = base[rowOrder[r]][colOrder[c]];
            result[r][c] = ELEMENT_TYPES[typeOrder[typeIndex]];
        }
    }
    return result;
}

function collectPositions(grid) {
    const positions = {};
    ELEMENT_TYPES.forEach(type => positions[type] = []);
    for (let r = 0; r < GRID_SIZE; r++)
        for (let c = 0; c < GRID_SIZE; c++) positions[grid[r][c]].push({ r, c });
    return positions;
}

function validateMonsters(positions) {
    const monsters = positions.monster;
    for (let i = 0; i < monsters.length; i++)
        for (let j = i + 1; j < monsters.length; j++)
            if (isAdjacent(monsters[i].r, monsters[i].c, monsters[j].r, monsters[j].c)) return false;
    return true;
}

function validateChests(positions) {
    for (const chest of positions.chest) {
        let ok = false;
        for (const monster of positions.monster)
            if (isAdjacent(chest.r, chest.c, monster.r, monster.c)) { ok = true; break; }
        if (!ok) return false;
    }
    return true;
}

function assignOtherSubtypes(otherPositions, chestPositions, random) {
    const n = otherPositions.length;
    if (n !== 7) return null;
    const sphereOk = otherPositions.map(p =>
        !chestPositions.some(ch => isAdjacent(p.r, p.c, ch.r, ch.c)));
    const trapPairs = [];
    for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++)
            if (manhattanDistance(otherPositions[i].r, otherPositions[i].c,
                                  otherPositions[j].r, otherPositions[j].c) >= 5)
                trapPairs.push([i, j]);
    const shuffledTrapPairs = shuffle(trapPairs, random);
    for (const trapPair of shuffledTrapPairs) {
        const used = new Set(trapPair);
        const remaining = [];
        for (let i = 0; i < n; i++) if (!used.has(i)) remaining.push(i);
        const sphereCandidates = shuffle(remaining.filter(i => sphereOk[i]), random);
        if (sphereCandidates.length < 3) continue;
        const sphereIdx = sphereCandidates.slice(0, 3);
        const sphereSet = new Set(sphereIdx);
        const emptyIdx = remaining.filter(i => !sphereSet.has(i));
        return {
            spheres: sphereIdx.map(i => otherPositions[i]),
            traps: trapPair.map(i => otherPositions[i]),
            empties: emptyIdx.map(i => otherPositions[i])
        };
    }
    return null;
}

function validateAllConstraints(grid, subtypes) {
    const positions = collectPositions(grid);
    for (const type of ELEMENT_TYPES) {
        const tp = positions[type];
        if (tp.length !== 7) return { valid: false, reason: `${type} count != 7` };
        if (new Set(tp.map(p => p.r)).size !== 7) return { valid: false, reason: `${type} duplicate row` };
        if (new Set(tp.map(p => p.c)).size !== 7) return { valid: false, reason: `${type} duplicate column` };
    }
    if (!validateMonsters(positions)) return { valid: false, reason: 'monsters adjacent' };
    if (!validateChests(positions)) return { valid: false, reason: 'chest without adjacent monster' };
    if (subtypes) {
        for (const sphere of subtypes.spheres)
            for (const chest of positions.chest)
                if (isAdjacent(sphere.r, sphere.c, chest.r, chest.c))
                    return { valid: false, reason: 'sphere adjacent to chest' };
        if (subtypes.traps.length === 2 &&
            manhattanDistance(subtypes.traps[0].r, subtypes.traps[0].c,
                              subtypes.traps[1].r, subtypes.traps[1].c) < 5)
            return { valid: false, reason: 'traps too close' };
    }
    return { valid: true };
}

function generateDungeon(baseSeed) {
    for (let attempt = 0; attempt < 1000; attempt++) {
        const seed = baseSeed + attempt * 1000000;
        const random = mulberry32(seed);
        const grid = generateLatinSquare(random);
        const positions = collectPositions(grid);
        const subtypes = assignOtherSubtypes(positions.other, positions.chest, random);
        if (!subtypes) continue;
        if (!validateAllConstraints(grid, subtypes).valid) continue;
        const finalGrid = grid.map(row => [...row]);
        for (const s of subtypes.spheres) finalGrid[s.r][s.c] = 'sphere';
        for (const t of subtypes.traps) finalGrid[t.r][t.c] = 'trap';
        for (const e of subtypes.empties) finalGrid[e.r][e.c] = 'empty';
        return finalGrid;
    }
    return generateDungeon((baseSeed + 1) % 1000000);
}

// --- Costruzione CSV ---
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

// Intestazione: ID + coordinate (per colonna: A1..A7, B1..B7, ... G1..G7)
const header = ['ID'];
for (let c = 0; c < GRID_SIZE; c++)
    for (let r = 0; r < GRID_SIZE; r++)
        header.push(LETTERS[c] + (r + 1));

const lines = [header.join(',')];
const seen = new Set();
let seed = 1;
let produced = 0;

while (produced < 50) {
    const code = String(seed).padStart(6, '0');
    const grid = generateDungeon(seed);

    // Verifica finale di sicurezza
    const subtypesCheck = { spheres: [], traps: [], empties: [] };
    for (let r = 0; r < GRID_SIZE; r++)
        for (let c = 0; c < GRID_SIZE; c++) {
            if (grid[r][c] === 'sphere') subtypesCheck.spheres.push({ r, c });
            else if (grid[r][c] === 'trap') subtypesCheck.traps.push({ r, c });
            else if (grid[r][c] === 'empty') subtypesCheck.empties.push({ r, c });
        }
    // ricostruisco i 7 tipi base per la validazione sudoku
    const baseGrid = grid.map(row => row.map(v =>
        (v === 'sphere' || v === 'trap' || v === 'empty') ? 'other' : v));
    const check = validateAllConstraints(baseGrid, subtypesCheck);
    if (!check.valid) { throw new Error('Griglia non valida: ' + check.reason); }

    const row = [code];
    for (let c = 0; c < GRID_SIZE; c++)
        for (let r = 0; r < GRID_SIZE; r++)
            row.push(IMG[grid[r][c]]);

    const key = row.slice(1).join('|');
    if (seen.has(key)) { seed++; continue; } // evita griglie identiche
    seen.add(key);

    lines.push(row.join(','));
    produced++;
    seed++;
}

fs.writeFileSync('griglie.csv', lines.join('\n') + '\n', 'utf8');
console.log('Generato griglie.csv con', produced, 'griglie valide e distinte.');
