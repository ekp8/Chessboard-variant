// Attack logic for 10x8 chess variant with custom pieces
// This file handles piece attack patterns and calculations

class AttackCalculator {
  constructor() {
    this.fileLetters = 'abcdefghij';
  }

  // Helper function to check if coordinates are valid
  isValidSquare(fileIndex, rank) {
    return fileIndex >= 0 && fileIndex <= 9 && rank >= 1 && rank <= 8;
  }

  // Helper function to convert file index and rank to square notation
  getSquareFromCoords(fileIndex, rank) {
    if (!this.isValidSquare(fileIndex, rank)) return null;
    return this.fileLetters[fileIndex] + rank;
  }

  // Helper function to add attack if valid
  addAttackIfValid(attacks, fileIndex, rank) {
    const square = this.getSquareFromCoords(fileIndex, rank);
    if (square) attacks.push(square);
  }

  // Helper function for sliding piece attacks (with blocking)
  addSlidingAttacks(attacks, startFileIndex, startRank, directions, position) {
    directions.forEach(([df, dr]) => {
      for (let i = 1; i < 10; i++) {
        const newF = startFileIndex + (df * i);
        const newR = startRank + (dr * i);
        
        if (!this.isValidSquare(newF, newR)) break;
        
        const targetSquare = this.getSquareFromCoords(newF, newR);
        attacks.push(targetSquare);
        
        // Stop if there's a piece blocking the path
        if (position[targetSquare]) break;
      }
    });
  }

  // Get all squares attacked by a specific piece
  getPieceAttacks(piece, square, position, lastMove = null) {
    const attacks = [];
    const [file, rank] = [square[0], parseInt(square[1])];
    const fileIndex = this.fileLetters.indexOf(file);
    const isWhite = piece[0] === 'w';
    const pieceType = piece[1];

    switch (pieceType) {
      case 'P': // Pawn
        const direction = isWhite ? 1 : -1;
        // Pawn attacks diagonally
        this.addAttackIfValid(attacks, fileIndex - 1, rank + direction);
        this.addAttackIfValid(attacks, fileIndex + 1, rank + direction);
        
        // En passant logic
        if (lastMove && lastMove.from && lastMove.to) {
          const lastMoveFromRank = parseInt(lastMove.from[1]);
          const lastMoveToRank = parseInt(lastMove.to[1]);
          const lastMoveFileIndex = this.fileLetters.indexOf(lastMove.to[0]);
          
          // Check if last move was a pawn moving 2 squares
          const wasPawnDoubleMove = Math.abs(lastMoveToRank - lastMoveFromRank) === 2;
          const lastMovedPiece = position[lastMove.to];
          const wasOpponentPawn = lastMovedPiece && lastMovedPiece[1] === 'P' && lastMovedPiece[0] !== piece[0];
          
          if (wasPawnDoubleMove && wasOpponentPawn) {
            // Check if current pawn is on the correct rank for en passant
            const correctRank = isWhite ? 5 : 4;
            if (rank === correctRank) {
              // Check if current pawn is adjacent to the pawn that just moved
              const isAdjacent = Math.abs(fileIndex - lastMoveFileIndex) === 1 && rank === lastMoveToRank;
              if (isAdjacent) {
                // Add the pawn that moved 2 squares as being attacked (en passant capture)
                this.addAttackIfValid(attacks, lastMoveFileIndex, lastMoveToRank);
              }
            }
          }
        }
        break;

      case 'R': // Rook
        // Horizontal and vertical attacks with blocking
        this.addSlidingAttacks(attacks, fileIndex, rank, 
          [[0, 1], [0, -1], [1, 0], [-1, 0]], position);
        break;

      case 'N': // Knight
        const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
        knightMoves.forEach(([df, dr]) => {
          this.addAttackIfValid(attacks, fileIndex + df, rank + dr);
        });
        break;

      case 'B': // Bishop
        // Diagonal attacks with blocking
        this.addSlidingAttacks(attacks, fileIndex, rank, 
          [[1, 1], [1, -1], [-1, 1], [-1, -1]], position);
        break;

      case 'Q': // Queen (Rook + Bishop)
        // Combine rook and bishop attacks with blocking
        this.addSlidingAttacks(attacks, fileIndex, rank, 
          [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]], position);
        break;

      case 'K': // King
        for (let df = -1; df <= 1; df++) {
          for (let dr = -1; dr <= 1; dr++) {
            if (df !== 0 || dr !== 0) {
              this.addAttackIfValid(attacks, fileIndex + df, rank + dr);
            }
          }
        }
        break;

      case 'S': // Sentinel - attacks like king, but only 3 squares ahead on ranks 1 or 2
        if (rank === 1 || rank === 2) {
          // On first or second rank, only attack 3 squares directly ahead
          const direction = isWhite ? 1 : -1;
          // Three squares directly ahead (left-forward, forward, right-forward)
          this.addAttackIfValid(attacks, fileIndex - 1, rank + direction);
          this.addAttackIfValid(attacks, fileIndex, rank + direction);
          this.addAttackIfValid(attacks, fileIndex + 1, rank + direction);
        } else {
          // On other ranks, attacks like a normal king (all 8 adjacent squares)
          for (let df = -1; df <= 1; df++) {
            for (let dr = -1; dr <= 1; dr++) {
              if (df !== 0 || dr !== 0) {
                this.addAttackIfValid(attacks, fileIndex + df, rank + dr);
              }
            }
          }
        }
        break;

      case 'X': // Berserker - attacks exactly 2 squares away in any direction, can jump pieces
        // All 8 directions, exactly 2 squares away
        const berserkerMoves = [
          [0, 2], [0, -2],     // Up and down 2
          [2, 0], [-2, 0],     // Left and right 2
          [2, 2], [2, -2],     // Diagonal 2
          [-2, 2], [-2, -2]    // Diagonal 2
        ];
        berserkerMoves.forEach(([df, dr]) => {
          this.addAttackIfValid(attacks, fileIndex + df, rank + dr);
        });
        break;
    }

    return attacks;
  }

  // Calculate all attacks for both sides
  calculateAllAttacks(position, lastMove = null) {
    const whiteAttacks = new Set();
    const blackAttacks = new Set();

    Object.keys(position).forEach(square => {
      const piece = position[square];
      const attacks = this.getPieceAttacks(piece, square, position, lastMove);
      
      if (piece[0] === 'w') {
        attacks.forEach(attack => whiteAttacks.add(attack));
      } else {
        attacks.forEach(attack => blackAttacks.add(attack));
      }
    });

    return { whiteAttacks, blackAttacks };
  }
}

// Export for use in other files
window.AttackCalculator = AttackCalculator;
