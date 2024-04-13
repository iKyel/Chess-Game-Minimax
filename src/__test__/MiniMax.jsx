import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";

const Board = ({ children }) => {
  const [game, setGame] = useState();
  const [fen, setFen] = useState("start");
  const [allPositionCount, setAllPostitionCount] = useState(0);
  let positionCount = 0;

  // const [moveHistory, setMoveHistory] = useState([]);

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
    setFen(game.fen());

    makeBestMove(game);
    setFen(game.fen());
    if (game.isGameOver()) {
      document.getElementById("isGameOver").innerHTML += `Game Over`;
      // setAllowDrag(false);
    }
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
  const makeBestMove = (game) => {
    let bestMove = getBestMove(game);
    if (bestMove === null) {
      return;
    }
    game.move(bestMove);
  };

  const getBestMove = (game) => {
    const depthSelect = document.getElementById("depth-select");
    const depth = parseInt(depthSelect.value);
    let bestMove = minimaxRoot(depth, game, true);

    return bestMove;
  };

  const minimaxRoot = (depth, game, isMaximisingPlayer) => {
    let newAIMoves = game.moves({});
    let bestValue = -9999;
    let bestMoveFound = null;

    for (let i = 0; i < newAIMoves.length; i++) {
      let newAIMove = newAIMoves[i];
      game.move(newAIMove);
      let value = minimax(depth - 1, game, !isMaximisingPlayer);
      game.undo();
      if (value >= bestValue) {
        bestValue = value;
        bestMoveFound = newAIMove;
      }
    }

    document.getElementById("bestValue").innerHTML =
      `Giá trị tốt nhất: ${-bestValue}` + " ";
    document.getElementById("postitionCount").innerHTML =
      `Số vị trí đã tính toán: ${positionCount}` + " ";
    document.getElementById("allPostitionCount").innerHTML =
      `Tổng số vị trí đã tính toán: ${allPositionCount+positionCount}` + " ";

    return bestMoveFound;
  };

  const minimax = (depth, game, isMaximisingPlayer) => {
    positionCount++;
    setAllPostitionCount((count) => count + 1);
    if (depth === 0) {
      return -evaluateBoard(game.board()); // tra ve -10
    }

    let newAIMoves = game.moves({});

    if (isMaximisingPlayer) {
      let value = -9999;
      for (let i = 0; i < newAIMoves.length; i++) {
        game.move(newAIMoves[i]);
        value = Math.max(value, minimax(depth - 1, game, !isMaximisingPlayer));
        game.undo();
      }
      return value;
    } else {
      let value = 9999;
      for (let i = 0; i < newAIMoves.length; i++) {
        game.move(newAIMoves[i]);
        value = Math.min(value, minimax(depth - 1, game, !isMaximisingPlayer));
        game.undo();
      }
      return value;
    }
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

  const handleUndo = () => {
    game.undo();
    setFen(game.fen());
  };

  return children({
    position: fen,
    onDrop,
    handleUndo,
    // allowDrag,
  });
};

const MiniMax = () => {
  return (
    <div>
      <div>
        <Board>
          {({ onDrop, position, handleUndo }) => (
            <div className="flex justify-between">
              <Chessboard
                width={600}
                position={position}
                onDrop={onDrop}
              />
              <div className="minimax-info ml-4">
                <button
                  onClick={handleUndo}
                  className="bg-indigo-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                >
                  Undo
                </button>
                <label className="block">Độ sâu:</label>
                <select
                  id="depth-select"
                  className="block w-200 bg-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="1">1</option>
                  <option value="2">
                    2
                  </option>
                  <option value="3" selected>3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <p id="postitionCount">Số vị trí đã tính toán: </p>
                <p id="allPostitionCount">Tổng số vị trí đã tính toán: </p>
                <p id="bestValue">Giá trị tốt nhất: </p>
                <p id="history"></p>
                <p id="isGameOver">Trạng thái: </p>
              </div>
            </div>
          )}
        </Board>
      </div>
    </div>
  );
};

export default MiniMax;
