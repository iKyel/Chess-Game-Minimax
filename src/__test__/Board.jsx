import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import PropTypes from "prop-types";

const Board = ({ children }) => {
  const [fen, setFen] = useState("start")
  const [game, setGame] = useState();
  const [squareStyles, setSquareStyles] = useState({}); // kiểu dáng cho ô vuông trên bàn cờ
  const [history, setHistory] = useState([]); // lịch sử nước đi
  const [pieceSquare, setPieceSquare] = useState("");

  useEffect(() => {
    setGame(new Chess());
  }, []);

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

    setFen(game.fen())
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

  // Lấy danh sách nước đi hợp lệ
  const onMouseOverSquare = (square) => {
    let moves = game.moves({
      square: square,
      verbose: true
    });

    if (moves.length === 0) return;

    let squaresToHighlight = [];
    for (var i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }

    highlightSquare(square, squaresToHighlight);
  };

  // Loại bỏ màu ô vuông được tô
  const removeHighlightSquare = () => {
    setSquareStyles(squareStyling({ pieceSquare, history }));
  };

  // Loại bỏ tô sáng khi di chuột
  const onMouseOutSquare = (square) => removeHighlightSquare(square);

  // Tô màu ô vuông
  const highlightSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          [c]: {
            background: "radial-gradient(circle, #fffc00 36%, transparent 40%)",
          }
        };
      },
      {}
    );

    setSquareStyles((prevStyles) => ({ ...prevStyles, ...highlightStyles }));
  };

  const squareStyling = ({ pieceSquare, history }) => {
    const sourceSquare = history.length && history[history.length - 1].from;
    const targetSquare = history.length && history[history.length - 1].to;
  
    return {
      [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
      ...(history.length && {
        [sourceSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)"
        }
      }),
      ...(history.length && {
        [targetSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)"
        }
      })
    };
  };

  return children({
    position: fen,
    onDrop,
    squareStyles,
    onMouseOverSquare,
    onMouseOutSquare
  });
};

Board.PropTypes = {
  children: PropTypes.func,
};

export default Board;
