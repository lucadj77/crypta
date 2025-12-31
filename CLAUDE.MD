# Crypta - Project Overview

## About This Project

**Crypta** is a companion web app for the board game "Crypta" by Luca Di Gialleonardo. The app generates a secret dungeon layout and allows players to query cells during gameplay.

**Critical Constraint**: This must be a **single, self-contained HTML file** with all images embedded as base64 and **no external dependencies**.

## Technology Stack

- **HTML5 + CSS3 + Vanilla JavaScript**
- No frameworks or external libraries allowed
- Images embedded as data URIs (base64)
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
2. **New Game**: Select 2, 3, or 4 players → generates layout + 6-digit code
3. **Enter Code**: Input existing 6-digit code → regenerates identical layout
4. **Game Screen**: Coordinate selection (A-H, 1-8) → reveal cell contents → track history

### Grid Sizes

- 2 players: 6×6 (A-F, 1-6)
- 3 players: 7×7 (A-G, 1-7)
- 4 players: 8×8 (A-H, 1-8)

### Element Counts by Player Count

| Element | 2 Players | 3 Players | 4 Players |
|---------|-----------|-----------|-----------|
| Monsters | 4 | 6 | 8 |
| Chests | 5 | 7 | 9 |
| Keys | 5 | 7 | 9 |
| Swords | 4 | 6 | 8 |
| Potions | 5 | 6 | 7 |
| Traps | 3 | 4 | 5 |
| Secret Passages | 2 | 2 | 2 |
| Spheres | 2 | 2 | 2 |
| Empty Cells | 6 | 9 | 14 |

**Total cells must match grid size**: 36, 49, or 64 respectively.

## Generation Algorithm

### Seeded PRNG

The 6-digit game code (000000-999999) serves as the seed for a pseudo-random number generator (mulberry32). **The same code must always generate the identical layout on any device**.

### Placement Order (by constraint complexity)

1. **Spheres** (2) - must be on same diagonal
2. **Secret Passages** (2) - minimum Manhattan distance of 4
3. **Potions** (5-7) - max one per row and column (like chess queens)
4. **Traps** (3-5) - never on edges, never adjacent to each other
5. **Chests** (5-9) - never adjacent to each other
6. **Keys** (5-9) - must be within 3 cells (Chebyshev distance) of at least one chest
7. **Swords** (4-8) - never adjacent to keys
8. **Monsters** (4-8) - never adjacent to each other
9. **Empty cells** (remaining) - must form blocks of at least 4 orthogonally connected cells

### Placement Constraints Details

#### Spheres
- Exactly 2 spheres
- Must be on the same diagonal (same col-row value)
- Algorithm: Pick random diagonal, select 2 random positions on it

#### Secret Passages
- Exactly 2 passages
- Manhattan distance ≥ 4: `|col1-col2| + |row1-row2| ≥ 4`

#### Potions
- No two potions on same row
- No two potions on same column
- (Like chess queens without diagonal constraint)

#### Traps
- Never on grid edges (first/last row or column)
- Never adjacent to each other (8 directions)

#### Chests
- Never adjacent to each other (8 directions)

#### Keys
- Each key must be within Chebyshev distance ≤ 3 from at least one chest
- Chebyshev distance = `max(|Δcol|, |Δrow|)`

#### Swords
- Never adjacent to keys (8 directions)

#### Monsters
- Never adjacent to each other (8 directions)

#### Empty Cells
- Must form blocks of at least 4 orthogonally connected cells
- Verified after all other elements are placed
- If validation fails, regenerate

### Failure Handling

If placement fails after 1000 attempts, throw error. Consider implementing backtracking or seed offset retry logic.

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

### Required Images (to be embedded as base64)

- `chiave.png` (Key)
- `mostro.png` (Monster)
- `passaggio.png` (Secret Passage)
- `pozione.png` (Potion)
- `scrigno.png` (Chest)
- `sfera.png` (Sphere)
- `spada.png` (Sword)
- `trappola.png` (Trap)
- `ferita.png` (Wound - optional, not used in app)

Empty cells use a CSS/SVG icon (e.g., gray empty circle).

## Game Features

### Main Screen Components

1. **Game Code Display**: 6-digit code with copy button
2. **Coordinate Selection**: Letter buttons (A-H) + Number buttons (1-8)
3. **Selected Cell Display**: Shows current selection (e.g., "A3")
4. **Confirm Button**: Reveals selected cell
5. **Sphere Mode Toggle**: Marks discoveries as "(sphere)" in history
6. **History List**: Shows all discovered cells (e.g., "A3: Monster" or "C2: Key (sphere)")
7. **Remaining Counter**: Shows undiscovered elements with icons
8. **Show Map Button**: Reveals entire grid (with confirmation, irreversible)
9. **New Game Button**: Returns to start screen (with confirmation)

### Sphere Mode

- Toggle/checkbox control
- When active, discoveries are marked "(sphere)" in history
- Used to distinguish sphere discoveries (not marked on shared board)

### History

- Lists all queried cells in this session
- Format: "A3: Monster" or "C2: Key (sphere)"
- Clear button to reset history

### Show Full Map

- Requires confirmation before proceeding
- Displays entire grid with all elements
- Cannot be undone (game is compromised)

## Development Guidelines

### Testing Checklist

1. **Generation Testing**: Verify algorithm generates valid layouts in < 1 second
2. **Seed Validation**: Same code must produce identical layout on any device
3. **Accessibility**: Sufficient contrast, large buttons, readable text
4. **Performance**: Base64 images increase file size but ensure offline functionality

### Edge Cases to Handle

- Codes with leading zeros (e.g., "007234")
- Re-querying already discovered cells (show again, add to history)
- Empty grid after discovering all elements
- Invalid code input (show error, allow retry)

### Validation Requirements

Before considering the app complete, verify:

- [ ] Single HTML file with no external dependencies
- [ ] All images embedded as base64
- [ ] Works offline
- [ ] Same seed = same layout (cross-device tested)
- [ ] All placement constraints properly enforced
- [ ] Bilingual (IT/EN) functionality
- [ ] Responsive on mobile and tablet
- [ ] All UI elements accessible and touch-friendly

## File Structure

The HTML file should contain:

```html
<!DOCTYPE html>
<html lang="it">
<head>
    <!-- Meta tags -->
    <style>/* All CSS */</style>
</head>
<body>
    <!-- All HTML screens and modals -->
    <script>
        // Images in base64
        const IMAGES = { ... };

        // Localized texts
        const TEXTS = { it: {...}, en: {...} };

        // PRNG (mulberry32)
        function mulberry32(seed) { ... }

        // Dungeon generation
        function generateDungeon(seed, playerCount) { ... }

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
3. **ALWAYS** embed images as base64 data URIs
4. **ALWAYS** test that the same seed produces the same layout
5. **ALWAYS** maintain bilingual support (IT/EN)
6. **ALWAYS** respect the placement constraints exactly as specified
7. **NEVER** add server-side functionality
8. **ALWAYS** ensure the file works completely offline

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

## Quick Reference: Placement Constraints Summary

| Element | Key Constraint |
|---------|----------------|
| Spheres | Same diagonal (col-row value) |
| Passages | Manhattan distance ≥ 4 |
| Potions | Max 1 per row/column |
| Traps | Not on edges, not adjacent |
| Chests | Not adjacent |
| Keys | Within 3 cells of ≥1 chest |
| Swords | Not adjacent to keys |
| Monsters | Not adjacent |
| Empty | Blocks of ≥4 connected cells |

## Distance Formulas

- **Manhattan**: `|col1-col2| + |row1-row2|`
- **Chebyshev**: `max(|col1-col2|, |row1-row2|)`
- **Euclidean**: `sqrt((col1-col2)² + (row1-row2)²)`
- **Diagonal check**: Same `col-row` value
- **Adjacency**: Chebyshev distance = 1
