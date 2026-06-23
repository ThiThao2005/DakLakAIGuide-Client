import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Places from "./pages/Places";
import OcopProducts from "./pages/OcopProducts";
import Culture from "./pages/Culture";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/places" element={<Places />} />
        <Route path="/ocop" element={<OcopProducts />} />
        <Route path="/culture" element={<Culture />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;