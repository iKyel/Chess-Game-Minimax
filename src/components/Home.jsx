const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-5xl font-bold mb-4">
            Bài tập lớn AI cờ vua - môn học ứng dụng trí tuệ nhân tạo.
          </h1>
          <div className="mb-4">
            <p className="font-bold">Nhóm 5:</p>
            <ul className="list-disc list-inside">
              <li>Đỗ Xuân Kiên</li>
              <li>Nguyễn Việt Hoàng</li>
              <li>Bùi Văn Hào</li>
            </ul>
          </div>
          <a
            href="/test/SimplifiedEvaluationFunction"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Thử sức ngay
          </a>
        </div>
        <div>
          <img
            src="https://www.chess.com/bundles/web/images/offline-play/standardboard.1d6f9426.png"
            alt="Play Chess Online"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
