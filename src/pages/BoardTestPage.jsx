import BoardTest from "../__test__/BoardTest";

const BoardTestPage = () => {
  return (
    <>
      <div className="flex-grow ml-96 mr-32 pt-4">
        <h1 className="text-3xl font-bold mb-4">Tạo nước đi và hiển thị bàn cờ</h1>
        <BoardTest />
      </div>
    </>
  );
};

export default BoardTestPage;
