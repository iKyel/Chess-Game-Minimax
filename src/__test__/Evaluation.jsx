import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import ChessBoard from "chessboardjsx";

const Board = ({ children }) => {
  const [game, setGame] = useState();
  const [fen, setFen] = useState("start");

  useEffect(() => {
    setGame(new Chess());
  }, []);

  /* Hiển thị bàn cờ */

  // Di chuyển quân cờ
  const onDrop = ({ sourceSquare, targetSquare }) => {
    if (!isMoveLegal(sourceSquare, targetSquare)) {
      return;
    }

    game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    const aiMove = calculateBestMove(game);
    game.move(aiMove);
    setFen(game.fen());
  };

  // Kiểm tra nước đi hợp lệ
  const isMoveLegal = (sourceSquare, targetSquare) => {
    const moves = game.moves({ verbose: true });
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].from === sourceSquare && moves[i].to === targetSquare) {
        return true;
      }
    }
    return false;
  };

  /* AI Part */

  /* 
  Tính toán giá trị tốt nhất theo tổng giá trị bàn cờ
  Nếu giá trị âm => đen có lợi thế
  */
  const calculateBestMove = (game) => {
    const newGameMoves = game.moves({ verbose: true });
    let bestMove = null;
    let bestValue = -9999; // giá trị âm lớn để khởi tạo
    for (let i = 0; i < newGameMoves.length; i++) {
      const newGameMove = newGameMoves[i];
      game.move(newGameMove);

      // Đánh giá giá trị bàn cờ sau khi di chuyển
      const boardValue = -evaluateBoard(game.board());
      game.undo();

      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMove = newGameMove;
      }
    }
    return bestMove;
  };
  
  const evaluateBoard = (board) => {
    let totalEvaluation = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        totalEvaluation += getPieceValue(board[i][j]);
      }
    }
    return totalEvaluation;
  };

  const getPieceValue = (piece) => {
    if (piece == null) {
      return 0;
    }
    const absoluteValue = getAbsoluteValue(piece.type);
    return piece.color === "w" ? absoluteValue : -absoluteValue;
  };

  const getAbsoluteValue = (piece) => {
    switch (piece) {
      case "p":
        return 10;
      case "r":
        return 50;
      case "n":
        return 30;
      case "b":
        return 30;
      case "q":
        return 90;
      case "k":
        return 900;
      default:
        throw new Error(`Cờ ${piece} không đúng loại`);
    }
  };

  return children({
    position: fen,
    onDrop,
  });
};
const Evaluation = () => {
  return (
    <div>
      <Board>
        {({ onDrop, position }) => (
          <ChessBoard width={600} position={position} onDrop={onDrop} />
        )}
      </Board>
    </div>
  );
};

export default Evaluation;
