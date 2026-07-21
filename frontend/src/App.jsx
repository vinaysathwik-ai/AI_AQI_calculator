import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import Prediction from "./pages/Prediction/Prediction";
import Analytics from "./pages/Analytics/Analytics";
import MapPage from "./pages/Map/MapPage";
import About from "./pages/About/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>

          <Route path="/" element={<Dashboard />} />

          <Route path="/prediction" element={<Prediction />} />

          <Route path="/analytics" element={<Analytics />} />

          <Route path="/map" element={<MapPage />} />

          <Route path="/about" element={<About />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;