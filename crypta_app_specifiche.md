# Crypta - specifiche app companion

## Panoramica

App web companion per il gioco da tavolo **Crypta**. L'app genera la disposizione segreta degli elementi del dungeon e permette ai giocatori di interrogare le caselle durante la partita.

**Requisito fondamentale**: file HTML unico e autocontenuto, con tutte le immagini incorporate in base64 e nessuna dipendenza esterna.

---

## Requisiti tecnici

### Tecnologia
- HTML5 + CSS3 + JavaScript vanilla
- Nessun framework o libreria esterna
- Immagini incorporate come data URI (base64)
- Responsive design (funziona su smartphone e tablet)
- Nessun salvataggio lato server (tutto client-side)

### Compatibilità
- Browser moderni (Chrome, Safari, Firefox, Edge)
- iOS Safari, Android Chrome
- Orientamento verticale e orizzontale

---

## Lingue supportate

L'app deve funzionare in **italiano** e **inglese**. La lingua si seleziona all'avvio e può essere cambiata in qualsiasi momento.

### Testi localizzati

| Chiave | Italiano | English |
|--------|----------|---------|
| `lang_select` | Seleziona lingua | Select language |
| `new_game` | Nuova partita | New game |
| `enter_code` | Inserisci codice | Enter code |
| `players` | Giocatori | Players |
| `start` | Inizia | Start |
| `game_code` | Codice partita | Game code |
| `copy_code` | Copia codice | Copy code |
| `confirm` | Conferma | Confirm |
| `close` | Chiudi | Close |
| `show_all` | Mostra schema | Show map |
| `show_all_confirm` | Sei sicuro di voler vedere l'intero schema? Questa azione non può essere annullata. | Are you sure you want to see the entire map? This action cannot be undone. |
| `yes` | Sì | Yes |
| `cancel` | Annulla | Cancel |
| `back` | Indietro | Back |
| `new_game_btn` | Nuova partita | New game |
| `history` | Cronologia | History |
| `clear_history` | Cancella | Clear |
| `sphere_mode` | Modalità sfera | Sphere mode |
| `sphere_mode_on` | Attiva | On |
| `sphere_mode_off` | Disattiva | Off |
| `remaining` | Rimanenti | Remaining |
| `empty_cell` | Casella vuota | Empty cell |
| `invalid_code` | Codice non valido | Invalid code |
| `select_cell` | Seleziona una casella | Select a cell |
| `discovered_via_sphere` | (sfera) | (sphere) |

### Nomi elementi

| Elemento | Italiano | English |
|----------|----------|---------|
| `monster` | Mostro | Monster |
| `chest` | Scrigno | Chest |
| `key` | Chiave | Key |
| `sword` | Spada | Sword |
| `potion` | Pozione | Potion |
| `trap` | Trappola | Trap |
| `passage` | Passaggio segreto | Secret passage |
| `sphere` | Sfera | Sphere |
| `empty` | Vuoto | Empty |

---

## Flusso utente

### 1. Schermata iniziale
- Logo/titolo "CRYPTA"
- Selettore lingua (IT/EN) sempre visibile in alto
- Due pulsanti grandi:
  - "Nuova partita"
  - "Inserisci codice"

### 2a. Nuova partita
- Selezione numero giocatori: 2, 3, 4 (pulsanti)
- Pulsante "Inizia"
- L'app genera lo schema e calcola un codice a 6 cifre
- Passa alla schermata di gioco

### 2b. Inserisci codice
- Campo input per codice a 6 cifre (solo numeri)
- Pulsante "Conferma"
- Se valido: rigenera lo schema identico, passa alla schermata di gioco
- Se non valido: mostra errore, permette nuovo tentativo

### 3. Schermata di gioco

Layout principale:
```
┌─────────────────────────────────────┐
│  CRYPTA          [IT/EN]  [≡ Menu]  │
├─────────────────────────────────────┤
│  Codice: 847291        [📋 Copia]   │
├─────────────────────────────────────┤
│                                     │
│     [A] [B] [C] [D] [E] [F] [G] [H] │
│                                     │
│     [1] [2] [3] [4] [5] [6] [7] [8] │
│                                     │
│  Casella selezionata: [ A ][ 3 ]    │
│                                     │
│           [  CONFERMA  ]            │
│                                     │
├─────────────────────────────────────┤
│  ☐ Modalità sfera                   │
├─────────────────────────────────────┤
│  Cronologia:                        │
│  • A3: Mostro                       │
│  • B5: Vuoto                        │
│  • C2: Chiave (sfera)               │
│                  [Cancella]         │
├─────────────────────────────────────┤
│  Rimanenti:                         │
│  🐉4  📦5  🗝5  ⚔4  🧪5  ⚠3       │
├─────────────────────────────────────┤
│  [Mostra schema]  [Nuova partita]   │
└─────────────────────────────────────┘
```

#### Interazione coordinate
- Pulsanti per lettere (colonne): A-H (variabile per numero giocatori)
- Pulsanti per numeri (righe): 1-8 (variabile per numero giocatori)
- Il giocatore clicca prima la lettera, poi il numero
- La selezione viene mostrata chiaramente
- Pulsante "Conferma" per rivelare il contenuto
- Se una coordinata è già selezionata e si clicca un'altra dello stesso tipo, sostituisce

#### Rivelazione casella
- Popup/modal con:
  - Icona dell'elemento (grande, centrata)
  - Nome dell'elemento
  - Pulsante "Chiudi"
- La casella viene aggiunta alla cronologia

#### Cronologia
- Lista delle caselle interrogate in questa sessione
- Formato: "A3: Mostro" oppure "C2: Chiave (sfera)"
- Se "modalità sfera" era attiva, aggiunge "(sfera)" 
- Pulsante per cancellare la cronologia

#### Modalità sfera
- Toggle/checkbox
- Quando attivo, le scoperte vengono marcate come "(sfera)" nella cronologia
- Serve per distinguere le scoperte fatte tramite sfera (non si segnano sul tabellone condiviso)

#### Contatore elementi rimanenti
- Mostra quanti elementi di ogni tipo non sono ancora stati scoperti
- Si aggiorna automaticamente dopo ogni rivelazione
- Usa le icone piccole degli elementi

#### Pulsante "Mostra schema"
- Richiede conferma prima di procedere
- Mostra l'intera griglia con tutti gli elementi
- Una volta mostrato, non si può tornare indietro (la partita è compromessa)

#### Pulsante "Nuova partita"
- Richiede conferma
- Torna alla schermata iniziale

---

## Dimensioni griglia

| Giocatori | Griglia | Colonne | Righe |
|-----------|---------|---------|-------|
| 2 | 6×6 | A-F | 1-6 |
| 3 | 7×7 | A-G | 1-7 |
| 4 | 8×8 | A-H | 1-8 |

---

## Quantità elementi per numero di giocatori

| Elemento | 2 giocatori | 3 giocatori | 4 giocatori |
|----------|-------------|-------------|-------------|
| Mostri | 4 | 6 | 8 |
| Scrigni | 5 | 7 | 9 |
| Chiavi | 5 | 7 | 9 |
| Spade | 4 | 6 | 8 |
| Pozioni | 5 | 6 | 7 |
| Trappole | 3 | 4 | 5 |
| Passaggi segreti | 2 | 2 | 2 |
| Sfere | 2 | 2 | 2 |
| Vuoti | 6 | 9 | 14 |

**Verifica**: la somma deve essere uguale al numero di caselle della griglia.
- 2 giocatori: 4+5+5+4+5+3+2+2+6 = 36 ✓
- 3 giocatori: 6+7+7+6+6+4+2+2+9 = 49 ✓
- 4 giocatori: 8+9+9+8+7+5+2+2+14 = 64 ✓

---

## Algoritmo di generazione

### Sistema seed

Il codice partita è un numero a 6 cifre (da 000000 a 999999) che funge da seed per il generatore di numeri pseudo-casuali.

```javascript
// Esempio di PRNG con seed (mulberry32)
function mulberry32(seed) {
    return function() {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// Uso
const random = mulberry32(847291);
random(); // sempre lo stesso valore per lo stesso seed
```

### Ordine di piazzamento

Gli elementi vanno piazzati in ordine di vincoli più stringenti:

1. **Sfere** (2)
2. **Passaggi segreti** (2)
3. **Pozioni** (5-7)
4. **Trappole** (3-5)
5. **Scrigni** (5-9)
6. **Chiavi** (5-9)
7. **Spade** (4-8)
8. **Mostri** (4-8)
9. **Vuoti** (celle rimanenti)

### Vincoli di posizionamento

#### Sfere
- Esattamente 2
- Devono essere sulla stessa diagonale (differenza assoluta tra riga e colonna uguale per entrambe)
- Possono essere su qualsiasi diagonale (principale, secondaria, o parallele)

```
Esempio valido (diagonale):
  A B C D E F
1 . . . . . .
2 . ● . . . .    ● = sfera
3 . . . . . .
4 . . . . ● .
5 . . . . . .
6 . . . . . .

Verifica: B2 e E4
- B=1, 2-1=1
- E=4, 4-4=0
Errore! Non sono sulla stessa diagonale.

Esempio corretto:
B2 (col=1, row=1): col-row = 0
D4 (col=3, row=3): col-row = 0 ✓
```

**Algoritmo**: 
1. Scegli una diagonale random (valore di col-row da -(n-1) a +(n-1))
2. Trova tutte le celle su quella diagonale
3. Se ci sono almeno 2 celle, scegli 2 posizioni random
4. Altrimenti, scegli un'altra diagonale

#### Passaggi segreti
- Esattamente 2
- Distanza di Manhattan minima: 4 caselle
- Distanza Manhattan = |col1-col2| + |row1-row2|

```
Esempio:
Se primo passaggio in B2, il secondo deve essere ad almeno 4 di distanza.
B2 → F2: distanza = |1-5| + |1-1| = 4 ✓
B2 → C4: distanza = |1-2| + |1-3| = 1+2 = 3 ✗
```

#### Pozioni
- Mai due pozioni sulla stessa riga
- Mai due pozioni sulla stessa colonna
- Come le regine negli scacchi, ma senza il vincolo diagonale

```
Esempio valido:
  A B C D E F
1 . . 🧪 . . .
2 . . . . 🧪 .
3 🧪 . . . . .
4 . . . 🧪 . .
5 . 🧪 . . . .
```

#### Trappole
- Mai sui bordi della griglia (prima/ultima riga, prima/ultima colonna)
- Mai adiacenti tra loro (8 direzioni: ortogonale + diagonale)

```
Bordi vietati (griglia 6x6):
  A B C D E F
1 ✗ ✗ ✗ ✗ ✗ ✗
2 ✗ . . . . ✗
3 ✗ . . . . ✗
4 ✗ . . . . ✗
5 ✗ . . . . ✗
6 ✗ ✗ ✗ ✗ ✗ ✗
```

#### Scrigni
- Mai adiacenti tra loro (8 direzioni)

#### Chiavi
- Ogni chiave deve essere entro 2 caselle da almeno uno scrigno
- Distanza di Chebyshev ≤ 2 (max tra |Δcol| e |Δrow|)

```
Esempio: scrigno in D4
Area valida per chiavi (distanza ≤ 2):
  A B C D E F G
1 . . . . . . .
2 . ✓ ✓ ✓ ✓ ✓ .
3 . ✓ ✓ ✓ ✓ ✓ .
4 . ✓ ✓ 📦 ✓ ✓ .
5 . ✓ ✓ ✓ ✓ ✓ .
6 . ✓ ✓ ✓ ✓ ✓ .
7 . . . . . . .
```

#### Spade
- Mai adiacenti a chiavi (8 direzioni)

#### Mostri
- Mai adiacenti tra loro (8 direzioni)

#### Vuoti
- Ogni cella vuota deve essere adiacente (incluse le diagonali) sia a uno scrigno sia a un mostro
- Adjacenza include tutte le 8 direzioni (ortogonali + diagonali)

```
Esempio valido:
  A B C D
1 📦 . 👹 .
2 . . . 📦
3 👹 . . .

Il vuoto in B1 è adiacente a 📦(A1) e 👹(C1) ✓
Il vuoto in B2 è adiacente a 📦(C2) e 👹(A3) ✓
```

**Nota**: questo vincolo è verificato a posteriori. Se dopo aver piazzato tutti gli elementi i vuoti non soddisfano il vincolo, si rigenera.

### Gestione fallimenti

Se durante il piazzamento non si trovano posizioni valide:
1. Tentare backtracking (rimuovere l'ultimo elemento piazzato e riprovare)
2. Se fallisce troppe volte (es. 100 tentativi), rigenerare da zero con lo stesso seed ma con un offset

```javascript
function generateWithRetry(seed, playerCount, maxAttempts = 100) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const result = tryGenerate(seed + attempt * 1000000, playerCount);
        if (result.success) {
            return result.grid;
        }
    }
    throw new Error("Impossibile generare schema valido");
}
```

### Pseudocodice completo

```javascript
function generateDungeon(seed, playerCount) {
    const random = mulberry32(seed);
    const gridSize = getGridSize(playerCount); // 6, 7, 8
    const counts = getElementCounts(playerCount);
    
    let grid = createEmptyGrid(gridSize);
    let attempts = 0;
    const maxAttempts = 1000;
    
    while (attempts < maxAttempts) {
        grid = createEmptyGrid(gridSize);
        
        // 1. Piazza sfere
        if (!placeSpheres(grid, random)) { attempts++; continue; }
        
        // 2. Piazza passaggi
        if (!placePassages(grid, random)) { attempts++; continue; }
        
        // 3. Piazza pozioni
        if (!placePotions(grid, counts.potions, random)) { attempts++; continue; }
        
        // 4. Piazza trappole
        if (!placeTraps(grid, counts.traps, random)) { attempts++; continue; }
        
        // 5. Piazza scrigni
        if (!placeChests(grid, counts.chests, random)) { attempts++; continue; }
        
        // 6. Piazza chiavi
        if (!placeKeys(grid, counts.keys, random)) { attempts++; continue; }
        
        // 7. Piazza spade
        if (!placeSwords(grid, counts.swords, random)) { attempts++; continue; }
        
        // 8. Piazza mostri
        if (!placeMonsters(grid, counts.monsters, random)) { attempts++; continue; }
        
        // 9. Verifica vuoti
        if (validateEmptyCells(grid, counts.empty)) {
            return grid; // Successo!
        }
        
        attempts++;
    }
    
    throw new Error("Generazione fallita");
}
```

---

## Asset grafici

### Immagini elementi

Le seguenti immagini devono essere convertite in base64 e incorporate nel file HTML:

| Elemento | File | Uso |
|----------|------|-----|
| Chiave | `chiave.png` | Rivelazione, contatore |
| Ferita | `ferita.png` | Non usato nell'app (elemento giocatore) |
| Mostro | `mostro.png` | Rivelazione, contatore |
| Passaggio | `passaggio.png` | Rivelazione |
| Pozione | `pozione.png` | Rivelazione, contatore |
| Scrigno | `scrigno.png` | Rivelazione, contatore |
| Sfera | `sfera.png` | Rivelazione |
| Spada | `spada.png` | Rivelazione, contatore |
| Trappola | `trappola.png` | Rivelazione, contatore |

**Nota**: l'immagine "ferita" non serve nell'app (le ferite sono gestite fisicamente dai giocatori), ma può essere inclusa per completezza.

### Icona "vuoto"

Per le caselle vuote, usare un'icona semplice generata in CSS/SVG (es. un cerchio grigio vuoto o un'icona "nulla").

---

## Stile grafico

### Tema
Atmosfera **dungeon fantasy**: colori scuri, sensazione di esplorazione sotterranea.

### Palette colori

| Uso | Colore | Hex |
|-----|--------|-----|
| Sfondo principale | Grigio antracite scuro | `#1a1a2e` |
| Sfondo secondario | Grigio pietra | `#2d2d44` |
| Testo principale | Bianco caldo | `#f0e6d3` |
| Testo secondario | Grigio chiaro | `#a0a0a0` |
| Accento primario | Oro antico | `#c9a227` |
| Accento secondario | Rosso rubino | `#8b0000` |
| Pulsanti | Marrone cuoio | `#5c4033` |
| Pulsanti hover | Marrone chiaro | `#8b6914` |
| Bordi | Oro scuro | `#8b7355` |
| Successo | Verde smeraldo | `#2e7d32` |
| Errore | Rosso sangue | `#c62828` |

### Tipografia

- Font principale: `Georgia, 'Times New Roman', serif` (sensazione antica)
- Font secondario (UI): `'Segoe UI', Arial, sans-serif`
- Titolo "CRYPTA": grande, lettere spaziate, effetto "inciso nella pietra"

### Elementi UI

- Pulsanti con bordi leggermente arrotondati, effetto rilievo sottile
- Ombre leggere per dare profondità
- Icone con leggero bagliore/alone quando rivelate
- Transizioni fluide (0.2s-0.3s)

### Responsive

- Mobile first
- Griglia di selezione coordinate adattabile
- Pulsanti sufficientemente grandi per touch (minimo 44px)

---

## Struttura file HTML

```html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crypta</title>
    <style>
        /* Tutti gli stili CSS qui */
    </style>
</head>
<body>
    <!-- Schermata lingua/menu iniziale -->
    <div id="screen-start">...</div>
    
    <!-- Schermata nuova partita -->
    <div id="screen-new-game">...</div>
    
    <!-- Schermata inserisci codice -->
    <div id="screen-enter-code">...</div>
    
    <!-- Schermata di gioco -->
    <div id="screen-game">...</div>
    
    <!-- Schermata schema completo -->
    <div id="screen-full-map">...</div>
    
    <!-- Modal rivelazione -->
    <div id="modal-reveal">...</div>
    
    <!-- Modal conferma -->
    <div id="modal-confirm">...</div>
    
    <script>
        // Immagini in base64
        const IMAGES = {
            monster: 'data:image/png;base64,...',
            chest: 'data:image/png;base64,...',
            // ...
        };
        
        // Testi localizzati
        const TEXTS = {
            it: { /* ... */ },
            en: { /* ... */ }
        };
        
        // PRNG
        function mulberry32(seed) { /* ... */ }
        
        // Generazione dungeon
        function generateDungeon(seed, playerCount) { /* ... */ }
        
        // Logica UI
        // ...
    </script>
</body>
</html>
```

---

## Checklist funzionalità

### Essenziali
- [ ] Selezione lingua IT/EN
- [ ] Nuova partita con selezione giocatori
- [ ] Generazione schema con seed
- [ ] Codice a 6 cifre copiabile
- [ ] Inserimento codice esistente
- [ ] Selezione coordinate (lettere + numeri)
- [ ] Rivelazione casella con icona
- [ ] Cronologia scoperte
- [ ] Modalità sfera (toggle)
- [ ] Contatore elementi rimanenti
- [ ] Visualizzazione schema completo (con conferma)
- [ ] Nuova partita (con conferma)

### Nice to have
- [ ] Suoni feedback (opzionale, disattivabile)
- [ ] Animazioni rivelazione
- [ ] Tema chiaro alternativo
- [ ] Salvataggio partita in localStorage

---

## Note per lo sviluppo

1. **Testare la generazione**: verificare che l'algoritmo generi sempre schemi validi in tempi ragionevoli (< 1 secondo)

2. **Validare il seed**: lo stesso codice deve sempre produrre lo stesso schema, su qualsiasi dispositivo

3. **Accessibilità**: contrasto sufficiente, pulsanti grandi, testo leggibile

4. **Performance**: le immagini base64 aumentano la dimensione del file, ma garantiscono funzionamento offline

5. **Edge cases**:
   - Codice con zeri iniziali (es. 007234)
   - Casella già interrogata (mostrare comunque, aggiungere a cronologia)
   - Griglia vuota dopo aver scoperto tutto

---

## Crediti

**Crypta** - Gioco da tavolo di Luca Di Gialleonardo

App companion v1.0
