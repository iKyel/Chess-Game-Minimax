import {
  RouterProvider,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import BoardTestPage from "./pages/BoardTestPage";
import EvaluationPage from "./pages/EvaluationPage";
import MinimaxPage from "./pages/MinimaxPage";
import Alpha_betaPruningPage from "./pages/Alpha_betaPruningPage";
import SimplifiedEvaluationFunctionPage from "./pages/SimplifiedEvaluationFunctionPage";
import RandomeMovPage from "./pages/RandomMovePage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/test/BoardTest" element={<BoardTestPage />} />
      <Route path="/test/RandomMove" element={<RandomeMovPage />} />
      <Route path="/test/Evaluation" element={<EvaluationPage />}/>
      <Route path="/test/Minimax" element={<MinimaxPage />} />
      <Route path="/test/AlphaBetaPruning" element={<Alpha_betaPruningPage />} />
      <Route path="/test/SimplifiedEvaluationFunction" element={<SimplifiedEvaluationFunctionPage />} />
    </Route>
  )
);
const App = () => {
  return (
    <div className="flex h-screen text-1xl">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
