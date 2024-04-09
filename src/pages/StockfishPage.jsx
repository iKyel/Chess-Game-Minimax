import Stockfish from "../__test__/Stockfish";
import Chessboard from "chessboardjsx";
const StockfishPage = () => {
  return (
    <div>
      <div className="flex-grow ml-60 mr-32 pt-4">
        <Stockfish>
          {({ position, onDrop }) => (
            <Chessboard
              id="stockfish"
              position={position}
              width={320}
              onDrop={onDrop}
              orientation="black"
            />
          )}
        </Stockfish>
      </div>
    </div>
  );
};

export default StockfishPage;
