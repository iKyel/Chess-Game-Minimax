const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-5xl font-bold mb-4">Play Chess Online</h1>
          <p className="mb-4">
            Join over 50 million players and enjoy the ultimate online chess
            experience. Play against the computer or challenge a friend in
            real-time.
          </p>
          <a
            href="/home"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Play Now
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

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Featured Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Các trò chơi nổi bật sẽ được hiển thị tại đây */}
        </div>
      </div>
    </div>
  );
};

export default Home;