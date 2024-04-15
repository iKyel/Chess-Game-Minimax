
# Chess AI

Đây là một dự án về AI (Trí tuệ nhân tạo) cho trò chơi Cờ vua được xây dựng với React.js và chess.js. Dự án cung cấp các tính năng sau:

## Tính năng

1. **Random Move**: AI di chuyển một nước đi ngẫu nhiên.
2. **Evaluation Function**: AI đánh giá giá trị của bàn cờ hiện tại và di chuyển theo nước đi có giá trị tốt nhất.
3. **Minimax**: AI sử dụng thuật toán Minimax để tìm nước đi tốt nhất dựa trên độ sâu tìm kiếm được chọn.
4. **Alpha-Beta Pruning**: AI sử dụng thuật toán Minimax với cắt tỉa Alpha-Beta để tăng hiệu suất tìm kiếm.
5. **Simplified Evaluation Function**: AI sử dụng một hàm đánh giá cải thiện hơn để đánh giá giá trị của bàn cờ.

## Cài đặt

1. Cài đặt [Node.js](https://nodejs.org/) nếu bạn chưa có.
2. Clone dự án này: `https://github.com/iKyel/Chess-Game-Minimax.git`
3. Chuyển đến thư mục dự án: `cd Chess-Game-Minimax`
4. Cài đặt các gói phụ thuộc: `npm install`

## Chạy dự án

1. Khởi động ứng dụng React: `npm run dev`
2. Truy cập `http://localhost:5173/` trong trình duyệt.

## Công nghệ sử dụng

- React.js
- chess.js
- Tailwind CSS
- chessboard.jsx

## Tác giả