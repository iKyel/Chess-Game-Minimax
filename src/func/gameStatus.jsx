// gameStatus.js
export const updateGameOverStatus = (game) => {
    let result = ""; // Kết quả cuối cùng
  
    if (game.isGameOver()) {
      if (game.turn() === "b") {
        result = "Bạn thắng!";
      } else {
        result = "AI thắng!";
      }
    } else if (game.isDraw()) {
      result = "Hòa!";
    } else {
      result = "Trò chơi kết thúc!";
    }
  
    // Cập nhật thông tin trạng thái lên phần tử HTML
    const gameOverElement = document.getElementById("is-game-over");
    if (gameOverElement) {
      gameOverElement.innerHTML = `Trạng thái: ${result}`;
    }
    
  };
  