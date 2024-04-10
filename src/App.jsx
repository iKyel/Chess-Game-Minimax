import {
  RouterProvider,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import MoveValidationPage from "./pages/MoveValidationPage";
import StockfishPage from "./pages/StockfishPage";
import Evaluation from "./__test__/Evaluation";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/test/MoveValidation" element={<MoveValidationPage/>}/>
      <Route path="/test/Stockfish" element={<StockfishPage />}/>
      <Route path="/test/Evaluation" element={<Evaluation />}/>
    </Route>
  )
);
const App = () => {
  return (
    <div className="flex h-screen text-1xl">
      <RouterProvider router={router} />
    </div>
    /* {/* <div className="flex h-screen text-1xl">
      <Navbar />
      <div className="flex-grow ml-60 mr-32 pt-4">
        <Home />
        <WithMoveValidation />
      </div>
    </div> */
  );
};

export default App;
