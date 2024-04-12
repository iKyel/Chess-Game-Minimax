import Chessboard from "chessboardjsx";
import Board from "./Board";

const BoardTest = () => {
  return (
    <>
      <Board>
        {({
          onDrop,
          position,
          squareStyles,
          onMouseOverSquare,
          onMouseOutSquare,
        }) => (
          <Chessboard
            width={600}
            position={position}
            onDrop={onDrop}
            squareStyles={squareStyles}
            onMouseOverSquare={onMouseOverSquare}
            onMouseOutSquare={onMouseOutSquare}
          />
        )}
      </Board>
    </>
  );
};

export default BoardTest;
