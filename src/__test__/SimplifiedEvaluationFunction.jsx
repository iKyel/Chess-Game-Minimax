import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";
import { updateGameOverStatus } from "../func/gameStatus";
import { isMoveLegal } from "../func/chess";
import RenderMoveHistory from "../func/renderMoveHistory";
import { getValidMoves } from "../func/chess";
import highlightSquare from "../func/highlightSquare";
import squareStyling from "../func/squareStyling";

const Board = ({ children }) => {
  const [game, setGame] = useState();
  const [fen, setFen] = useState("start");
  const [squareStyles, setSquareStyles] = useState({});
  const [history, setHistory] = useState([]); // lịch sử nước đi
  const [pieceSquare] = useState("");
  const [allPositionCount, setAllPostitionCount] = useState(0);
  let positionCount = 0;

  useEffect(() => {
    setGame(new Chess());
  }, []);

  /* Hiển thị bàn cờ */

  // Di chuyển quân cờ
  const onDrop = ({ sourceSquare, targetSquare }) => {
    if (!isMoveLegal(game, sourceSquare, targetSquare)) {
      return;
    }

    game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    setFen(game.fen());

    makeBestMove(game);
    setHistory(game.history());
    setFen(game.fen());
    updateGameOverStatus(game);
  };

  // Lấy danh sách nước đi hợp lệ
  const onMouseOverSquare = (square) => {
    const validMoves = getValidMoves(game, square);
    const highlightedStyles = highlightSquare(square, validMoves); // Tạo highlightStyles từ hàm highlightSquare
    setSquareStyles((prevStyles) => ({ ...prevStyles, ...highlightedStyles })); // Cập nhật squareStyles
  };

  // Loại bỏ màu ô vuông được tô
  const removeHighlightSquare = () => {
    setSquareStyles(squareStyling({ pieceSquare, history }));
  };

  // Loại bỏ tô sáng khi di chuột
  const onMouseOutSquare = (square) => removeHighlightSquare(square);

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
    let newAIMoves = game.moves({ verbose: true });
    let bestValue = -9999;
    let bestMoveFound = null;

    for (let i = 0; i < newAIMoves.length; i++) {
      let newAIMove = newAIMoves[i];
      game.move(newAIMove);
      let value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
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
      `Tổng số vị trí đã tính toán: ${allPositionCount + positionCount}` + " ";
    return bestMoveFound;
  };

  const minimax = (depth, game, alpha, beta, isMaximisingPlayer) => {
    positionCount++;
    setAllPostitionCount((count) => count + 1);
    if (depth === 0) {
      return -evaluateBoard(game.board()); // tra ve -10
    }

    let newAIMoves = game.moves({ verbose: true });

    if (isMaximisingPlayer) {
      let bestValue = -9999;
      for (let i = 0; i < newAIMoves.length; i++) {
        game.move(newAIMoves[i]);
        bestValue = Math.max(
          bestValue,
          minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer)
        );
        game.undo();

        /* Cắt tỉa alpha beta */
        alpha = Math.max(alpha, bestValue);
        if (beta <= alpha) {
          return bestValue;
        }
      }
      return bestValue;
    } else {
      let bestValue = 9999;
      for (let i = 0; i < newAIMoves.length; i++) {
        game.move(newAIMoves[i]);
        bestValue = Math.min(
          bestValue,
          minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer)
        );
        game.undo();

        /* Cắt tỉa alpha beta */
        beta = Math.min(beta, bestValue);
        if (beta <= alpha) {
          return bestValue;
        }
      }
      return bestValue;
    }
  };

  const evaluateBoard = (board) => {
    let totalEvaluation = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        totalEvaluation += getPieceValue(board[i][j], i, j);
      }
    }
    return totalEvaluation;
  };

  let reverseArray = (arr) => {
    return arr.slice().reverse();
  };

  let pawnEvalWhite = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
    [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
    [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
    [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
    [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
    [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  ];

  let pawnEvalBlack = reverseArray(pawnEvalWhite);

  let knightEval = [
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
    [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
    [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
    [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
    [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
    [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
    [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  ];

  let bishopEvalWhite = [
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
    [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
    [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
    [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  ];

  let bishopEvalBlack = reverseArray(bishopEvalWhite);

  let rookEvalWhite = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0],
  ];

  let rookEvalBlack = reverseArray(rookEvalWhite);

  let evalQueen = [
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  ];

  let kingEvalWhite = [
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
    [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0],
  ];

  let kingEvalBlack = reverseArray(kingEvalWhite);

  const getPieceValue = (piece, x, y) => {
    if (piece === null) {
      return 0;
    }
    const absoluteValue = getAbsoluteValue(
      piece.type,
      piece.color === "w",
      x,
      y
    );
    return piece.color === "w" ? absoluteValue : -absoluteValue;
  };

  const getAbsoluteValue = (piece, isWhite, x, y) => {
    switch (piece) {
      case "p":
        return 10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
      case "r":
        return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
      case "n":
        return 30 + knightEval[y][x];
      case "b":
        return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
      case "q":
        return 90 + evalQueen[y][x];
      case "k":
        return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
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
    squareStyles,
    onMouseOverSquare,
    onMouseOutSquare,
    history,
    handleUndo,
  });
};

const SimplifiedEvaluationFunction = () => {
  return (
    <div>
      <Board>
        {({
          onDrop,
          position,
          squareStyles,
          onMouseOverSquare,
          onMouseOutSquare,
          history,
          handleUndo,
        }) => (
          <div className="flex justify-between">
            <Chessboard
              width={600}
              position={position}
              onDrop={onDrop}
              squareStyles={squareStyles}
              onMouseOverSquare={onMouseOverSquare}
              onMouseOutSquare={onMouseOutSquare}
            />
            <div className="minimax-info ml-4">
              <RenderMoveHistory moves={history} />
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
                <option value="2">2</option>
                <option value="3" selected>
                  3
                </option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <p id="postitionCount">Số vị trí đã tính toán: </p>
              <p id="allPostitionCount">Tổng số vị trí đã tính toán: </p>
              <p id="bestValue">Giá trị tốt nhất: </p>
              <p id="history"></p>
              <p id="is-game-over">Trạng thái: </p>
            </div>
          </div>
        )}
      </Board>
    </div>
  );
};

export default SimplifiedEvaluationFunction;
