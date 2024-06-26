import { useState } from "react";

const Navbar = () => {
  const [showTestMenu, setShowTestMenu] = useState(false);

  const handleTestMenuHover = () => {
    setShowTestMenu(true);
  };

  const handleTestMenuLeave = () => {
    setShowTestMenu(false);
  };
  return (
    <>
      <nav className="bg-gray-800 py-4 flex items-start justify-between fixed top-0 left-0 h-screen">
        <div className="container mx-auto flex flex-col items-start w-full">
          <div>
            <a href="/" className="text-white font-bold text-1xl py-px px-4">
              Chess.com
            </a>
          </div>

          <div className="flex flex-col items-start">
            <div
              className=" hover:bg-gray-700 cursor-pointer w-full flex justify-between"
              onMouseEnter={handleTestMenuHover}
              onMouseLeave={handleTestMenuLeave}
            >
              <a
                href="/"
                className="text-white hover:text-green-300  my-2.5 px-4"
              >
                Chế độ
              </a>
              {showTestMenu && (
                <div className="bg-gray-800 absolute top-0 left-full mt-0.5 w-64 h-full">
                  <div className="hover:bg-gray-700 cursor-pointer">
                    <a
                      href="/test/BoardTest"
                      className="text-white block px-4 py-2"
                    >
                      Bàn cờ vua
                    </a>
                  </div>

                  <div className="hover:bg-gray-700 cursor-pointer">
                    <a
                      href="/test/RandomMove"
                      className="text-white block px-4 py-2"
                    >
                      Nước đi ngẫu nhiên
                    </a>
                  </div>
                  
                  <div className="hover:bg-gray-700 cursor-pointer">
                    <a
                      href="/test/Evaluation"
                      className="text-white block px-4 py-2"
                    >
                      Evaluation
                    </a>
                  </div>
                  

                  <div className="hover:bg-gray-700 cursor-pointer">
                    <a
                      href="/test/Minimax"
                      className="text-white block px-4 py-2"
                    >
                      Minimax
                    </a>
                  </div>

                  <div className="hover:bg-gray-700 cursor-pointer">
                    <a
                      href="/test/AlphaBetaPruning"
                      className="text-white block px-4 py-2"
                    >
                      Cắt Tỉa Alpha Beta 
                    </a>
                  </div>

                  <div className="hover:bg-gray-700 cursor-pointer">
                    <a
                      href="/test/SimplifiedEvaluationFunction"
                      className="text-white block px-4 py-2"
                    >
                      Hàm đánh giá đơn giản 
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="hover:bg-gray-700 cursor-pointer w-full flex justify-between">
              <a
                href="/puzzles"
                className="text-white hover:text-green-300 mb-2 my-2.5 px-4"
              >
                Puzzles
              </a>
            </div>
            <div className="hover:bg-gray-700 cursor-pointer w-full flex justify-between">
              <a
                href="/news"
                className="text-white hover:text-green-300 mb-2 my-2.5 px-4"
              >
                News
              </a>
            </div>
            <div className="hover:bg-gray-700 cursor-pointer w-full flex justify-between">
              <a
                href="/community"
                className="text-white hover:text-green-300 mb-2 my-2.5 px-4"
              >
                Community
              </a>
            </div>

            <div className="hover:bg-gray-700 cursor-pointer w-full flex justify-between">
              <a
                href="/login"
                className="text-white hover:text-green-300 mb-4 my-2.5 px-4"
              >
                Login
              </a>
            </div>

            <div className="hover:bg-gray-700 cursor-pointer w-full flex justify-between px-4">
              <a
                href="/signup"
                className="bg-green-600 text-white px-4 py-2 rounded my-4"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
