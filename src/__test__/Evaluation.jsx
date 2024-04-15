import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import ChessBoard from "chessboardjsx";
import { updateGameOverStatus } from "../func/gameStatus";
import RenderMoveHistory from "../func/renderMoveHistory";
import squareStyling from "../func/squareStyling";
import { getValidMoves } from "../func/chess";
import highlightSquare from "../func/highlightSquare";
import { isMoveLegal } from "../func/chess";

const Board = ({ children }) => {
  const [game, setGame] = useState();
  const [fen, setFen] = useState("start");
  const [squareStyles, setSquareStyles] = useState({});
  const [history, setHistory] = useState([]); // lịch sử nước đi
  const [pieceSquare] = useState("");

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

    const aiMove = calculateBestMove(game);
    if (aiMove !== null) {
      // Kiểm tra nếu aiMove không phải null
      game.move(aiMove);

    }
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

  const handleUndo = () => {
    game.undo();
    setFen(game.fen());
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
    document.getElementById(
      "best-value"
    ).innerHTML = `Giá trị tốt nhất: ${-bestValue}`;
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
    squareStyles,
    onMouseOverSquare,
    onMouseOutSquare,
    history,
    handleUndo,
  });
};

const Evaluation = () => {
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
            <ChessBoard
              wwidth={600}
              position={position}
              onDrop={onDrop}
              squareStyles={squareStyles}
              onMouseOverSquare={onMouseOverSquare}
              onMouseOutSquare={onMouseOutSquare}
            />
            <div className="evaluation-info ml-4">
              <RenderMoveHistory moves={history} />
              <button
                onClick={handleUndo}
                className="bg-indigo-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
              >
                Undo
              </button>
              <p id="best-value">Giá trị tốt nhất: </p>
              <p id="is-game-over">Trạng thái: </p>
            </div>
          </div>
        )}
      </Board>
    </div>
  );
};

export default Evaluation;
