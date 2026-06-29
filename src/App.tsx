import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import MatchPage from "./pages/MatchPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/sport/football" replace />} />
          <Route path="sport/:sportId" element={<HomePage />} />
          <Route path="match/:sportId/:matchId" element={<MatchPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
