import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Chess } from "chess.js";

import Chessboard from "chessboardjsx";

const HumanVsHuman = ({ children }) => {
  const [fen, setFen] = useState("start"); // vị trí các quân trên bàn cờ
  const [dropSquareStyle, setDropSquareStyle] = useState({}); // kiểu dáng khi kéo thả quân cờ
  const [squareStyles, setSquareStyles] = useState({}); // kiểu dáng cho ô vuông trên bàn cờ
  const [pieceSquare, setPieceSquare] = useState(""); // ô vuông hiện tại được chọn
  const [history, setHistory] = useState([]); // lịch sử nước đi
  const [game, setGame] = useState(); // game

  useEffect(() => {
    setGame(new Chess());
  }, []);

  // Loại bỏ màu ô vuông được tô
  const removeHighlightSquare = () => {
    setSquareStyles(squareStyling({ pieceSquare, history }));
  };

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

  // Kéo thả quân cờ từ vị trí nguồn đến vị trí được chọn
  const onDrop = ({ sourceSquare, targetSquare }) => {
    if (!isMoveLegal(sourceSquare, targetSquare)) {
      return;
    }

    game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q"
    });
      
    setFen(game.fen());
    setHistory(game.history({ verbose: true }));
    setSquareStyles(squareStyling({ pieceSquare, history }));
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

  // Loại bỏ tô sáng khi di chuột
  const onMouseOutSquare = (square) => removeHighlightSquare(square);

  // ô vuông với nước đi hợp lệ
  const onDragOverSquare = (square) => {
    setDropSquareStyle(
      // square === "e4" || square === "d4" || square === "e5" || square === "d5"
      //   ? { backgroundColor: "cornFlowerBlue" }
      //   : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }
    );
  };
  
  // Nhấp chuột vào một ô vuông
  const onSquareClick = (square) => {
    setSquareStyles(squareStyling({ pieceSquare: square, history }));
    setPieceSquare(square);

    let move = game.move({
      from: pieceSquare,
      to: square,
      promotion: "q"
    });

    if (move === null) return;

    setFen(game.fen());
    setHistory(game.history({ verbose: true }));
    setPieceSquare("");
  };

  const onSquareRightClick = (square) => {
    setSquareStyles({ [square]: { backgroundColor: "Green" } });
  };

  return children({
    squareStyles,
    position: fen,
    onMouseOverSquare,
    onMouseOutSquare,
    onDrop,
    dropSquareStyle,
    onDragOverSquare,
    onSquareClick,
    onSquareRightClick
  });
};

HumanVsHuman.propTypes = {
  children: PropTypes.func
};

const WithMoveValidation = () => {
  return (
    <div>
      <HumanVsHuman>
        {({
          position,
          onDrop,
          onMouseOverSquare,
          onMouseOutSquare,
          squareStyles,
          dropSquareStyle,
          onDragOverSquare,
          onSquareClick,
          onSquareRightClick
        }) => (
          <Chessboard
            id="humanVsHuman"
            width={550}
            position={position}
            onDrop={onDrop}
            onMouseOverSquare={onMouseOverSquare}
            onMouseOutSquare={onMouseOutSquare}
            boardStyle={{
              borderRadius: "5px",
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
            }}
            squareStyles={squareStyles}
            dropSquareStyle={dropSquareStyle}
            onDragOverSquare={onDragOverSquare}
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick}
          />
        )}
      </HumanVsHuman>
    </div>
  );
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

export default WithMoveValidation;
