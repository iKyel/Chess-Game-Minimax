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
  
    return highlightStyles;
  };
  
  export default highlightSquare;
  