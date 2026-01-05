# Crypta - Project Overview

## About This Project

**Crypta** is a companion web app for the board game "Crypta" by Luca Di Gialleonardo. The app generates a secret dungeon layout and allows players to query cells during gameplay.

**Critical Constraint**: This must be a **single, self-contained HTML file**.

## Technology Stack

- **HTML5 + CSS3 + Vanilla JavaScript**
- No frameworks or external libraries allowed
- Responsive design (works on smartphones and tablets)
- Client-side only (no server-side storage)

## Browser Compatibility

- Modern browsers: Chrome, Safari, Firefox, Edge
- Mobile: iOS Safari, Android Chrome
- Both portrait and landscape orientations

## Languages

The app supports **Italian** (default) and **English**. Language can be selected at startup and changed anytime.

## Core Functionality

### Game Flow

1. **Start Screen**: Language selector + "New Game" or "Enter Code" buttons
2. **New Game**: Generates layout + 6-digit code (grid is always 7×7)
3. **Enter Code**: Input existing 6-digit code → regenerates identical layout
4. **Game Screen**: Coordinate selection (A-G, 1-7) → reveal cell contents → track on visual grid

### Grid Size

The grid is always **7×7** (columns A-G, rows 1-7) regardless of the number of players. The number of players does not affect the app.

### Element Counts

The dungeon follows a **sudoku-like structure**: each element type appears exactly **once per row** and **once per column**.

| Element | Count | Notes |
|---------|-------|-------|
| Monsters | 7 | One per row, one per column |
| Chests | 7 | One per row, one per column |
| Keys | 7 | One per row, one per column |
| Swords | 7 | One per row, one per column |
| Potions | 7 | One per row, one per column |
| Empty | 7 | One per row, one per column |
| Other | 7 | One per row, one per column (contains: 3 traps, 2 spheres, 2 passages) |

**Total: 49 cells** (7×7 grid)

## Generation Algorithm

### Seeded PRNG

The 6-digit game code (000000-999999) serves as the seed for a pseudo-random number generator (mulberry32). **The same code must always generate the identical layout on any device**.

### Sudoku Constraint

Every element type (Monster, Chest, Key, Sword, Potion, Empty, Other) must appear **exactly once in each row** and **exactly once in each column**. This is the primary constraint that governs placement.

### Placement Order (by constraint complexity)

Place elements in this order, respecting sudoku constraints throughout:

1. **Monsters** (7) - no two monsters adjacent to each other (8 directions)
2. **Chests** (7) - each chest must have at least one monster in adjacent cells (8 directions)
3. **Swords** (7) - sudoku only, no additional adjacency constraints
4. **Keys** (7) - sudoku only, no additional adjacency constraints
5. **Potions** (7) - sudoku only, no additional adjacency constraints
6. **Empty** (7) - sudoku only, no additional adjacency constraints
7. **Other** (7) - remaining cells, then assign subtypes

### "Other" Category Subtype Assignment

After placing all 7 "Other" cells, assign subtypes (3 traps, 2 spheres, 2 passages) with these constraints:

- **Spheres** (2): must be on the same diagonal (same `col - row` value OR same `col + row` value)
- **Passages** (2): Manhattan distance ≥ 4 between them (`|col1-col2| + |row1-row2| ≥ 4`)
- **Traps** (3): must be on internal cells only (rows 2-6, columns B-F; never on edges)

Algorithm for subtype assignment:
1. Find all pairs of "Other" positions that share a diagonal → candidate sphere pairs
2. Find all pairs with Manhattan distance ≥ 4 → candidate passage pairs
3. Find all "Other" positions not on edges → candidate trap positions
4. Find a valid assignment where: 2 spheres + 2 passages + 3 traps = 7, all positions distinct, all constraints met

### Placement Constraints Summary

| Element | Sudoku | Additional Constraint |
|---------|--------|----------------------|
| Monsters | ✓ | Not adjacent to other monsters |
| Chests | ✓ | Must have ≥1 monster adjacent |
| Swords | ✓ | None |
| Keys | ✓ | None |
| Potions | ✓ | None |
| Empty | ✓ | None |
| Other | ✓ | See subtype constraints below |

| Subtype | Constraint |
|---------|-----------|
| Spheres | Same diagonal |
| Passages | Manhattan distance ≥ 4 |
| Traps | Not on grid edges |

### Post-Generation Validation

**Critical**: After generating a layout, the app MUST validate ALL constraints:

1. Sudoku check: each element type appears exactly once per row and column
2. Monsters: no two monsters are adjacent
3. Chests: every chest has at least one adjacent monster
4. Spheres: both spheres are on the same diagonal
5. Passages: Manhattan distance between passages ≥ 4
6. Traps: no trap is on an edge cell

**If ANY constraint fails**: discard the layout and regenerate with the same seed but using an internal retry counter as offset.

### Failure Handling

```javascript
function generateWithRetry(baseSeed) {
    for (let attempt = 0; attempt < 1000; attempt++) {
        const seed = baseSeed + attempt * 1000000; // Offset seed
        const layout = tryGenerate(seed);
        if (layout && validateAllConstraints(layout)) {
            return layout;
        }
    }
    // After 1000 failed attempts, change base seed
    const newSeed = (baseSeed + 1) % 1000000;
    return generateWithRetry(newSeed);
}
```

The displayed 6-digit code is always the original `baseSeed`, not the internal offset seed.

## Visual Design

### Theme
Dark dungeon fantasy atmosphere with colors suggesting underground exploration.

### Color Palette

| Purpose | Name | Hex |
|---------|------|-----|
| Primary background | Dark anthracite | `#1a1a2e` |
| Secondary background | Stone gray | `#2d2d44` |
| Primary text | Warm white | `#f0e6d3` |
| Secondary text | Light gray | `#a0a0a0` |
| Primary accent | Antique gold | `#c9a227` |
| Secondary accent | Ruby red | `#8b0000` |
| Buttons | Leather brown | `#5c4033` |
| Buttons hover | Light brown | `#8b6914` |
| Borders | Dark gold | `#8b7355` |
| Success | Emerald green | `#2e7d32` |
| Error | Blood red | `#c62828` |
| Secret cell | Purple | `#6a0dad` |

### Typography

- Primary font: `Georgia, 'Times New Roman', serif` (ancient feel)
- Secondary font (UI): `'Segoe UI', Arial, sans-serif`
- Title "CRYPTA": large, letter-spaced, "carved in stone" effect

### UI Elements

- Buttons with slightly rounded borders, subtle relief effect
- Light shadows for depth
- Icons with slight glow when revealed
- Smooth transitions (0.2s-0.3s)
- Mobile-first responsive design
- Touch targets minimum 44px

## Game Assets

### Required Images (Base64 embedded)

- `chiave.png` (Key)
- `mostro.png` (Monster)
- `passaggio.png` (Secret Passage)
- `pozione.png` (Potion)
- `scrigno.png` (Chest)
- `sfera.png` (Sphere)
- `spada.png` (Sword)
- `trappola.png` (Trap)
- `segreto.png` (Secret - eye icon for cells seen only by one player)
- `vuoto.png` or CSS icon (Empty - gray circle or similar)

## Game Features

### Main Screen Components

1. **Game Code Display**: 6-digit code with copy button
2. **Discovery Grid**: 7×7 visual grid showing coordinates and discovered elements
3. **Coordinate Selection**: Letter buttons (A-G) + Number buttons (1-7)
4. **Selected Cell Display**: Shows current selection (e.g., "D3")
5. **Confirm Button**: Reveals selected cell
6. **Secret Mode Toggle**: For sphere/vision discoveries (private to one player)
7. **Remaining Counter**: Shows undiscovered elements with icons and counts
8. **Show Map Button**: Reveals entire grid (with confirmation, irreversible)
9. **New Game Button**: Returns to start screen (with confirmation)

### Discovery Grid (replaces text history)

Instead of a text list, the app displays a **visual 7×7 grid** that shows:

- **Undiscovered cells**: Empty/dark appearance
- **Publicly discovered cells**: Show the element icon (monster, chest, key, etc.)
- **Secretly discovered cells**: Show a special "secret" icon (eye symbol) in a purple tint
- **Grid headers**: Column letters (A-G) on top, row numbers (1-7) on the side

When a cell is discovered:
- If **Secret Mode is OFF**: The cell shows the actual element icon (public discovery)
- If **Secret Mode is ON**: The cell shows the "secret" icon (private discovery via sphere or vision)

If a secretly-discovered cell is later discovered publicly, the icon updates to show the actual element.

### Secret Mode

Replaces the old "Sphere Mode". Used for:
- **Sphere discoveries**: When a player uses a sphere to look at any cell
- **Vision discoveries**: When a player uses the vision modifier to look ahead

When Secret Mode is active:
- The discovery is marked as private (shows eye icon on grid)
- The actual element is revealed to the querying player but not shown on the shared grid
- A visual indicator shows Secret Mode is active (purple border or glow)

Toggle behavior:
- Player activates Secret Mode before querying
- After the query, Secret Mode can stay on (for multiple secret queries) or be turned off
- Recommend: auto-toggle OFF after each query, with option to keep ON

### Already Discovered Cell Alert

When a player queries a cell that was **already publicly discovered**:

- Show a prominent message: "Questa casella è già stata esplorata" / "This cell was already explored"
- Still show what's in the cell (as a reminder)
- This alerts players that the cell may have been emptied (items taken, monster defeated)

When a player queries a cell that was **secretly discovered** (by themselves or others):
- If Secret Mode is OFF: Convert to public discovery, show actual icon
- If Secret Mode is ON: Show the actual content to the player privately (may already know it)

### Remaining Elements Counter

Shows icons with counts for undiscovered elements:
- Monsters: 7 → decreases as discovered
- Chests: 7 → decreases as discovered
- Keys: 7 → decreases as discovered
- etc.

**Important**: Only publicly discovered cells decrease the counter. Secret discoveries do NOT affect the counter (since other players don't know about them).

### Show Full Map

- Requires confirmation: "Sei sicuro? Questa azione non può essere annullata" / "Are you sure? This action cannot be undone"
- Displays entire grid with all elements revealed
- Disables further queries (game is compromised)
- Useful for end-game verification or debugging

## Screen Layouts

### Start Screen

```
┌─────────────────────────────┐
│         🏰 CRYPTA 🏰         │
│                             │
│    [IT 🇮🇹] [EN 🇬🇧]         │
│                             │
│    ┌─────────────────┐      │
│    │   Nuova partita │      │
│    └─────────────────┘      │
│                             │
│    ┌─────────────────┐      │
│    │  Inserisci code │      │
│    └─────────────────┘      │
│                             │
└─────────────────────────────┘
```

### Game Screen

```
┌─────────────────────────────┐
│  Codice: 123456  [📋]       │
│                             │
│    A B C D E F G            │
│  1 ░ ░ 🗝 ░ ░ ░ ░           │
│  2 ░ 👁 ░ 🗡 ░ ░ ░           │
│  3 ░ ░ ░ ░ 👹 ░ ░           │
│  4 ░ ░ 📦 ░ ░ ░ ░           │
│  5 ░ ░ ░ ░ ░ ░ ░           │
│  6 ░ ░ ░ ░ ░ ░ ░           │
│  7 ░ ░ ░ ░ ░ ░ ░           │
│                             │
│  [A][B][C][D][E][F][G]      │
│  [1][2][3][4][5][6][7]      │
│                             │
│  Selezionato: D3            │
│  [    Conferma    ]         │
│                             │
│  [ ] Modalità segreta 👁    │
│                             │
│  Rimanenti:                 │
│  👹7 📦7 🗝7 🗡7 🧪7 ...     │
│                             │
│ [Mostra mappa] [Nuova]      │
└─────────────────────────────┘
```

Legend:
- ░ = undiscovered cell
- 👁 = secretly discovered (eye icon)
- 🗝🗡👹📦🧪 = publicly discovered elements

## Development Guidelines

### Testing Checklist

1. **Generation Testing**: 
   - Verify algorithm generates valid layouts
   - All sudoku constraints satisfied
   - All adjacency constraints satisfied
   - Generation completes in < 2 seconds (including retries)

2. **Seed Validation**: 
   - Same code must produce identical layout on any device
   - Test on different browsers and devices
   - Test codes with leading zeros (e.g., "007234")

3. **Constraint Validation**:
   - Monsters never adjacent
   - Every chest has adjacent monster
   - Spheres on same diagonal
   - Passages at distance ≥ 4
   - Traps not on edges
   - Sudoku structure intact

4. **UI Testing**:
   - Discovery grid updates correctly
   - Secret mode shows eye icon
   - Already-explored alert appears
   - Remaining counter accurate (public only)
   - Responsive on mobile

5. **Accessibility**: 
   - Sufficient contrast
   - Large touch targets
   - Readable text
   - Screen reader support (ARIA labels)

### Edge Cases to Handle

- Codes with leading zeros (e.g., "007234")
- Re-querying already discovered cells (show alert + content)
- Re-querying secretly discovered cells (convert to public or keep secret)
- Secret mode left ON accidentally
- All elements discovered (show completion message?)
- Invalid code input (show error, allow retry)
- Generation failure after 1000 attempts (change seed, notify user?)

### Validation Requirements

Before considering the app complete, verify:

- [ ] Single HTML file with no external dependencies
- [ ] Works offline
- [ ] Same seed = same layout (cross-device tested)
- [ ] Sudoku constraint enforced (1 per row/column for each type)
- [ ] All placement constraints properly enforced
- [ ] Post-generation validation catches all invalid layouts
- [ ] Bilingual (IT/EN) functionality
- [ ] Responsive on mobile and tablet
- [ ] All UI elements accessible and touch-friendly
- [ ] Discovery grid displays correctly
- [ ] Secret mode works for sphere/vision
- [ ] Already-explored alert works
- [ ] Remaining counter updates on public discoveries only

## File Structure

```html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Crypta</title>
    <style>/* All CSS */</style>
</head>
<body>
    <!-- Start screen -->
    <!-- Game screen with discovery grid -->
    <!-- Modals (confirmation dialogs) -->
    
    <script>
        // Images in base64
        const IMAGES = { 
            monster: 'data:image/png;base64,...',
            chest: 'data:image/png;base64,...',
            // etc.
        };

        // Localized texts
        const TEXTS = {
            it: {
                newGame: 'Nuova partita',
                enterCode: 'Inserisci codice',
                secretMode: 'Modalità segreta',
                alreadyExplored: 'Questa casella è già stata esplorata',
                confirm: 'Conferma',
                // etc.
            },
            en: {
                newGame: 'New Game',
                enterCode: 'Enter Code',
                secretMode: 'Secret Mode',
                alreadyExplored: 'This cell was already explored',
                confirm: 'Confirm',
                // etc.
            }
        };

        // PRNG (mulberry32)
        function mulberry32(seed) { ... }

        // Dungeon generation with sudoku + constraints
        function generateDungeon(seed) { ... }

        // Post-generation validation
        function validateConstraints(layout) { ... }

        // Generate with retry logic
        function generateWithRetry(baseSeed) { ... }

        // UI logic
        // ...
    </script>
</body>
</html>
```

## Important Constraints for Claude

When working on this project:

1. **NEVER** suggest npm packages, frameworks, or external libraries
2. **NEVER** split code into multiple files
3. **ALWAYS** test that the same seed produces the same layout
4. **ALWAYS** maintain bilingual support (IT/EN)
5. **ALWAYS** respect the placement constraints exactly as specified
6. **ALWAYS** validate constraints after generation
7. **NEVER** add server-side functionality
8. **ALWAYS** ensure the file works completely offline
9. **ALWAYS** implement the visual discovery grid (not text history)
10. **ALWAYS** implement secret mode for sphere/vision discoveries

## Code Quality Standards

- Use clear, descriptive variable names
- Comment complex algorithms (especially placement constraints)
- Keep functions focused and single-purpose
- Validate all user inputs
- Handle edge cases gracefully
- Ensure accessibility (ARIA labels, keyboard navigation)

## Credits

**Crypta** - Board game by Luca Di Gialleonardo
Companion app v1.0

---

## Quick Reference: Constraint Summary

### Sudoku Rule (applies to ALL element types)
Each of the 7 element types appears exactly **once per row** and **once per column**.

### Additional Placement Constraints

| Element | Additional Constraint |
|---------|----------------------|
| Monsters | Not adjacent to each other (8 directions) |
| Chests | Must have ≥1 adjacent monster |
| Spheres | Both on same diagonal |
| Passages | Manhattan distance ≥ 4 |
| Traps | Not on edge cells (rows 1,7 or columns A,G) |
| Swords, Keys, Potions, Empty | Sudoku only |

### Distance Formulas

- **Manhattan**: `|col1-col2| + |row1-row2|`
- **Chebyshev** (adjacency): `max(|col1-col2|, |row1-row2|)`
- **Same diagonal**: `(col1-row1) === (col2-row2)` OR `(col1+row1) === (col2+row2)`
- **Adjacency check**: Chebyshev distance = 1
- **Edge check**: row = 0 OR row = 6 OR col = 0 OR col = 6 (0-indexed)
