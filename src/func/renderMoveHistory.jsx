import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const RenderMoveHistory = ({ moves }) => {
  const historyElementRef = useRef(null);

  useEffect(() => {
    if (historyElementRef.current) {
      historyElementRef.current.scrollTop =
        historyElementRef.current.scrollHeight;
    }
  }, [moves]);

  return (
    <div>
      <div
        id="move-history"
        ref={historyElementRef}
        className="max-h-48 overflow-y-auto border border-gray-300 rounded"
      >
        {moves.map((move, index) => (
          <div key={index} className="p-2">
            {index}: {move}
          </div>
        ))}
      </div>
    </div>
  );
};

RenderMoveHistory.propTypes = {
  moves: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RenderMoveHistory;
