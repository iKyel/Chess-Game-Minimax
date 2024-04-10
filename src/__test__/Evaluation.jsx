import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";

const Evaluation = () => {
  const [game, setGame] = useState(new Chess());
  const [events, setEvents] = useState({});

  useEffect(() => {
    const handleMove = (move) => {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);
      if (result) {
        setGame(gameCopy);
      }
    };

    setEvents({ onMove: handleMove });

    return () => {}; // Cleanup function
  }, [game]);

  const calculateBestMove = () => {
    const newGameMoves = game.ugly_moves();
    let bestMove = null;
    let bestValue = -9999;

    for (let i = 0; i < newGameMoves.length; i++) {
      const newGameMove = newGameMoves[i];
      const gameCopy = new Chess(game.fen());
      gameCopy.ugly_move(newGameMove);
      const boardValue = -evaluateBoard(gameCopy.board());
      gameCopy.undo();
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
    if (piece === null) {
      return 0;
    }
    const getAbsoluteValue = (piece) => {
      if (piece.type === "p") {
        return 10;
      } else if (piece.type === "r") {
        return 50;
      } else if (piece.type === "n") {
        return 30;
      } else if (piece.type === "b") {
        return 30;
      } else if (piece.type === "q") {
        return 90;
      } else if (piece.type === "k") {
        return 900;
      }
      throw "Unknown piece type: " + piece.type;
    };

    const absoluteValue = getAbsoluteValue(piece, piece.color === "w");
    return piece.color === "w" ? absoluteValue : -absoluteValue;
  };

  const makeBestMove = () => {
    const bestMove = calculateBestMove(game);
    const gameCopy = new Chess(game.fen());
    gameCopy.ugly_move(bestMove);
    setGame(gameCopy);
  };

  return (
    <div>
      <div className="flex-grow ml-60 mr-32 pt-4">
        <Chessboard
          position={game.fen()}
          boardOrientation="white"
          setEvents={events}
        />
        <button onClick={makeBestMove}>Make Best Move</button>
      </div>
    </div>
  );
};

export default Evaluation;
