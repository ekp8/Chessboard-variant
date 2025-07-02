# ♞ Chessboard Variant

An online chess variant with 2 new piece types and custom rules.

**Play now:** [Chessboard Variant Web App](https://ekp8.github.io/Chessboard-variant/)

---

## Features

- Standard Chess Mode
- Swap Bishops and Knights
- Planned: 9 Row Variant
- Last Move Highlighting and Undo
- Two-Player Mode

---

## Board Setup (10×8)

- **White at bottom**

| Position | a | b | c | d | e | f | g | h | i | j |
|:--------:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 8 (Black Home)  | R | N | B | X | Q | K | S | B | N | R |
| 7 (Black Pawns) | P | P | P | P | P | P | P | P | P | P |
| 2 (White Pawns) | p | p | p | p | p | p | p | p | p | p |
| 1 (White Home)  | r | n | b | x | q | k | s | b | n | r |

- `X` = Berserker (4th file, queenside)
- `S` = Sentinel (7th file, kingside)

---

## Piece Abilities

### 💥 Berserker (`X`)

- Appears on d-file (queenside)
- Moves and captures exactly **2 squares** (straight or diagonally), passing through pieces/obstacles
- Can move backward normally
- **Allowed repositioning move:** 1 square in any direction
- Role: Sneaky attacker; breaks tight pawn structures; easier to predict than knights

### 🛡️ Sentinel (`S`)

- Appears on g-file (kingside)
- Moves like a king: 1 square any direction
- Can hop over pawns (friendly or enemy), but not capture on the hop
- Can only capture **forwards** on the 1st and 2nd ranks (the 3 squares ahead)
- Role: Flexible strategic disruptor, especially in early/mid-game

---

## Castling (10×8 Adaptation)

- **Kingside:**  
  - King: f → h  
  - Rook: j → g
- **Queenside:**  
  - King: f → c  
  - Rook: a → d
- Standard castling conditions apply (pieces unmoved, clear path, not in/check/check-through)

---

## Instructions

- Open the [Chessboard Variant Web App](https://ekp8.github.io/Chessboard-variant/)
- Play in your browser, no install required

---

## Roadmap

- Implement 9-row variant
- Add online multiplayer
- Chess engine for playing against PC mode 

---

## License

MIT
