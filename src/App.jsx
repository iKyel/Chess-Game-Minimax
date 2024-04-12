import {
  RouterProvider,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import MoveValidationPage from "./pages/MoveValidationPage";
import BoardTestPage from "./pages/BoardTestPage";
import EvaluationPage from "./pages/EvaluationPage";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/test/MoveValidation" element={<MoveValidationPage/>}/>
      <Route path="/test/Evaluation" element={<EvaluationPage />}/>
      <Route path="/test/BoardTest" element={<BoardTestPage />} />
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
