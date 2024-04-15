import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";
import RenderMoveHistory from "../func/renderMoveHistory";
import { isMoveLegal } from "../func/chess";
import { getValidMoves } from "../func/chess";
import squareStyling from "../func/squareStyling";
import highlightSquare from "../func/highlightSquare";
import { updateGameOverStatus } from "../func/gameStatus";

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
    setFen(game.fen());
    makeBestMove(game);
    setHistory(game.history());
    setFen(game.fen());

    // Cập nhật trạng thái kết thúc trò chơi
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
  const makeBestMove = (game) => {
    let bestMove = calculateBestMove(game);
    if (bestMove === null || bestMove === undefined) {
      return;
    }
    game.move(bestMove);
  };

  const calculateBestMove = (game) => {
    const newGameMoves = game.moves({ verbose: true });
    const randomMove =
      newGameMoves[Math.floor(Math.random() * newGameMoves.length)];
    return randomMove;
  };

  /* End AI Part */

  return children({
    position: fen,
    onDrop,
    squareStyles,
    onMouseOverSquare,
    onMouseOutSquare,
    history,
  });
};

const RandomMove = () => {
  return (
    <div>
      <Board>
        {({
          onDrop,
          position,
          squareStyles,
          onMouseOverSquare,
          onMouseOutSquare,
          history
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
            <div className="random-info ml-4">
              <RenderMoveHistory moves={history} />
              <p id="is-game-over">Trạng thái: </p>
            </div>
          </div>
        )}
      </Board>
    </div>
  );
};

export default RandomMove;
