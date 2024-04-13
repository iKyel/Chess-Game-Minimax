import WithMoveValidation from "../__test__/withMoveValidation";
const MoveValidationPage = () => {
  return (
    <>
      <div className="flex-grow ml-60 mr-32 pt-4">
        <h1 className="text-3xl font-bold mb-4">Move Validation</h1>
        <WithMoveValidation />
      </div>
    </>
  );
};

export default MoveValidationPage;
