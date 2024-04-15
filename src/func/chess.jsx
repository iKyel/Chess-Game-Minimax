// chess.js

// Kiểm tra nước đi hợp lệ
export const isMoveLegal = (game, sourceSquare, targetSquare) => {
    const moves = game.moves({ verbose: true });
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].from === sourceSquare && moves[i].to === targetSquare) {
        return true;
      }
    }
    return false;
  };
  
// Lấy danh sách nước đi hợp lệ
export const getValidMoves = (game, square) => {
  if (!game) return []
  const moves = game.moves({
    square: square,
    verbose: true,
  });

  if (moves.length === 0) return [];

  return moves.map(move => move.to);
};
  